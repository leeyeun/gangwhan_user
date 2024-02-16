import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Text, Image, View, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Share, Linking } from 'react-native';
import style from '../style/style';
import {navigate} from '../navigation/RootNavigation';
import { AuthContext } from '../contexts/auth-context';
import { CartContext } from '../contexts/cart-context';
import API from '../api';
import colors from '../appcolors';
import Stars from '../components/Stars';
import { store_worktime_pipe, store_breaktime_pipe, store_restdays_pipe } from '../pipes';
import { basicErrorHandler } from '../http-error-handler';
import DeliveryInfoSection from './store-detail/DeliveryInfoSection';
import MenuTab from './store-detail/MenuTab';
import StoreTab from './store-detail/StoreTab';
import ReviewTab from './store-detail/ReviewTab';
import { AppContext } from '../contexts/app-context';
import Loading from '../components/Loading';
import useFocusEffect from '../hooks/useFocusEffect';


export default function DeliVeryDetailScreen({ route, navigation }) {
    const { me } = useContext(AuthContext);
    const { cartInfo } = useContext(CartContext);
    const { showDialog } = useContext(AppContext);

    // 매장 정보
    const [ store, setStore ] = useState();
    useFocusEffect(() => {
        const params = { sl_sn: route.params.sl_sn };
        API.get('/store/get_store.php', { params })
        .then(data => {
            setStore(data.data);
        })
        .catch(basicErrorHandler);
    }, [ route.params ]);

    // 매장 메뉴정보
    const [ categories, setCategories ] = useState();
    useEffect(() => {
        const params = { sl_sn: route.params.sl_sn };
        API.get('/store/get_menu_categories.php', { params })
        .then(data => {
            setCategories(data.data);
        })
        .catch(basicErrorHandler);
    }, [ route.params ]);

    // 찜 내역
    const [ favor, setFavor ] = useState();
    useEffect(() => {
        if (me) fetchMyFavor();
    }, [me]);

    const fetchMyFavor = () => {
        API.post('/wishlist.php', { mb_id: me.mb_id })
        .then((data) => {
            setFavor(data.rowdata.find(item => item.sl_sn == route.params.sl_sn));
        })
        .catch(basicErrorHandler);
    }

    // 찜 토글
    const handleFavor = () => {
        if (!me) {
            showDialog('로그인', '로그인이 필요한 기능입니다.\n로그인하시겠습니까?', () => {
                navigation.navigate('Login');
            });
        }
        else {
            const data = { sl_sn: store.sl_sn, mb_id: me.mb_id };
            if (favor) {
                data.w = 'd';
                data.wi_id = favor.wi_id;
            }
    
            API.post('/wishlist_update.php', data)
            .then(() => {
                if (!favor) fetchMyFavor();
                else setFavor(null);
            })
            .catch(basicErrorHandler);
        }
    }

    const handleCouponDownloadPress = () => {
        if (!me) {
            showDialog('로그인', '로그인이 필요한 기능입니다.\n로그인하시겠습니까?', () => {
                navigation.navigate('Login');
            });
        }
        else {
            navigation.navigate('Coupon', { store });
        }
    }
    
    const handleShare = async () => {
        await Share.share({
            message: '강화도 전용 원스톱 배달 플랫폼, https://ganghwaen.com',
        });
    }
    
    const [ tab, setTab ] = useState('menu');
    
    // worktimes & holidays
    const worktimes_memos = useMemo(() => {
        if (store) {
            return store_worktime_pipe(store);
        }
    }, [ store ]);

    const breaktimes_memos = useMemo(() => {
        if (store) {
            return store_breaktime_pipe(store);
        }
    }, [ store ]);

    const restday_memo = useMemo(() => {
        return store_restdays_pipe(store);
    }, [ store ]);
    // end: worktimes & holidays

    return (
        <>
            {store && categories ? <>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <ScrollView>
                        <View style={styles.container}>
                            <View style={styles.detailBox}>
                                <Text style={styles.detailTitle}>{store.sl_title}</Text>
                                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
                                    <Stars stars={store.review_avg} />
                                    <Text style={{fontWeight: '600', marginLeft: 10}}>{store.review_avg > 0 ? store.review_avg : '-'}</Text>
                                </View>
                                
                                <View style={{ width: '100%', marginTop: 20 }}>
                                    <View style={{flexDirection: 'row' }}>
                                        <Text style={styles.boldText}>영업시간</Text>
                                        <View style={{ flex: 1 }}>
                                            {worktimes_memos.length > 0 ? worktimes_memos.map((time, index) => <Text key={index} style={styles.subText}>{time}</Text>) : <Text style={style.text2}>-</Text>}
                                        </View>
                                    </View>
                                    <View style={{height: 8}}></View>

                                    <View style={{flexDirection: 'row' }}>
                                        <Text style={styles.boldText}>휴식시간</Text>
                                        <View style={{ flex: 1 }}>
                                            {breaktimes_memos.length > 0 ? breaktimes_memos.map((time, index) => <Text key={index} style={styles.subText}>{time}</Text>) : <Text style={style.text2}>-</Text>}
                                        </View>
                                    </View>
                                    <View style={{height: 8}}></View>

                                    <View style={{flexDirection: 'row' }}>
                                        <Text style={styles.boldText}>정기휴일</Text>
                                        <Text style={style.text2}>{restday_memo}</Text>
                                    </View>
                                    <View style={{height: 8}}></View>


                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={styles.boldText}>영업상태</Text>
                                        <Text style={style.text2}>{store.is_workon ? '영업중' : '영업준비중'}</Text>
                                    </View>
                                </View>
                                
                                <View style={{ flexDirection: 'row', marginVertical: 18, paddingVertical: 12, alignItems: 'center', borderColor: colors.borderColor, borderTopWidth: 1, borderBottomWidth: 1 }}>
                                    <View style={styles.btnWrapper}>
                                        <TouchableWithoutFeedback onPress={() => { Linking.openURL('tel:' + store.sl_biztel)}}>
                                            <View style={styles.callBtnItem}>
                                                <Image source={require('../images/callicon.png')} style={{ width: 12, height: 12, marginRight: 5 }}></Image>
                                                <Text style={style.text2}> 전화걸기</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    
                                    <View style={styles.btnWrapper}>
                                        <TouchableWithoutFeedback onPress={handleFavor}>
                                            <View style={styles.callBtnItem}>
                                                <Image source={favor ? require('../images/myheartlisticon.png') : require('../images/hearticon.png')} style={{ width: 15, height: 15, marginRight: 5}} ></Image>
                                                <Text style={style.text2}>찜하기</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    
                                    <View style={{ ...styles.btnWrapper, borderRightWidth: 0 }}>
                                        <TouchableWithoutFeedback onPress={handleShare}>
                                            <View style={styles.callBtnItem}>
                                            <Image source={require('../images/shareicon.png')} style={{ width: 15, height: 15, marginRight: 5 }}></Image>
                                            <Text style={style.text2}> 공유하기</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                                
                                <TouchableOpacity style={styles.couponeButton} onPress={handleCouponDownloadPress}>
                                    <Image source={require('../images/coupon.png')} style={{ width: 17, height: 12, marginRight: 5 }}></Image>
                                    <Text style={style.text2}> 쿠폰 다운로드 하기 </Text>
                                    <Image source={require('../images/download.png')} style={{ width: 13, height: 15, marginLeft: 5 }}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>

                        {/* 배달 / 포장 정보 */}
                        <DeliveryInfoSection store={store} />
                        <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>

                        {/* 정보 */}
                        <View style={{ flexDirection: 'row'}}>
                            <TouchableOpacity style={{ height: 50, justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: tab == 'menu' ? '#E51A47' : '#e5e5e5', flex: 1, }} onPress={() => { setTab('menu'); }}>
                                <Text style={{ textAlign: 'center', color: tab == 'menu' ? '#E51A47' : '#777777', fontSize: 17, fontWeight: 'bold', }}>메뉴</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ height: 50, justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: tab == 'store' ? '#E51A47' : '#e5e5e5', flex: 1, }} onPress={() => { setTab('store'); }}>
                                <Text style={{ textAlign: 'center', color: tab == 'store' ? '#E51A47' : '#777777', fontSize: 17, }}>매장정보</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ height: 50, justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: tab == 'review' ? '#E51A47' : '#e5e5e5', flex: 1, }} onPress={() => { setTab('review'); }}>
                                <Text style={{ textAlign: 'center', color: tab == 'review' ? '#E51A47' : '#777777', fontSize: 17, }}>리뷰</Text>
                            </TouchableOpacity>
                        </View>
                        {tab == 'menu' && <MenuTab store={store} categories={categories} />}
                        {tab == 'store' && <StoreTab store={store} />}
                        {tab == 'review' && <ReviewTab store={store} />}

                        
                    </ScrollView>

                    {/* 장바구니 버튼 */}
                    {cartInfo && <TouchableOpacity onPress={() => { 
                        if (store.is_workon) navigate('Cart');
                    }}>
                        <View style={[styles.footer, { backgroundColor: store.is_workon ? '#E51A47' : '#bdbdbd' }]}>
                            <Image source={require('../images/footercart.png')}></Image>
                            <Text style={[ style.text2, {color: 'white', fontWeight: 'bold', marginLeft: 5}, ]}>장바구니 ({cartInfo.menus.length})</Text>
                        </View>
                    </TouchableOpacity>}
                </View>
            </> : <Loading />}
        </>
    );
}


const styles = StyleSheet.create({
    subText: {
        fontSize: 16, color: colors.textPrimary,
    },
    container: {
        justifyContent: 'center',
        padding: 15,
    },
    detailBox: {
        borderWidth: 0.5,
        borderColor: '#E5E5E5',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    callButton: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        height: 45,
        alignItems: 'center',
    },
    couponeButton: {
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#FEEDEC',
        borderRadius: 6,
    },
    detailTitle: {fontSize: 24, fontWeight: 'bold'},
    boldText: {marginRight: 15, fontSize: 16, fontWeight: 'bold'},
    btnWrapper: { flex: 1, borderColor: colors.borderColor, borderRightWidth: 1 },
    callBtnItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    footer: {
        height: 50,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row', 
    },
    title: {marginRight: 20, marginBottom: 10, fontSize: 16, fontWeight: 'bold'},
    contents: {marginBottom: 10, fontSize: 16},
});
