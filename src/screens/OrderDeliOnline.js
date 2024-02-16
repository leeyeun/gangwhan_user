import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image, ScrollView, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import messaging from '@react-native-firebase/messaging';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Checkbox, Menu } from 'react-native-paper';
import style from '../style/style';
import { AuthContext } from '../contexts/auth-context';
import { AppContext } from '../contexts/app-context';
import { CartContext } from '../contexts/cart-context';
import { MemoryContext } from '../contexts/memory-context';
import API from '../api';
import Button from '../components/Button';
import colors from '../appcolors';
import cstyles from '../cstyles';
import { number_format_pipe, address_pipe } from '../pipes';
import { basicErrorHandler } from '../http-error-handler';
import MobileAuthModal from '../components/MobileAuthModal';


const onlineOfflineOptions = [
    { key: 'F', name: '현장결제', subname: '<만나서 직접결제>' },
    { key: 'O', name: '온라인결제', subname: '<앱에서 미리결제>' },
];

const onlinePayMethodOptions = [
    { key: 'card', name: '카드결제' },
];

const offlinePayMethodOptions = [
    { key: 'card', name: '카드결제' },
    { key: 'dbank', name: '계좌이체' },
];

const formSchema = Yup.object().shape({
    od_name: Yup.string().required('필수입력값입니다.'),
    online_offline: Yup.object().nullable().required('필수입력값입니다.'),
    od_settle_case: Yup.object().nullable().required('필수입력입니다.'),
});

// 일반주문 Form
export default function OrderDeliOnline({ route, navigation }) {
    const { cartInfo, division, fetchCart } = useContext(CartContext);
    const { myAddress } = useContext(MemoryContext);
    const { me } = useContext(AuthContext);
    const { showAlert, showSnackbar } = useContext(AppContext);
    

    const [orderModal, setOrderModal] = useState(false);

    const toggleOrderModal = () => {
        setOrderModal(!orderModal);
    };

    // ---------- coupon ----------
    const [ coupon, setCoupon ] = useState();     // 사용쿠폰
    const [ availableCoupons, setAvailableCoupons ] = useState();  // 사용가능한 쿠폰 숫자
    useEffect(() => {
        if (me) {
            const params = { mb_id: me.mb_id };
            API.get('/coupon/get_my_coupons.php', { params })
            .then((data) => {
                const availables = data.data.filter(item => item.use_flag == 'N');
                setAvailableCoupons(availables);
            })
            .catch(basicErrorHandler);
        }
    }, [ me ]);

    // callback: coupon selection
    useEffect(() => {
        if (route.params?.coupon) {
            setCoupon(route.params.coupon);
        }
    }, [ route.params?.coupon ]);
    // ---------- end: coupon ----------

    // 핸드폰 인증
    useEffect(() => {
        if (!me) return;
        setHpAuthenticated(me.hp_authenticated === 'Y');
        setMobile(me.mb_hp);
    },[ me ]);

    const [ hpAuthenticated, setHpAuthenticated ] = useState(false);
    const [ mobile, setMobile ] = useState('');  // 수취인 핸드폰번호
    const [ mobileAuthModalOpen, setMobileAuthModalOpen ] = useState(false);
    
    const handleHpAuthenticatePress = () => {
        setMobileAuthModalOpen(true);
    }

    const authenticatedCallback = (result) => { 
        showSnackbar('인증되었습니다.');
        setMobileAuthModalOpen(false);
        setHpAuthenticated(true);
        setMobile(result);
    }

    const handleGoMyinfoPress = () => { navigation.navigate('Myinfo'); }
    // end: 핸드폰 인증


    const handleSubmit = async (values, actions) => {
        try {
            if (!division) return showAlert('전달방법(배달/포장) 를 설정해야 합니다.');
            if (values.online_offline.key == 'O' && values.od_settle_case.key == 'dbank') return showAlert('온라인 결제시 계좌이체 결제를 할 수 없습니다.');
            if (values.online_offline.key == 'F' && values.od_settle_case.key == 'vbank') return showAlert('현장결제시 가상계좌를 사용할 수 없습니다.');

            if (division == 'delivery') {
                if (!myAddress) return showAlert('주소를 설정해 주시기 바랍니다.');
            }

            if (!hpAuthenticated) return showAlert('핸드폰 인증을 해주세요.');
            if (!mobile) return showAlert('핸드폰 번호를 입력해주세요.');
            if (mobile.length < 10 || mobile.length > 11) return showAlert('핸드폰번호를 숫자만 올바르게 입력해주세요.');

            const token = await messaging().getToken();

            const data = {
                token,
                mb_id: me?.mb_id,
                od_delv_flag: division == 'delivery' ? 'D' : 'P',
                online_offline: values.online_offline.key,
                od_settle_case: values.od_settle_case.key,
                od_shop_memo: values.od_shop_memo,
                od_memo: values.od_memo,
                od_disposables: values.od_disposables,
                mc_id: coupon ? coupon.mc_id : null,
            };

            if (myAddress) {
                myAddress.name = values.od_name;
                myAddress.contact = mobile;
                data['user_address'] = {
                    ...myAddress,
                    name: values.od_name,
                    contact: mobile,
                }
            }
            else {
                data['user_address'] = {
                    name: values.od_name,
                    contact: mobile,
                };
            }

            const body = JSON.stringify(data);
            const result = await API.post('/order/add_order_v2.php', body);
            const od_id = result.data.od_id;

            // 오프라인일 경우 카트정보 갱신이 필요함
            if (values.online_offline.key == 'F') {  
                fetchCart();
            }

            if (values.online_offline.key == 'O') {
                navigation.navigate('PayIamport', { od_id });
            }
            else {
                navigation.navigate('Main');
                navigation.navigate('MyOrderDetail', { od_id });
            }

            actions.setSubmitting(false);
        }
        catch(error) {
            actions.setSubmitting(false);
            basicErrorHandler(error);
        }
    }

    // 배달비
    const [ od_send_cost, setOd_send_cost ] = useState(0);
    useEffect(() => {
        if (division == 'delivery') {
            if (cartInfo && cartInfo.store && myAddress) {
                if (!(cartInfo.store.sl_lat && cartInfo.store.sl_lon)) return showAlert('매장의 주소가 설정되지 않았습니다.\n관리자에게 문의하세요.');
                const params = {
                    from_lat: cartInfo.store.sl_lat,
                    from_lon: cartInfo.store.sl_lon,
                    to_lat: myAddress.lat,
                    to_lon: myAddress.lon,
                };
                API.get('/common/get_price_from_positions.php', { params })
                .then(data => {
                    setOd_send_cost(data.data.price);
                })
                .catch(basicErrorHandler);
            }     
        }
    }, [ cartInfo, myAddress, division ]);

    // 주문금액
    const cartPrice = useMemo(() => {
        return cartInfo ? cartInfo.info.total_price : 0;
    }, [ cartInfo ]);

    // 할인금액
    const discountPrice = useMemo(() => {
        if (coupon) {
            return +coupon.cp_price;
        }
        else {
            return 0;
        }
    }, [ coupon ]);

    // 결제금액
    const receiptPrice = useMemo(() => {
        return cartPrice + od_send_cost - discountPrice;
    }, [ cartPrice, od_send_cost, discountPrice ]);

    const storeMemoRef = useRef();
    const riderMemoRef = useRef();
    const [ onlineOfflineMenuOpen, setOnlineOfflineMenuOpen ] = useState(false);
    const [ paymethodMenuOpen, setPayMethodMenuOpen ] = useState(false);

    return (
        <>
            {cartInfo && <Formik
                enableReinitialize={true}
                initialValues={{ 
                    od_name: me?.mb_name || '',
                    od_shop_memo: '',                       // 상점전달 메모
                    od_memo: '',                            // 라이더 메모
                    od_disposables: 'N',
                    online_offline: onlineOfflineOptions[0],
                    od_settle_case: onlinePayMethodOptions[0],    // 결제 매개체
                }}
                validationSchema={formSchema}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, dirty, touched, errors, isValid, values, isSubmitting }) => <>
                    <ScrollView contentContainerStyle={[{justifyContent: 'space-between', backgroundColor: 'white'}]}>
                        <View style={{padding: 15 }}>
                            {/* 주소 */}
                            {division == 'delivery' && <>
                                <Text style={styles.subtitle}>주소</Text>
                                
                                {myAddress ? <>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View>
                                            <Text style={{ fontSize: 16, color: colors.textPrimary }}>{address_pipe(myAddress)}</Text>
                                            <Text style={{ marginTop: 5, fontSize: 16, color: '#777777' }}>{myAddress.address_detail}</Text>
                                        </View>
                                        <TouchableOpacity style={{ height: 30, width: 70, borderWidth: 1, borderColor: '#E51A47', alignItems: 'center', justifyContent: 'center', borderRadius: 5, }} onPress={() => { navigation.navigate('AddressInput') }}>
                                            <Text style={{fontSize: 16, color: '#E51A47'}}>주소설정</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center'}}>
                                        <Image source={require('../images/warning.png')}></Image>
                                        <Text style={{color: '#E51A47'}}> 주소가 맞는지 확인해주세요</Text>
                                    </View>
                                    {/* <Button onPress={clearMyAddress}>주소 삭제</Button> */}
                                </> : <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 16, color: colors.textSecondary }}>주소를 설정하세요.</Text>
                                    <TouchableOpacity style={{ height: 30, width: 70, borderWidth: 1, borderColor: '#E51A47', alignItems: 'center', justifyContent: 'center', borderRadius: 5, }} onPress={() => { navigation.navigate('AddressInput') }}>
                                        <Text style={{fontSize: 16, color: '#E51A47'}}>주소설정</Text>
                                    </TouchableOpacity>
                                </View>}
                                <View style={{ height: 1, backgroundColor: '#E5E5E5', marginVertical: 20, }}></View>
                            </>}
                            

                            {/* 성함 */}
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline'}}>
                                    <Text style={styles.subtitle}>수취인 성함 <Text style={{ color: colors.textSecondary, fontSize: 14, fontWeight: 'normal' }}>(필수)</Text></Text>
                                    
                                    <Text style={{ marginLeft: 16, color: 'red' }}>{touched.od_name && errors.od_name || ' '}</Text>
                                </View>
                                <TextInput 
                                    style={[cstyles.input]}
                                    returnKeyType="done"
                                    value={values.od_name}
                                    onChangeText={handleChange('od_name')}
                                    onBlur={handleBlur('od_name')}
                                />
                            </>
                            <View style={{ height: 1, backgroundColor: '#E5E5E5', marginVertical: 20, }}></View>

                            {/* 연락처 */}
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline'}}>
                                    <Text style={styles.subtitle}>연락처 <Text style={{ color: colors.textSecondary, fontSize: 14, fontWeight: 'normal' }}>(필수)</Text></Text>
                                </View>
                                
                                {/* 고객이 왜인지 모르겠는데 로그인했을시에는 전화번호 editable 가능하도록 해달라고 함 */}
                                {hpAuthenticated ? <>
                                    <TextInput 
                                        editable={!!me}
                                        style={[cstyles.input]}
                                        keyboardType="phone-pad"
                                        returnKeyType="next"
                                        onSubmitEditing={() => { storeMemoRef.current.focus(); }}
                                        value={mobile}
                                        onChangeText={setMobile}
                                    />
                                    <Text style={{color: colors.primary, fontSize: 12, marginTop: 8}}>{'연락처가 맞는지 확인해주세요.'}</Text>
                                </> : <>
                                    {me ? <Button mode="outlined" onPress={handleGoMyinfoPress}>내페이지에서 핸드폰 인증하기</Button>
                                        : <Button mode="outlined" onPress={handleHpAuthenticatePress}>핸드폰 번호 인증</Button>}
                                </>}
                            </>
                        </View>

                        <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>
                        <View style={{ paddingHorizontal: 15, paddingTop: 15, backgroundColor: 'white', }}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>요청사항 <Text style={{ color: colors.textSecondary, fontSize: 14, fontWeight: 'normal' }}>(선택)</Text></Text>
                            <View style={{marginVertical: 10}}>
                                <Text style={styles.subcontents}>매장 사장님에게</Text>
                                <TextInput 
                                    ref={storeMemoRef}
                                    style={[cstyles.input, { marginVertical: 10, }]}
                                    returnKeyType="next"
                                    onSubmitEditing={() => { riderMemoRef.current && riderMemoRef.current.focus(); }}
                                    value={values.od_shop_memo}
                                    onChangeText={handleChange('od_shop_memo')}
                                    onBlur={handleBlur('od_shop_memo')}
                                />
                                {division == 'delivery' && <>
                                    <Text style={styles.subcontents}>라이더님에게</Text>
                                    <TextInput 
                                        ref={riderMemoRef}
                                        style={[cstyles.input, { marginVertical: 10, height: 45, borderWidth: 1, borderRadius: 5, borderColor: '#CCCCCC', marginVertical: 10, }]} 
                                        value={values.od_memo}
                                        onChangeText={handleChange('od_memo')}
                                        onBlur={handleBlur('od_memo')}
                                    />
                                </>}
                                
                                {/* 일회용품 */}
                                {cartInfo.store.use_disposables === 'Y' && <TouchableOpacity style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' }} onPress={() => { setFieldValue('od_disposables', values.od_disposables === 'Y' ? 'N' : 'Y'); }}>
                                    <Checkbox.Android color="#E51A47" status={values.od_disposables === 'Y' ? 'checked' : 'unchecked'} />
                                    <Text style={styles.subcontents}>일회용품 요청</Text>
                                </TouchableOpacity>}
                            </View>
                        </View>
                        <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>

                        {/* 결제방법 */}
                        <View style={{ padding: 15 }}>
                            <View style={{ marginBottom: 16, alignItems: 'baseline', flexDirection: 'row' }}>
                                <Text style={{ marginBottom: 16, fontSize: 18, fontWeight: 'bold'}}>결제방법</Text>
                                <Text style={{ marginLeft: 8, fontSize: 14, color: 'red' }}>{'<현장 or 온라인>'}</Text>
                            </View>

                            <Menu
                                visible={onlineOfflineMenuOpen}
                                onDismiss={() => { setOnlineOfflineMenuOpen(false) }}
                                anchor={
                                    <TouchableOpacity onPress={() => setOnlineOfflineMenuOpen(true)}>
                                        <View style={{ ...cstyles.input, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 16 }}>{values.online_offline?.name}</Text>
                                                <Text style={{ marginLeft: 10, fontSize: 14, fontWeight: 'bold' }}>{values.online_offline?.subname}</Text>
                                            </View>
                                            <Image source={require('../images/accordionicon2.png')} style={{ width: 20, height: 11 }} />
                                        </View>
                                    </TouchableOpacity>
                                }
                            >
                                {onlineOfflineOptions.map(item => <Menu.Item key={item.key} onPress={() => { 
                                    setFieldValue('online_offline', item);
                                    setOnlineOfflineMenuOpen(false);
                                }} title={`${item.name}  ${item.subname}`} />)}
                            </Menu>
                            
                            <View style={{ marginTop: 10 }}>
                                <Menu
                                    visible={paymethodMenuOpen}
                                    onDismiss={() => { setPayMethodMenuOpen(false) }}
                                    anchor={
                                        <TouchableOpacity onPress={() => setPayMethodMenuOpen(true)}>
                                            <View style={{ ...cstyles.input, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 16 }}>{values.od_settle_case?.name || '결제방법을 선택해주세요.'}</Text>
                                                <Image source={require('../images/accordionicon2.png')} style={{ width: 20, height: 11 }} />
                                            </View>
                                        </TouchableOpacity>
                                    }
                                >
                                    {values.online_offline.key == 'O' && onlinePayMethodOptions.map(item => <Menu.Item key={item.key} onPress={() => { setFieldValue('od_settle_case', item); setPayMethodMenuOpen(false); }} title={item.name} />)}
                                    {values.online_offline.key == 'F' && offlinePayMethodOptions.map(item => <Menu.Item key={item.key} onPress={() => { setFieldValue('od_settle_case', item); setPayMethodMenuOpen(false); }} title={item.name} />)}
                                </Menu>
                            </View>
                            <Text style={{ color: 'red' }}>{touched.od_settle_case && errors.od_settle_case || ' '}</Text>
                        </View>
                        <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>
                        
                        {/* 쿠폰 */}
                        <View style={{padding: 15, backgroundColor: 'white'}}>
                            {availableCoupons && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, }}>
                                <Text style={style.text2}>쿠폰</Text>
                                <TouchableWithoutFeedback onPress={() => {  if (availableCoupons.length > 0) navigation.navigate('MyCoupon', { intend: 'use', sl_sn: cartInfo.store.sl_sn }); }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
                                        {coupon ? <Text style={style.text2}>선택됨</Text> : <Text style={style.text2}>{availableCoupons.length}개 보유</Text>}
                                        <Image source={require('../images/rightbtn.png')}></Image>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>}

                            <View style={{ height: 1, backgroundColor: '#E5E5E5', marginVertical: 20, }}></View>

                            {division == 'delivery' && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, }}>
                                <Text style={style.text2}>배달비</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
                                    {myAddress ? <Text style={style.text2}>{number_format_pipe(od_send_cost)}원</Text> : <Text style={style.text2}>주소를 설정하세요.</Text>}
                                </View>
                            </View>}
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, }}>
                                <Text style={style.text2}>주문금액</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
                                    <Text style={style.text2}>{number_format_pipe(cartPrice)}원</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, }}>
                                <Text style={style.text2}>할인금액</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
                                    <Text style={style.text2}>{number_format_pipe(discountPrice)}원</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
            
                    <View style={{ borderTopLeftRadius: 15, borderTopRightRadius: 15, backgroundColor: 'white' }}>
                        <View style={styles.footer}>
                            <View style={styles.footer1}>
                                <Text style={{fontSize: 18}}>결제금액</Text>
                                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{number_format_pipe(receiptPrice)}</Text>
                                    <Text style={{fontSize: 20}}> 원</Text>
                                </View>
                            </View>
                            <View style={{ margin: 15, marginTop: 0 }}><Button disabled={isSubmitting} loading={isSubmitting} onPress={handleSubmit}>{values.online_offline == 'O' ? '결제하기' : '주문하기'}</Button></View>
                        </View>
                    </View>
                </>}
            </Formik>}
            
            
            <Modal isVisible={orderModal} onRequestClose={toggleOrderModal}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <View style={{ backgroundColor: 'white', width: '100%', padding: 20, alignItems: 'center', }}>
                        <Image source={require('../images/warningcircle.png')} style={{ width: 66, height: 66 }}></Image>
                        <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>주문이 정상적으로 완료되지 않았습니다.</Text>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', marginTop: 25, }}>
                            <TouchableOpacity style={styles.modalOk} onPress={() => { setOrderModal(false) }}>
                                <Text style={styles.modalBtnFont}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <MobileAuthModal visible={mobileAuthModalOpen} setVisible={setMobileAuthModalOpen} authenticatedCallback={authenticatedCallback} />
        </>
    );
}

const styles = StyleSheet.create({
    subtitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
    footer: { justifyContent: 'flex-end', backgroundColor: 'white', },
    footer1: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderTopWidth: 0.5, borderTopColor: '#E5E5E5', marginBottom: 10, paddingTop: 20, backgroundColor: 'white' },
    subcontents: {color: '#777777', fontSize: 16},
    modalCancel: { backgroundColor: '#777777', width: '50%', marginRight: 5, alignItems: 'center', justifyContent: 'center', height: 45, borderRadius: 5 },
    modalOk: { backgroundColor: '#E51A47', width: '50%', marginLeft: 5, alignItems: 'center', justifyContent: 'center', height: 45, borderRadius: 5 },
    modalBtnFont: {color: 'white', fontSize: 16, fontWeight: 'bold'},
});
