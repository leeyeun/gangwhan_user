import React, { useState, useContext, useEffect, useRef, useMemo, Fragment } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image, ScrollView, TextInput, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { Formik } from 'formik';
import * as Yup from 'yup';
import style from '../style/style';
import { AuthContext } from '../contexts/auth-context';
import { AppContext } from '../contexts/app-context';
import { MemoryContext } from '../contexts/memory-context';
import API from '../api';
import Button from '../components/Button';
import colors from '../appcolors';
import cstyles from '../cstyles';
import { number_format_pipe } from '../pipes';
import { basicErrorHandler } from '../http-error-handler';
import AddressForm from '../components/AddressForm';
import { Menu } from 'react-native-paper';
import MobileAuthModal from '../components/MobileAuthModal';
import {RadioButton, Checkbox} from 'react-native-paper';


const Essential = () => <Text style={{ color: colors.textSecondary, fontSize: 14, fontWeight: 'normal' }}>(필수)</Text>
const Optional = () => <Text style={{ color: colors.textSecondary, fontSize: 14, fontWeight: 'normal' }}>(선택)</Text>


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

const FormSchema = Yup.object().shape({
    item_name: Yup.string().required('필수입력입니다.'),
    online_offline: Yup.object().nullable().required('필수입력값입니다.'),
    od_settle_case: Yup.object().nullable().required('필수입력입니다.'),
    user_name: Yup.string().required('필수입력입니다.'),        // 주문자 성함
    start_address: Yup.object().required('필수입력입니다.'),
    start_hp: Yup.string().required('필수입력입니다.'),
    end_address: Yup.object().required('필수입력입니다.'),
    end_hp: Yup.string().required('필수입력입니다.'),
    op_type_1: Yup.string().required('필수선택입니다.'),
});

export default function QuickDelivery({navigation, route}) {
    const { me } = useContext(AuthContext);
    const { showAlert, showSnackbar } = useContext(AppContext);
    const { myAddress } = useContext(MemoryContext);

    // 핸드폰 인증
    useEffect(() => {
        if (!me) return;
        setHpAuthenticated(me.hp_authenticated === 'Y');
        setMobile(me.mb_hp);
    },[ me ]);

    const [ hpAuthenticated, setHpAuthenticated ] = useState(false);
    const [ mobile, setMobile ] = useState('');  // 주문하는 사람 핸드폰번호
    const [ mobileAuthModalOpen, setMobileAuthModalOpen ] = useState(false);
    
    const handleHpAuthenticatePress = () => { setMobileAuthModalOpen(true); }

    const authenticatedCallback = (result) => { 
        showSnackbar('인증되었습니다.');
        setHpAuthenticated(true);
        setMobile(result);
        setMobileAuthModalOpen(false);
    }

    const handleGoMyinfoPress = () => { navigation.navigate('Myinfo'); }
    // end: 핸드폰 인증

    const handleSubmit = async (values, actions) => {

        try {
            if (!hpAuthenticated || !mobile) return showAlert('핸드폰 인증을 해주세요.');

            const token = await messaging().getToken();

            const user_address = {
                name: values.user_name,
                contact: mobile,
            };

            const start_address = {
                ...values.start_address,
                contact: values.start_hp,
            };

            const end_address = {
                ...values.end_address,
                contact: values.end_hp,
            }

            const data = {
                mb_id: me ? me.mb_id : '',
                token,
                online_offline: values.online_offline.key,
                od_settle_case: values.od_settle_case.key,
                od_memo: values.od_memo,
                item_name: values.item_name,
                item_weight: values.item_weight * 1000,
                mc_id: coupon ? coupon.mc_id : null,
                user_address,
                start_address,
                end_address,
                op_type_1: values.op_type_1,
                op_type_2: values.op_type_2,
            };

            

            const body = JSON.stringify(data);
            console.log(body);
            const result = await API.post('/order/add_quick_order_v3.php', body);
            console.log(result);
            const od_id = result.data.od_id;
            
            if (values.online_offline.key == 'O') {
                navigation.navigate('PayIamport', { od_id });
            }
            else {
                navigation.popToTop();
                navigation.navigate('MyOrderDetail', { od_id });
            }

            actions.setSubmitting(false); 
        }
        catch(error) {
            basicErrorHandler(error);
            actions.setSubmitting(false); 
        }
    }
    
    // 배달팁
    const [ od_send_cost, setOd_send_cost ] = useState();
    const checkSendCost = (start, end) => {
        const from_lat = start?.lat;
        const from_lon = start?.lon;
        const to_lat = end?.lat;
        const to_lon = end?.lon;
        
        if (from_lat && from_lon && to_lat && to_lon) {
            const params = { from_lat, from_lon, to_lat, to_lon };
            
            API.get('/common/get_price_from_positions2.php', { params })
            .then(data => {
                setOd_send_cost(data.data.price);
            })
            .catch(basicErrorHandler);
        }
    }
    // end: 배달팁

    // 옵션 Array
    const [optionArray, setOptionArray] = useState([]);
    const [optionCost, setOptionCost ] = useState(0);
    const [optionChecked, setOptionChecked] = useState(false);
    // 옵션 Array - 서버
    useEffect(() => {
        API.get('/common/get_delivery_option.php', {})
        .then(data => {
            data.data.map(el => ({...el, checked: false}));
            console.log(data.data);
            setOptionArray(data.data);
        })
        .catch(basicErrorHandler);
    }, []);

    // 옵션 선택시 체크 여부 저장
    const handleOptionItemPressed = (item, itemIndex) => {
        //필수 항목 선택시
        if(item.op_type == 1){
            setOptionArray(
                optionArray.map(item2 => item2.op_type == 1 ? item2.op_id === item.op_id ? {...item2, checked: item2.checked ? false : true} : {...item2, checked: false} : item2)
            );
            if(item.checked){
                setOptionChecked(false);
            }else{
                setOptionChecked(true);
            }
        }
        //선택 항목 선택시
        else if(item.op_type == 2){
            setOptionArray(
                // optionArray.map(item2 => item2.op_id === item.op_id ? {...item2, checked: item2.checked ? false : true} : item2)
                optionArray.map(item2 => item2.op_type == 2 ? item2.op_id === item.op_id ? {...item2, checked: item2.checked ? false : true} : {...item2, checked: false} : item2)
            );
        }
        
    }

    useEffect(() => {
        let optionCost2 = 0; 
        optionArray.forEach(el => {
            if(el.checked){optionCost2 += Number(el.op_price)}
        });
        setOptionCost(optionCost2);
    }, [optionArray]);
    // end: 옵션

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

    // 할인금액
    const discountPrice = useMemo(() => {
        if (coupon) {
            return +coupon.cp_price;
        }
        else {
            return 0;
        }
    }, [ coupon ]);

    // callback: coupon selection
    useEffect(() => {
        if (route.params?.coupon) {
            setCoupon(route.params.coupon);
        }
    }, [ route.params?.coupon ]);
    // ---------- end: coupon ----------

    const totalPrice = useMemo(() => {
        if (od_send_cost) {
            return od_send_cost - discountPrice + optionCost;
        }
        else {
            return '-';
        }
    }, [ discountPrice, od_send_cost, optionCost ]);

    const [ paymethodMenuOpen, setPayMethodMenuOpen ] = useState(false);
    const [ onlineOfflineMenuOpen, setOnlineOfflineMenuOpen ] = useState(false);

    const item_weightRef = useRef();
    const nameRef = useRef();



    return (
        <Formik
            initialValues={{ 
                online_offline: onlineOfflineOptions[0],
                od_settle_case: onlinePayMethodOptions[0],
                item_name: '',
                item_weight: '',
                od_memo: '',
                user_name: me ? me.mb_name : '',        // 주문자 성함
                start_address: {},
                start_hp: '',
                end_address: myAddress || {},
                end_hp: '',
                op_type_1: '',
                op_type_2: ''
            }}
            validationSchema={FormSchema}
            onSubmit={handleSubmit}
        >
            {({handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, dirty, touched, errors, isValid, values, isSubmitting }) => <>
                <ScrollView contentContainerStyle={[{justifyContent: 'space-between'}]}>
                    <View style={{ paddingHorizontal: 15, paddingTop: 15, backgroundColor: 'white', }}>
                        {/* 상품이름 */}
                        <View style={styles.section}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>배달상품 <Essential /></Text>
                            <TextInput
                                style={[cstyles.input, { marginTop: 10 }]}
                                placeholder="배달상품을 간략히 입력해주세요."
                                placeholderTextColor={'#757575'}
                                returnKeyType="next"
                                onSubmitEditing={() => { item_weightRef.current.focus(); }}
                                value={values.item_name}
                                onChangeText={handleChange('item_name')}
                                onBlur={handleBlur('item_name')}
                            />
                            <Text style={{ color: 'red' }}>{touched.item_name && errors.item_name || ' '}</Text>
                        </View>

                        {/* 무게 */}
                        <View style={styles.section}>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                <Text style={{fontSize: 18, fontWeight: 'bold'}}>무게</Text>
                                <Text style={{ color: '#E51A47', fontSize: 12, marginLeft: 10 }}>정확한 무게를 모른다면 공란으로 두어도 무방</Text>
                            </View>
                            <TextInput
                                ref={item_weightRef}
                                style={[cstyles.input, { marginTop: 10 }]}
                                placeholder="무게를 kg 단위로 입력해주세요."
                                placeholderTextColor={'#757575'}
                                keyboardType="numeric"
                                returnKeyType="next"
                                onSubmitEditing={() => { nameRef.current.focus(); }}
                                value={values.item_weight}
                                onChangeText={handleChange('item_weight')}
                                onBlur={handleBlur('item_weight')}
                            />
                            <Text style={{ color: 'red' }}>{touched.item_weight && errors.item_weight || ' '}</Text>
                        </View>

                        {/* 주문자 성함 */}
                        <View style={styles.section}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>주문자 성함 <Essential /></Text>
                            <TextInput
                                ref={nameRef}
                                style={[cstyles.input, { marginTop: 10 }]}
                                placeholder="주문자 성함을 입력하세요."
                                placeholderTextColor={'#757575'}
                                returnKeyType="done"
                                value={values.user_name}
                                onChangeText={handleChange('user_name')}
                                onBlur={handleBlur('user_name')}
                            />
                            <Text style={{ color: 'red' }}>{touched.user_name && errors.user_name || ' '}</Text>
                        </View>
                        
                        {/* 출발지 */}
                        <View style={[styles.section, { marginTop: 10}]}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>출발지 <Essential /></Text>
                            <AddressForm 
                                address={values.start_address} 
                                contact={values.start_hp} 
                                setContact={value => setFieldValue('start_hp', value)} 
                                disableAutoInitiate={true}
                                invisible={true}
                                setAddress={value => {
                                    setFieldValue('start_address', value); 
                                    if (value.lat !== values.start_address?.lat || value.lon !== values.start_address?.lon) {   // 조건을 안걸면 api 를 너무 많이 보냄
                                        checkSendCost(value, values.end_address); 
                                    }
                                }} 
                            />
                            <Text style={{ color: 'red' }}>{touched.start_address && errors.start_address || ' '}</Text>
                            <Text style={{ color: 'red' }}>{touched.start_hp && errors.start_hp || ' '}</Text>
                        </View>

                        {/* 도착지 */}
                        <View style={[styles.section, { marginTop: 10}]}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>도착지 <Essential /></Text>
                            <AddressForm 
                                address={values.end_address} 
                                contact={values.end_hp} 
                                setContact={value => setFieldValue('end_hp', value)} 
                                disableAutoInitiate={true} 
                                invisible={true}
                                setAddress={value => { 
                                    setFieldValue('end_address', value); 
                                    if (value.lat !== values.end_address?.lat || value.lon !== values.end_address?.lon) {
                                        checkSendCost(values.start_address, value); 
                                    }
                                }} 
                            />
                            <Text style={{ color: 'red' }}>{touched.end_address && errors.end_address || ' '}</Text>
                            <Text style={{ color: 'red' }}>{touched.end_hp && errors.end_hp || ' '}</Text>
                        </View>

                        {/* 요청사항 */}
                        <View style={[styles.section, { marginBottom: 20 }]}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>라이더님에게 요청할 사항 <Optional /></Text>
                            <TextInput 
                                style={[cstyles.input, { marginTop: 10 }]} 
                                placeholder={'라이더님에게 요청할 사항을 입력하세요.'}
                                placeholderTextColor={'#757575'}
                                returnKeyType="done"
                                value={values.od_memo}
                                onChangeText={handleChange('od_memo')}
                                onBlur={handleBlur('od_memo')}
                            />
                        </View>

                        {/* {필수 옵션} */}
                        {optionArray.filter(el => el.op_type == 1).length > 0 &&
                            <View style={[styles.section, { marginBottom: 20 }]}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>옵션1 <Text style={{ marginLeft: 8, fontSize: 16, color: colors.danger }}>(필수선택)</Text></Text>
                                    <View>
                                        {optionArray.filter(el => el.op_type == 1).map((item, itemIndex) => 
                                        <Fragment key={item.op_id}>
                                            <TouchableWithoutFeedback onPress={() => {item.checked ? setFieldValue('op_type_1', '') : setFieldValue('op_type_1', item.op_id),  handleOptionItemPressed(item, itemIndex)}}>
                                                <View style={styles.radioBox}>
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        <RadioButton.Android color="#E51A47" status={item.checked ? 'checked' : 'unchecked' } onPress={() => {item.checked ? setFieldValue('op_type_1', '') : setFieldValue('op_type_1', item.op_id), handleOptionItemPressed(item, itemIndex)}} />
                                                        <Text style={style.text2}>{item.op_name}</Text>
                                                    </View>
                                                    <Text style={style.text2}>{number_format_pipe(item.op_price)}원</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </Fragment>)}
                                        <Text style={{ color: 'red' }}>{errors.op_type_1 || ' '}</Text>
                                    </View>
                            </View>
                        }

                        {/* {선택 옵션} */}
                        {optionArray.filter(el => el.op_type == 2).length > 0 &&
                            <View style={[styles.section, { marginBottom: 20 }]}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>옵션2 <Text style={{ marginLeft: 8, fontSize: 16, }}>(선택사항)</Text></Text>
                                    <View>
                                        {optionArray.filter(el => el.op_type == 2).map((item, itemIndex) => 
                                        <Fragment key={item.op_id}>
                                            <TouchableWithoutFeedback onPress={() => {item.checked ? setFieldValue('op_type_2', '') : setFieldValue('op_type_2', item.op_id), handleOptionItemPressed(item, itemIndex) }}>
                                                <View style={styles.radioBox}>
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        <Checkbox status={item.checked ? 'checked' : 'unchecked'} color="#E51A47" />
                                                        <Text style={style.text2}>{item.op_name}</Text>
                                                    </View>
                                                    <Text style={style.text2}>{number_format_pipe(item.op_price)}원</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </Fragment>)}
                                    </View>
                            </View>
                        }
                        {/* 결제방법 */}
                        <View style={{ paddingVertical: 15 }}>
                            <View style={{ marginBottom: 16, alignItems: 'baseline', flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold'}}>결제방법</Text>
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

                        <View style={{backgroundColor: 'white'}}>
                            {availableCoupons && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={style.text2}>쿠폰</Text>
                                <TouchableWithoutFeedback onPress={() => { if (availableCoupons.length > 0) navigation.navigate('MyCoupon', { intend: 'use_quick' }); }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                        {coupon ? <Text style={style.text2}>선택됨</Text> : <Text style={[style.text2, { color: colors.textSecondary }]}>{availableCoupons.length}개 보유</Text>}
                                        <Image source={require('../images/rightbtn.png')}></Image>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>}
                            <View style={{ height: 1, backgroundColor: '#E5E5E5', marginVertical: 20, }}></View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, }}>
                                <Text style={style.text2}>배달비</Text>
                                {values.start_address.lat && values.end_address.lon ? <Text style={[style.text2, { color: colors.textSecondary }]}>{number_format_pipe(od_send_cost)}원</Text>
                                    : <Text style={[style.text2, { color: colors.textSecondary }]}>주소를 설정하세요.</Text>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, }}>
                                <Text style={style.text2}>옵션금액</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
                                    <Text style={[style.text2]}>{number_format_pipe(optionCost)}원</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, }}>
                                <Text style={style.text2}>할인금액</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
                                    <Text style={[style.text2]}>{number_format_pipe(discountPrice)}원</Text>
                                </View>
                            </View>
                        </View>

                        {/* 휴대폰 인증 */}
                        {!hpAuthenticated && <View style={{ marginVertical: 10 }}>
                            {me ? <Button mode="outlined" onPress={handleGoMyinfoPress}>내페이지에서 핸드폰 인증하기</Button>
                                : <Button mode="outlined" onPress={handleHpAuthenticatePress}>핸드폰 번호 인증</Button>}
                        </View>}
                    </View>
                    <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>

                    <View style={{backgroundColor: 'white'}}>
                        <View style={styles.footer1}>
                            <Text style={{fontSize: 18}}>총 주문금액</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{number_format_pipe(totalPrice)}</Text>
                                <Text style={{fontSize: 20}}> 원</Text>
                            </View>
                        </View>
                        <View style={{ margin: 15, marginTop: 0}}>
                            {optionChecked ? 
                            <Button disabled={isSubmitting} loading={isSubmitting} onPress={handleSubmit}>주문하기</Button>
                            :  <Button onPress={()=>showAlert('필수로 선택해야할 옵션이 있습니다.')}>주문하기</Button>
                        }
                            
                        </View>
                    </View>

                    <MobileAuthModal visible={mobileAuthModalOpen} setVisible={setMobileAuthModalOpen} authenticatedCallback={authenticatedCallback} />
                </ScrollView>
            </>}
        </Formik>
    );
}

const styles = StyleSheet.create({
    section: { marginTop: 10 },
    subtitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 20},
    footer1: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderTopWidth: 0.5, borderTopColor: '#E5E5E5', marginBottom: 10, paddingTop: 20, backgroundColor: 'white', },
    radioBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
});
