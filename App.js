import React, { useState, useContext, useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Platform } from 'react-native';
import Modal from 'react-native-modal';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { useNetInfo } from "@react-native-community/netinfo";
import LoginScreen from './src/screens/Login';
import RegisterScreen from './src/screens/Register';
import FindAccountScreen from './src/screens/FindAccount/FindAccount';
import FindIdScreen from './src/screens/FindAccount/FindId';
import FindIdPhoneSignScreen from './src/screens/FindAccount/FindIdPhoneSign';
import FindIdResultScreen from './src/screens/FindAccount/FindIdResult';
import RegisterInputScreen from './src/screens/RegisterInput';
import RegisterSuccessScreen from './src/screens/RegisterSuccess';
import FindPassScreen from './src/screens/FindAccount/FindPass';
import FindPassPhoneSignScreen from './src/screens/FindAccount/FindPassPhoneSign';
import FindPassResultScreen from './src/screens/FindAccount/FindPassResult';
import MainScreen from './src/screens/Main';
import AddressInputScreen from './src/screens/AddressInput';
import DeliveryListScreen from './src/screens/DeliveryList';
import DeliVeryDetailScreen from './src/screens/DeliveryDetail';
import CouponScreen from './src/screens/Coupon';
import DetailMenu from './src/screens/DetailMenu';
import Cart from './src/screens/Cart';
import OrderDeliOnline from './src/screens/OrderDeliOnline';
import QuickDelivery from './src/screens/QuickDelivery';
import MyMenuHome from './src/screens/MyMenu/MyMenuHome';
import MyOrderList from './src/screens/MyMenu/MyOrderList';
import MyOrderDetail from './src/screens/MyMenu/MyOrderDetail';
import { navigate, navigationRef } from './src/navigation/RootNavigation';
import MyCoupon from './src/screens/MyMenu/MyCoupon';
import MyHeartList from './src/screens/MyMenu/MyHeartList';
import MyReview from './src/screens/MyMenu/MyReview';
import ServiceCenter from './src/screens/MyMenu/ServiceCenter';
import Notice from './src/screens/MyMenu/Notice';
import NoticeView from './src/screens/MyMenu/NoticeView';
import Questions from './src/screens/MyMenu/Questions';
// import CreateDeliveryMenuList from './src/components/CreateDeliveryMenuList';
import QuestionsView from './src/screens/MyMenu/QuestionsView';
import FAQ from './src/screens/MyMenu/FAQ';
import WriteReview1 from './src/screens/WriteReview1';
import SplashScreen1 from './src/screens/SplashScreen';
import globals from './src/globals';
import { AuthContext } from './src/contexts/auth-context';
import ImportAutuenticationScreen from './src/screens/IamportAuthenticationScreen';
import PolicyScreen from './src/screens/PolicyScreen';
import JoinDoneScreen from './src/screens/JoinDoneScreen';
import Test2 from './src/screens/Test2';
import Test3Screen from './src/screens/Test3';
import { CartContext } from './src/contexts/cart-context';
import PayIamportScreen from './src/screens/PayIamportScreen';
import MyinfoScreen from './src/screens/MyMenu/MyinfoScreen';
import FcmController from './src/contexts/fcm-controller';
import { NotificationContextProvider } from './src/contexts/notification-context';
import QuestionForm from './src/screens/MyMenu/QuestionForm';
import DeliveryFoodScreen from './src/screens/DeliveryFood';
import { MemoryContext } from './src/contexts/memory-context';
import AppMinVersionModal from './src/components/AppMinVersionModal';
import AppversionModal from './src/screens/main/AppversionModal';
import useFcmInitiation from './src/hooks/useFcmInitiation';
import PushNotification, { Importance } from 'react-native-push-notification';
import { check, PERMISSIONS, request, RESULTS, requestMultiple, requestNotifications } from 'react-native-permissions';

const Stack = createStackNavigator();

function App() {
    const { me } = useContext(AuthContext);

    // splash 
    const [ splash, setSplash ] = useState(globals.production === true);
    useEffect(() => {
        setTimeout(() => {
            setSplash(false);
        }, 1500);
    }, []);
    // end: splash

    // 장바구니 전체 삭제
    const { removeAllCartItems } = useContext(CartContext);
    const [ removeAllCartItemsModalOpen, setRemoveAllCartItemsModalOpen ] = useState(false);
    const handleRemoveAllCartItems = () => {
        removeAllCartItems(() => { 
            setRemoveAllCartItemsModalOpen(false);
        });
    }
    // end: 장바구니 전체 삭제

    useFcmInitiation();

    //권한 받기
    useEffect(() => {
        if (Platform.OS === 'ios') {
            requestUserPermission();
            // getRequestIosPermission();
        } else {
            const granted = request(
                PERMISSIONS.ANDROID.POST_NOTIFICATIONS
            );
        }
    }, []);

    // // ios 에서 푸쉬알림 권한 요청
    // useEffect(() => {
    //     requestUserPermission();
    // }, []);
    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        
        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    }

    // ios 에서 badge number 초기화
    useEffect(() => {
        if (Platform.OS === 'ios') {
            PushNotificationIOS.setApplicationIconBadgeNumber(0);
        }
    }, []);

    // 네트워크 확인
    const netInfo = useNetInfo();
    useEffect(() => {
        if (netInfo?.isConnected != null) {
            // 고객이 인터넷 연결 메세지 뜨는 것을 빼달라고 함
            // if (!netInfo.isConnected) showAlert('인터넷 연결되지 않았습니다.\n확인해주세요.');
        }
    }, [ netInfo ]);

    // 공지사항 팝업: 현재까지 고객이 아직 말이 없음
    const { oneshotNotice } = useContext(MemoryContext);
    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <NotificationContextProvider>
                {/* fcm control */}
                <FcmController />
                {splash ? <SplashScreen1 /> : <>
                    <NavigationContainer ref={navigationRef}>
                        <Stack.Navigator
                            screenOptions={{
                                headerShown: true,
                                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                                gestureEnabled: true,
                                gestureDirection: 'horizontal',
                                headerTitleAlign: 'center',
                                headerBackTitleVisible: false,
                                // headerBackImage: () => (
                                //     <IconButton icon={require('./src/images/back_button.png')} color="#000" size={18} style={{}} />
                                // ),
                            }}
                            // initialRouteName="QuickDelivery"
                        >
                            {me ? <>
                                <Stack.Screen name="Main" component={MainScreen} options={{headerShown: false}} />
                                {/* <Stack.Screen name="CreateDeliveryMenuList" options={{headerShown: true}} component={CreateDeliveryMenuList} /> */}
                                <Stack.Screen name="MyHeartList" component={MyHeartList} options={{headerTitle: '찜 목록'}} />
                                <Stack.Screen 
                                    name="WriteReview1" 
                                    component={WriteReview1} 
                                    options={({route}) => ({ 
                                        title: route.params.is_id ? '리뷰수정' : '리뷰쓰기',
                                    })} 
                                />
                                <Stack.Screen name="MyReview" component={MyReview} options={{headerTitle: '내가 작성한 리뷰'}} />
                                <Stack.Screen name="MyCoupon" component={MyCoupon} options={{headerTitle: '내 쿠폰함'}} />
                                <Stack.Screen name="Myinfo" component={MyinfoScreen} options={{headerTitle: '회원 정보 수정'}} />
                                <Stack.Screen name="QuestionsView" component={QuestionsView} options={{headerTitle: '1:1 문의'}} />
                                <Stack.Screen name="QuestionForm" component={QuestionForm} options={{headerTitle: '1:1 문의'}} />
                                <Stack.Screen 
                                    name="Questions" 
                                    component={Questions} 
                                    options={{ headerTitle: '1:1 문의', headerRight: () => (
                                        <TouchableOpacity onPress={() => { navigate('QuestionForm') }}>
                                            <Text style={{marginRight: 15, fontSize: 16}}>글쓰기</Text>
                                        </TouchableOpacity>
                                        ),
                                    }}
                                />
                            </> : <>
                                <Stack.Screen name="Login" options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }} component={LoginScreen} />
                                {/* RegisterScreen 안쓰는 것 같은데? */}
                                <Stack.Screen name="Register" options={{headerShown: false}} component={RegisterScreen} />
                                <Stack.Screen name="Main" component={MainScreen} options={{headerShown: false}} />
                                <Stack.Screen name="FindAccount" component={FindAccountScreen} options={{headerTitle: '계정 찾기'}} />
                                <Stack.Screen name="FindId" component={FindIdScreen} options={{headerTitle: '아이디 찾기'}} />
                                <Stack.Screen name="FindIdPhoneSign" component={FindIdPhoneSignScreen} options={{headerTitle: '아이디 찾기'}} />
                                <Stack.Screen name="FindIdResult" component={FindIdResultScreen} options={{headerTitle: '아이디 찾기'}} />
                                <Stack.Screen name="RegisterInput" component={RegisterInputScreen} options={{headerTitle: '회원가입'}} />
                                <Stack.Screen name="RegisterSuccess" component={RegisterSuccessScreen} options={{headerTitle: '회원가입 완료'}} />
                                <Stack.Screen name="FindPass" component={FindPassScreen} options={{headerTitle: '비밀번호 찾기'}} />
                                <Stack.Screen name="FindPassPhoneSign" component={FindPassPhoneSignScreen} options={{headerTitle: '비밀번호 찾기'}} />
                                <Stack.Screen name="FindPassResult" component={FindPassResultScreen} options={{headerTitle: '비밀번호 찾기'}} />
                                <Stack.Screen name="ImportAuthentication" component={ImportAutuenticationScreen} options={{headerShown: false}} />
                            </>}

                            <Stack.Screen 
                                name="Policy"
                                component={PolicyScreen} 
                                options={({route}) => ({ 
                                    title: route.params.code == 'provision' ? '이용약관' : route.params.code == 'privacy' ? '개인정보처리방침' : '위치기반서비스 약관',
                                    headerRight: () => (
                                        <>{(!route.params.intend || route.params.intend !== 'show') && <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 5 }} onPress={() => { 
                                            if (route.params.code == 'provision') { 
                                                route?.params?.setAppPolicyAgree(true); 
                                            } 
                                            else if (route?.params?.code == 'privacy') { 
                                                route?.params?.setPrivacyAgree(true); 
                                            } 
                                            else { 
                                                route?.params?.setPositionTrackAgree(true); 
                                            } 
                                            navigationRef.current.goBack(); 
                                        }}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'orange' }}>동의하기</Text>
                                        </TouchableOpacity>}</>
                                    )
                                })} 
                            />
                            <Stack.Screen name="JoinDone" component={JoinDoneScreen} options={{headerTitle: '회원가입 완료'}} />
                            <Stack.Screen name="AddressInput" component={AddressInputScreen} options={{headerTitle: '배송 주소 입력'}} />
                            <Stack.Screen name="MyOrderList" component={MyOrderList} options={{headerTitle: '주문내역'}} />
                            <Stack.Screen name="MyOrderDetail" component={MyOrderDetail} options={{headerTitle: '주문 상세 정보'}} />
                            <Stack.Screen name="FAQ" component={FAQ} options={{headerTitle: 'FAQ'}} />
                            <Stack.Screen name="PayIamport" component={PayIamportScreen} options={{headerTitle: '결제'}} />
                            <Stack.Screen
                                name="DeliveryFood"
                                component={DeliveryFoodScreen}
                                options={({route}) => ({
                                    headerTitle: route.params.category.ca_name,
                                    headerRight: () => (
                                    <TouchableOpacity onPress={() => { navigate('Cart'); }}>
                                        <Image source={require('./src/images/cart_icon1.png')} style={{height: 20, width: 20, marginRight: 10}}></Image>
                                    </TouchableOpacity>
                                ),
                                })}
                            />
                            <Stack.Screen
                                name="DeliveryList"
                                component={DeliveryListScreen}
                                options={({ route }) => ({
                                    headerTitle: route.params?.title || '음식배달',
                                    headerRight: () => (
                                        <TouchableOpacity onPress={() => { navigate('Cart'); }}>
                                            <Image source={require('./src/images/cart_icon.png')} style={{height: 20, width: 20, marginRight: 10}} />
                                        </TouchableOpacity>
                                    ),
                                })}
                            />
                            <Stack.Screen name="DeliveryDetail" component={DeliVeryDetailScreen} options={{headerTitle: '매장 상세정보'}} />
                            <Stack.Screen
                                name="DetailMenu"
                                component={DetailMenu}
                                options={({ route }) => ({
                                    headerTitle: route.params.store.sl_title,
                                })}
                            />
                            
                            <Stack.Screen name="Coupon" component={CouponScreen} options={{headerTitle: '쿠폰 모아보기'}} />
                            <Stack.Screen name="OrderDeliOnline" component={OrderDeliOnline} options={{headerTitle: '주문하기'}} />
                            <Stack.Screen name="QuickDelivery" component={QuickDelivery} options={{headerTitle: '퀵배달'}} />
                            <Stack.Screen name="MyMenuHome" component={MyMenuHome} options={{headerTitle: 'MY메뉴'}} />
                            <Stack.Screen name="ServiceCenter" component={ServiceCenter} options={{headerTitle: '고객센터'}} />
                            <Stack.Screen name="Notice" component={Notice} options={{headerTitle: '공지사항'}} />
                            <Stack.Screen name="NoticeView" component={NoticeView} options={{headerTitle: '공지사항'}} />
                            <Stack.Screen
                                name="Cart"
                                component={Cart}
                                options={{
                                headerTitle: '장바구니',
                                headerRight: () => (
                                    <TouchableOpacity onPress={() => { setRemoveAllCartItemsModalOpen(true) }}>
                                        <Text style={{marginRight: 15, fontSize: 16}}>전체삭제</Text>
                                        <Modal isVisible={removeAllCartItemsModalOpen}>
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ backgroundColor: 'white', width: '100%', padding: 20, alignItems: 'center' }}>
                                                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>장바구니 제품 전체 삭제</Text>
                                                    <View style={{ height: 1, backgroundColor: '#E5E5E5', marginVertical: 20, width: '100%' }}></View>
                                                    <View>
                                                        <Text style={{textAlign: 'center', fontSize: 16}}>장바구니에 담겨있는 모든 제품이 삭제됩니다.{'\n'}삭제하시겠습니까?</Text>
                                                    </View>
                                                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', marginTop: 25 }}>
                                                        <TouchableOpacity style={styles.modalCancel} onPress={() => { setRemoveAllCartItemsModalOpen(false); }}>
                                                            <Text style={styles.modalBtnFont}>취소</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styles.modalOk} onPress={handleRemoveAllCartItems}>
                                                            <Text style={styles.modalBtnFont}>확인</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </Modal>
                                    </TouchableOpacity>
                                    ),
                                }}
                            />

                            <Stack.Screen name="IamportAuthentication" options={{headerShown: false}} component={ImportAutuenticationScreen} />  

                            {/* 결제테스트 */}
                            <Stack.Screen name="Test2" component={Test2} options={{headerTitle: 'Test2'}} />  

                            {/* 화면 유틸리티 테스트 */}
                            <Stack.Screen name="Test3" component={Test3Screen} options={{headerTitle: 'Test3'}} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </>}
            </NotificationContextProvider>

            <AppMinVersionModal />
            <AppversionModal />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  modalCancel: {
    backgroundColor: '#777777',
    width: '50%',
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderRadius: 5,
  },
  modalOk: {
    backgroundColor: '#E51A47',
    width: '50%',
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderRadius: 5,
  },
  modalBtnFont: {color: 'white', fontSize: 16, fontWeight: 'bold'},
});

export default App;
