import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback, Image, ScrollView } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { AppContext } from '../../contexts/app-context';
import { AuthContext } from '../../contexts/auth-context';
import style from '../../style/style';
import { CartContext } from '../../contexts/cart-context';
import { number_format_pipe } from '../../pipes';
import API from '../../api';
import { basicErrorHandler } from '../../http-error-handler';
import globals from '../../globals';


export default function MyMenuHome({navigation}) {
    const { me, clearAuthInfo } = useContext(AuthContext);
    const { showSnackbar } = useContext(AppContext);
    const { cartInfo } = useContext(CartContext);
    const { getMyLocation, showDialog } = useContext(AppContext);

    // 주문 건수
    const [ orderCount, setOrderCount ] = useState(0);
    useEffect(() => {
        if (me) {
            getOrderList();
        }
    }, [me]);

    const getOrderList = async () => {
        let token;
        if (!me) token = await messaging().getToken();
        const position = await getMyLocation();
        const data = {
            token,
            lat: position.latitude,
            lon: position.longitude,
            mb_id: me.mb_id,
            page: 1,
        };

        const result = await API.post('/order_select.php', data);
        setOrderCount(result.totalcount);
    }
    // end: 주문건수

    // 찜한 업체
    const [ favorCount, setFavorCount ] = useState(0);
    useEffect(() => {
        if (me) {
            API.post('/wishlist.php', { mb_id: me.mb_id })
            .then(data => { 
                setFavorCount(data.totalcount);
            })
            .catch(basicErrorHandler);
        }
    }, [ me ]);
    // end: 찜한 업체

    // ------------- click events -------------
    const handleOrderClick = () => {
        navigation.navigate('MyOrderList');
    }

    const handleCouponClick = () => {
        if (me) {
            navigation.navigate('MyCoupon');
        }
        else {
            showLoginDialog();
        }
    }

    const handleCartClick = () => {
        if (me) {
            navigation.navigate('Cart');
        }
        else {
            showLoginDialog();
        }
    }

    const handleFavorClick = () => {
        if (me) {
            navigation.navigate("MyHeartList");
        }
        else {
            showLoginDialog();
        }
    }

    const handleReviewClick = () => {
        if (me) {
            navigation.navigate('MyReview');    
        }
        else {
            showLoginDialog();
        }
    }

    const handleServiceCenterClick = () => {
        navigation.navigate('ServiceCenter');
    }

    const handleMyinfoClick = () => {
        navigation.navigate('Myinfo');
    }

    const handleLogoutClick = async () => {
        const token = await messaging().getToken();

        const data = {
            mb_id: me.mb_id,
            token,
        };
        API.post('/member/logout.php', data)
        .then(() => {
            clearAuthInfo();
            showSnackbar('로그아웃 했습니다.');
        })
        .catch(basicErrorHandler);
    }

    const handleLoginClick = () => {
        navigation.navigate('Login');
    }

    const showLoginDialog = () => {
        showDialog('로그인', '로그인이 필요한 기능입니다.\n로그인하시겠습니까?', () => {
            navigation.navigate('Login');
        });
    }
    // ------------- end: click events -------------

    return (
        <ScrollView style={{flex: 1}}>
            <View style={{backgroundColor: 'white'}}>
                <View style={{ borderWidth: 0.5, borderColor: '#E5E5E5', height: 280, justifyContent: 'space-around', alignItems: 'center', padding: 15, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: {width: 1, height: 1}, shadowOpacity: 0.2, shadowRadius: 3, elevation: 5, margin: 15, }}>
                    <View style={{width: '100%'}}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                            <Image source={require('../../images/mymenuicon1.png')} style={{ marginRight: 10, width: 77, height: 67 }} />
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{fontSize: 20}}>안녕하세요, </Text>
                                    {me && <>
                                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{me.mb_nick || mb.mb_name}</Text>
                                        <Text style={{fontSize: 20}}> 님</Text>
                                    </>}
                                </View>
                                <View>
                                    <Text style={{fontSize: 20}}>방문해주셔서 감사합니다</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{marginHorizontal: 10}}>
                            <View style={{ height: 1, backgroundColor: 'black', marginVertical: 20, }}></View>
                            <View style={{marginHorizontal: 5}}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, }}>
                                    <Text style={{fontSize: 16}}>주문 건수</Text>
                                    <Text style={{fontSize: 16}}>{number_format_pipe(orderCount)} 건</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, }}>
                                    <Text style={{fontSize: 16}}>장바구니 상품 수</Text>
                                    <Text style={{fontSize: 16}}>{cartInfo?.menus.length || 0} 개</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                    <Text style={{fontSize: 16}}>찜한 업체</Text>
                                    <Text style={{fontSize: 16}}>{favorCount} 곳</Text>
                                </View>
                            </View>
                            <View style={{ height: 1, backgroundColor: 'black', marginVertical: 20, }}></View>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>
            <View style={{backgroundColor: 'white', padding: 15}}>
                <TouchableWithoutFeedback onPress={handleOrderClick}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('../../images/mymenuicon2.png')} style={{ width: 25, height: 25 }} />
                            <Text style={[style.text2, {marginLeft: 10}]}>주문내역</Text>
                        </View>
                        <Image source={require('../../images/rightbtn.png')} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={{height: 1, backgroundColor: '#EEEEEE'}}></View>
            <View style={{backgroundColor: 'white', padding: 15}}>
                <TouchableWithoutFeedback onPress={handleCouponClick}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('../../images/mymenuicon3.png')} style={{ width: 25, height: 25 }}></Image>
                            <Text style={[style.text2, {marginLeft: 10}]}>내 쿠폰함</Text>
                        </View>
                        <Image source={require('../../images/rightbtn.png')}></Image>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={{height: 1, backgroundColor: '#EEEEEE'}}></View>
            <View style={{backgroundColor: 'white', padding: 15}}>
                <TouchableWithoutFeedback onPress={handleCartClick}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('../../images/mymenuicon4.png')} style={{ width: 25, height: 25 }}></Image>
                            <Text style={[style.text2, {marginLeft: 10}]}>장바구니</Text>
                        </View>
                        <Image source={require('../../images/rightbtn.png')}></Image>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={{height: 1, backgroundColor: '#EEEEEE'}}></View>
            <View style={{backgroundColor: 'white', padding: 15}}>
                <TouchableWithoutFeedback onPress={handleFavorClick}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('../../images/mymenuicon5.png')} style={{ width: 25, height: 25 }}></Image>
                            <Text style={[style.text2, {marginLeft: 10}]}>찜 목록</Text>
                        </View>
                        <Image source={require('../../images/rightbtn.png')}></Image>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={{height: 1, backgroundColor: '#EEEEEE'}}></View>
            <View style={{backgroundColor: 'white', padding: 15}}>
                <TouchableWithoutFeedback onPress={handleReviewClick}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('../../images/mymenuicon6.png')} style={{ width: 25, height: 25 }}></Image>
                            <Text style={[style.text2, {marginLeft: 10}]}>내가 작성한 리뷰</Text>
                        </View>
                        <Image source={require('../../images/rightbtn.png')}></Image>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>
            <View style={{backgroundColor: 'white', padding: 15}}>
                <TouchableWithoutFeedback onPress={handleServiceCenterClick}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('../../images/mymenuicon7.png')} style={{ width: 25, height: 25 }}></Image>
                            <Text style={[style.text2, {marginLeft: 10}]}>고객센터</Text>
                        </View>
                        <Image source={require('../../images/rightbtn.png')}></Image>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={{height: 1, backgroundColor: '#EEEEEE'}}></View>

            {me && <>
                <View style={{backgroundColor: 'white', padding: 15}}>
                    <TouchableWithoutFeedback onPress={handleMyinfoClick}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={require('../../images/mymenuicon8.png')} style={{ width: 25, height: 25 }}></Image>
                                <Text style={[style.text2, {marginLeft: 10}]}>회원정보 수정</Text>
                            </View>
                            <Image source={require('../../images/rightbtn.png')}></Image>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{height: 1, backgroundColor: '#EEEEEE'}}></View>
            </>}

            <View style={{backgroundColor: 'white', padding: 15}}>
                {me ? <TouchableWithoutFeedback onPress={handleLogoutClick}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('../../images/mymenuicon9.png')} style={{ width: 25, height: 25 }}></Image>
                            <Text style={[style.text2, {marginLeft: 10}]}>로그아웃</Text>
                        </View>
                        <Image source={require('../../images/rightbtn.png')}></Image>
                    </View>
                </TouchableWithoutFeedback> : <TouchableWithoutFeedback onPress={handleLoginClick}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('../../images/mymenuicon9.png')} style={{ width: 25, height: 25 }}></Image>
                            <Text style={[style.text2, {marginLeft: 10}]}>로그인</Text>
                        </View>
                        <Image source={require('../../images/rightbtn.png')}></Image>
                    </View>
                </TouchableWithoutFeedback>}
            </View>

            {globals.production === false && <>
                <View style={{backgroundColor: 'white', padding: 15}}>
                    <TouchableWithoutFeedback onPress={() => { navigation.navigate('Test2'); }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={require('../../images/mymenuicon7.png')} style={{ width: 25, height: 25 }}></Image>
                                <Text style={[style.text2, {marginLeft: 10}]}>테스트</Text>
                            </View>
                            <Image source={require('../../images/rightbtn.png')}></Image>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{height: 1, backgroundColor: '#EEEEEE'}}></View>
            </>}

            {/* footer */}
            <View style={{ justifyContent: 'space-evenly', alignItems: 'center', marginVertical: 20, height: 70 }}>
                <Text style={{fontWeight: 'bold'}}>오성패밀리</Text>
                <Text style={{ color: '#555555', fontSize: 12 }}>대표자: 김형석{'   '}사업자등록번호: 808-08-01980</Text>
                <Text style={{ color: '#555555', fontSize: 12 }}>주소: 인천 강화군 길상면 길상로 294, 201~203호{'   '}대표번호: 1877-7147</Text>
                <Text style={{ color: '#555555', fontSize: 12 }} onPress={() => { navigation.navigate('Test2'); }} >통신판매업신고번호: 제 2021-인천강화-0074 호</Text>
            </View>
        </ScrollView>
    );
}
