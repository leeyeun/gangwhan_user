import React, { useContext, useRef } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, Platform, NativeModules, Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { NaverLogin, getProfile } from "@react-native-seoul/naver-login";
import { getProfile as getKakaoProfile, login as kakaoLogin } from '@react-native-seoul/kakao-login';
import { appleAuth } from '@invertase/react-native-apple-authentication';

import style from '../style/style';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { AuthContext } from '../contexts/auth-context';
import { AppContext } from '../contexts/app-context';
import API from '../api';
import Button from '../components/Button';
import cstyles from '../cstyles';
import { basicErrorHandler, errorCodeHandler } from '../http-error-handler';
import { resetRoot } from '../navigation/RootNavigation';


// naver login setup
const naverIosKeys = {
	kConsumerKey: "LKYN3J26DnlPfVjW0OZR",
	kConsumerSecret: "fWTDDLxluS",
	kServiceAppName: "강화N",
	kServiceAppUrlScheme: "gwnapp" // only for iOS
};
const naverAndroidKeys = {
	kConsumerKey: "LKYN3J26DnlPfVjW0OZR",
	kConsumerSecret: "fWTDDLxluS",
	kServiceAppName: "강화N"
};
const initials = Platform.OS === "ios" ? naverIosKeys : naverAndroidKeys;
// end: naver login setup

function LoginScreen({navigation}) {
    const { setAuthInfo } = useContext(AuthContext);
    const { showAlert } = useContext(AppContext);

    // password login
	const handleLogin = (values, actions) => {
        messaging().getToken()
        .then(token => {
            const data = {
                mb_id: values.id,
                mb_password: values.password,
                token: token,
                mb_level: 2,
            };
            
            return API.post('/login_select.php', data);
        })
        .then(data => {
            setAuthInfo(data.rowdata[0], data.jwt);
            resetRoot('Main');
        })
        .catch(error => {
            const errorCodes = [
                { code: '1', message: '아이디 또는 비밀번호 불일치'},
                { code: '2', message: '차단된 아이디'},
                { code: '3', message: '탈퇴 아이디'},
                { code: '4', message: '접근권한이 없습니다.'},
            ];
            console.log('error',error)
            errorCodeHandler(error, errorCodes);
        })
        .finally(() => { 
            actions.setSubmitting(false); 
        });
	}
    // end: password login

    const doneSns = (mb_7, identifier) => {
        const params = { mb_7, mb_id: identifier };
        API.get('/member/social_login.php', { params })
        .then(data => {
            if (data.data.login) {
                const member = data.data.member;
                const jwt = data.data.jwt;
                setAuthInfo(member, jwt);
                resetRoot('Main');
            }
            else {
                if(data.data.type){
                    //신규
                    if(data.data.type == 1){
                        navigation.navigate('RegisterInput', { mb_7, mb_id: identifier });
                    }
                    else if(data.data.type == 2){
                        Alert.alert("로그인 실패", "차단된 계정입니다. 관리자에게 문의해주세요.");
                    }
                    else if(data.data.type == 3){
                        Alert.alert("로그인 실패", "탈퇴된 계정입니다.");
                    }
                    else{
                        Alert.alert("로그인 실패", "오류가 발생했습니다.");
                    }
                }
                else{
                    Alert.alert("로그인 실패", "오류가 발생했습니다.");
                }
            }
        })
        .catch(basicErrorHandler);
    }

    // naver login
	const onNaverClick = async () => {
		try {
			const token = await naverLogin(initials);

			const profileResult = await getProfile(token.accessToken);
			if (profileResult.resultcode === "024") {
				Alert.alert("로그인 실패", profileResult.message);
				return;
			}
			
			const id = profileResult.response.id;			
			doneSns('N', id);
		}
		catch(error) {console.error('naver login error:', error)}
	}

	const naverLogin = props => {
		return new Promise((resolve, reject) => {
			NaverLogin.login(props, (err, token) => {				
				if (err) {
					reject(err);
					return;
				}
				resolve(token);
			});
		});
	};
	// end: naver login

    // kakao login
    const onKakaoClick = async () => {
        try {
            // login
            await kakaoLogin();
        
            // get profile
            const profile = await getKakaoProfile();
            const id = profile.id
            doneSns('K', id);
        } 
        catch (err) {
            Alert.alert(err.message);
            throw err.message;
        }
    }
    // end: kakao login

    // apple login
    async function onAppleButtonPress() {
        // performs login request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        // get current authentication state for user
        // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
      
        // use credentialState response to ensure the user is authenticated
        if (credentialState === appleAuth.State.AUTHORIZED) {
            // user is authenticated
            // 원래는 identity token 를 서버에 넘겨서 검증을 해야 하지만, 그냥 간단히 바로 user 를 사용
            const id = appleAuthRequestResponse.user;
            doneSns('A', id);
        }
        else {
            showAlert('인증에 실패했습니다.');
        }
    }
    // end: apple login

    

    const passwordRef = useRef();

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <View style={[{flex: 1, paddingHorizontal: 15 }]}>
                <View style={{ alignSelf: 'center', ...Platform.select({ios: {paddingTop: '15%'}}) }}>
                    <Image source={require('../images/imageLogo3x.png')} style={[style.imgContain, {width: 250, height: 200}]} />
                </View>
                <View style={{ flex: 1 }}>
                    {/* password login */}
                    <Formik
                        initialValues={{ 
                            id: '',
                            password: '',
                        }}
                        validationSchema={Yup.object().shape({
                            id: Yup.string().required('필수입력입니다.'),
                            password: Yup.string().required('필수입력입니다.'),
                        })}
                        onSubmit={handleLogin}
                    >
                        {({handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, dirty, touched, errors, isValid, values, isSubmitting }) => <>
                            <TextInput
                                placeholder={'아이디를 입력하세요'}
                                style={{...cstyles.input, marginBottom: 10 }} 
                                autoCapitalize="none"
                                value={values.id}
                                returnKeyType="next"
                                placeholderTextColor={'#757575'}
                                onSubmitEditing={() => { passwordRef.current.focus(); }}
                                onChangeText={handleChange('id')}
                                onBlur={handleBlur('id')}
                            />
                            <TextInput
                                ref={passwordRef}
                                placeholder={'비밀번호를 입력하세요'}
                                style={{...cstyles.input, marginBottom: 10 }} 
                                textContentType="password"
                                secureTextEntry={true}
                                value={values.email}
                                returnKeyType="send"
                                placeholderTextColor={'#757575'}
                                onSubmitEditing={handleSubmit}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                            />
                            <View style={style.inputGroup2}>
                                <Button disabled={!dirty || !isValid || isSubmitting} loading={isSubmitting} onPress={handleSubmit}>로그인</Button>
                            </View>
                        </>}
                    </Formik>
                    
                    {/* 회원가입 / 계정 찾기 */}
                    <View style={style.login_btnGroup2}>
                        <TouchableOpacity style={[style.login_btnGroup]} onPress={() => navigation.navigate('RegisterInput')}>
                            <Text style={{fontWeight: 'bold'}}>회원가입</Text>
                        </TouchableOpacity>
                        <Text>|</Text>
                        <TouchableOpacity style={[style.login_btnGroup]} onPress={() => navigation.navigate('FindAccount')}>
                            <Text>계정찾기</Text>
                        </TouchableOpacity>
                        <Text>|</Text>
                        <TouchableOpacity style={[style.login_btnGroup]} onPress={() => { resetRoot('Main'); }}>
                            <Text>비회원 이용</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={[ style.social_btn, style.container0, {backgroundColor: '#00C73C'} ]} onPress={onNaverClick}>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={require('./../images/naver_login.png')} style={{ width: 18, height: 18 }}></Image>
                        <Text style={[style.social_txt, {color: '#fff'}]}>네이버 로그인</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[ style.social_btn, style.container0, {backgroundColor: '#FAE100'} ]} onPress={onKakaoClick}>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={require('./../images/kakao_login.png')} style={{ width: 20, height: 20}}></Image>
                        <Text style={[style.social_txt, {color: '#000'}]}>카카오톡 로그인</Text>
                    </View>
                </TouchableOpacity>

                {/* <AppleButton
                    buttonStyle={AppleButton.Style.WHITE}
                    buttonType={AppleButton.Type.SIGN_IN}
                    style={{
                    width: 160, // You must specify a width
                    height: 45, // You must specify a height
                    }}
                    onPress={() => onAppleButtonPress()}
                /> */}
                
                {Platform.OS === 'ios' && <TouchableOpacity style={[ style.social_btn, style.container0, {backgroundColor: '#000'} ]} onPress={onAppleButtonPress}>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={require('./../images/apple_login.png')} style={{ width: 22, height: 22 }} />
                        <Text style={[style.social_txt, {color: '#fff'}]}>APPLE 로그인</Text>
                    </View>
                </TouchableOpacity>}
            </View>
        </ScrollView>
    );
}
export default LoginScreen;
