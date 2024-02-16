import React, { useState, useContext, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { Underline10 } from '../components/BOOTSTRAP';
import styles from '../style/style';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Button from '../components/Button';
import colors from '../appcolors';
import { mobile_pipe } from '../pipes';
import cstyles from '../cstyles';
import API from '../api';
import { AuthContext } from '../contexts/auth-context';
import { AppContext } from '../contexts/app-context';
import { basicErrorHandler } from '../http-error-handler';
import MobileAuthModal from '../components/MobileAuthModal';


const validationSchema = Yup.object().shape({
    mb_id: Yup.string().required('필수입력입니다.'),
    mb_password: Yup.string().required('필수입력입니다.').max(50, '비밀번호가 너무 깁니다.').matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, '8자이상, 숫자/영문자 최소 1자 포함'),
    mb_password_re: Yup.string().required('필수입력입니다.').oneOf([Yup.ref('mb_password'), null], '비밀번호가 일치하지 않습니다.'),
    mb_name: Yup.string().required('필수입력입니다.'),
    mb_nick: Yup.string().required('필수입력입니다.'),
    mb_email: Yup.string().email(),
});

const socialValidationSchema = Yup.object().shape({
    mb_id: Yup.string().required('필수입력입니다.'),
    mb_nick: Yup.string().required('필수입력입니다.'),
});

export default function RegisterInput({ navigation, route }) {
    const { setAuthInfo } = useContext(AuthContext);
    const { showSnackbar, showAlert } = useContext(AppContext);

    const [ appPolicyAgree, setAppPolicyAgree ] = useState(false);
    const [ privacyAgree, setPrivacyAgree ] = useState(false);
    const [ positionTrackAgree, setPositionTrackAgree ] = useState(false);

    const mb_7 = useMemo(() => {
        return route.params?.mb_7 || 'C';
    }, [ route.params ]);

    const mb_id = useMemo(() => {
        return route.params?.mb_id;
    });

    const handleSubmit = (values, actions) => {
        if (!appPolicyAgree) {
            actions.setSubmitting(false);
            return showAlert('이용약관에 동의해 주세요.');
        }
        if (!privacyAgree) {
            actions.setSubmitting(false);
            return showAlert('개인정보처리방침에 동의해 주세요.');
        }
        if (!positionTrackAgree) {
            actions.setSubmitting(false);
            return showAlert('위치기반서비스 이용약관에 동의해 주세요.');
        }

        // SNS 로그인이 아닐 경우 다음을 기재하도록 함
        if (mb_7 === 'C') {
            if (!values.mb_name) {
                actions.setSubmitting(false);
                return showAlert('이름을 입력하세요.');
            }
            if (!mobile) {
                actions.setSubmitting(false);
                return showAlert('핸드폰 인증이 필요합니다.');
            }
            values['mb_hp'] = mobile;
        }

        API.post('/member_insert.php', {
            ...values,
            mb_level: 2,
            mb_7,
        })
        .then(() => {
            return messaging().getToken();
        })
        .then(token => {
            return API.post('/login_select.php', {
                ...values,
                token,
                mb_level: '2',
                mb_7,
            });
        })
        .then(data => {
            setAuthInfo(data.rowdata[0], data.jwt);
            navigation.navigate('JoinDone');
        })
        .catch(basicErrorHandler)
        .finally(() => { 
            actions.setSubmitting(false); 
        });
    }

    const handleIdCheck = (mb_id) => {
        if (!mb_id) return;
        API.post('/check_id.php', { mb_id })
        .then(() => {
            showSnackbar('사용가능한 아이디입니다.');
        })
        .catch(basicErrorHandler);
    }

    // 핸드폰번호 인증
    const [ mobile, setMobile ] = useState();  // 번호가 있으면 인증되었음
    const [ mobileAuthModalOpen, setMobileAuthModalOpen ] = useState(false);
    const handleMobileAuthPress = () => {
        setMobileAuthModalOpen(true);
    }
    const authenticatedCallback = (result) => {
        showSnackbar('인증되었습니다.');
        setMobile(result);
        setMobileAuthModalOpen(false);
    }
    // end: 핸드폰번호 인증

    const rePasswordRef = useRef();
    const nameRef = useRef();
    const emailRef = useRef();

    return <>
        <SafeAreaView style={{
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            backgroundColor: 'red',
            flex:0
        }} />
        
        <Formik
            initialValues={{ 
                mb_id: mb_id || '',
                mb_password: '',
                mb_password_re: '',
                mb_name: '',
                mb_nick: '',
                mb_email: '',
            }}
            validationSchema={mb_7 == 'C' ? validationSchema : socialValidationSchema}
            enableReinitialize={true}
            onSubmit={handleSubmit}
        >
            {({handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, dirty, touched, errors, isValid, values, isSubmitting }) => <>
                <ScrollView style={styles.container}>
                    <View style={{padding: 15, flex: 1, backgroundColor: 'white' }}>
                        {mb_7 == 'C' && <>
                            <Text style={styles.mediumtxt16}>아이디</Text>
                            <View style={[styles.Row1, {flex: 1, marginTop: 10 }]}>
                                <TextInput
                                    style={{ ...cstyles.input, flex: 1, marginRight: 10 }}
                                    placeholder="아이디"
                                    placeholderTextColor={'#757575'}
                                    autoCapitalize="none"
                                    returnKeyType="send"
                                    onSubmitEditing={() => { handleIdCheck(values.mb_id); }}
                                    onChangeText={handleChange('mb_id')}
                                    onBlur={handleBlur('mb_id')}
                                    value={values.mb_id}
                                />
                                <Button mode="outlined" style={{ width: 100 }} textStyle={{ fontSize: 14 }} disabled={!values.mb_id} onPress={() => { handleIdCheck(values.mb_id); }}>중복확인</Button>
                            </View>
                            <Text style={{ color: 'red' }}>{touched.mb_id && errors.mb_id || ' '}</Text>

                            <Text style={{...styles.mediumtxt16, marginTop: 10 }}>비밀번호</Text>
                            <TextInput
                                style={{ ...cstyles.input, flex: 1, marginRight: 10, marginTop: 10 }}
                                placeholder="영문, 숫자, 특수기호를 모두 포함해 8자 이상"
                                placeholderTextColor={'#757575'}
                                textContentType="password"
                                secureTextEntry={true}
                                returnKeyType="next"
                                onSubmitEditing={() => { rePasswordRef.current.focus(); }}
                                onChangeText={handleChange('mb_password')}
                                onBlur={handleBlur('mb_password')}
                                value={values.mb_password}
                            />
                            <Text style={{ color: 'red' }}>{touched.mb_password && errors.mb_password || ' '}</Text>

                            <Text style={{...styles.mediumtxt16, marginTop: 15}}>비밀번호 확인</Text>
                            <TextInput
                                ref={rePasswordRef}
                                style={{ ...cstyles.input, flex: 1, marginRight: 10, marginTop: 10 }}
                                placeholder="비밀번호 한번 더 입력"
                                placeholderTextColor={'#757575'}
                                textContentType="password"
                                secureTextEntry={true}
                                returnKeyType="next"
                                onSubmitEditing={() => { nameRef.current.focus(); }}
                                onChangeText={handleChange('mb_password_re')}
                                onBlur={handleBlur('mb_password_re')}
                                value={values.mb_password_re}
                            />
                            <Text style={{ color: 'red' }}>{touched.mb_password_re && errors.mb_password_re || ' '}</Text>

                            <Text style={{...styles.mediumtxt16, marginTop: 15}}>이름</Text>
                            <TextInput
                                ref={nameRef}
                                style={{ ...cstyles.input, flex: 1, marginRight: 10, marginTop: 10 }}
                                placeholder="이름"
                                placeholderTextColor={'#757575'}
                                returnKeyType="done"
                                onChangeText={handleChange('mb_name')}
                                onBlur={handleBlur('mb_name')}
                                value={values.mb_name}
                            />
                            <Text style={{ color: 'red' }}>{touched.mb_name && errors.mb_name || ' '}</Text>

                            <Text style={{...styles.mediumtxt16, marginTop: 15}}>핸드폰 번호</Text>
                            <TextInput
                                style={{ ...cstyles.input, flex: 1, marginRight: 10, marginTop: 10, color: colors.textSecondary }}
                                placeholder="핸드폰 번호 인증 버튼을 누르세요."
                                placeholderTextColor={'#757575'}
                                keyboardType="number-pad"
                                returnKeyType="done"
                                value={mobile_pipe(mobile)}
                                editable={false}
                            />
                            <View style={{ marginTop: 10, marginRight: 10 }}><Button mode="outlined" onPress={handleMobileAuthPress} disabled={mobile}>{mobile ? '인증되었습니다.' : '핸드폰 번호 인증'}</Button></View>
                        </>}

                        <Text style={{...styles.mediumtxt16, marginTop: 24}}>닉네임</Text>
                        <TextInput
                            style={{ ...cstyles.input, flex: 1, marginRight: 10, marginTop: 10 }}
                            placeholder="게시글 또는 리뷰 작성자로 표기됩니다."
                            placeholderTextColor={'#757575'}
                            returnKeyType={emailRef?.current ? 'next' : 'done'}
                            onSubmitEditing={() => { emailRef?.current?.focus(); }}
                            onChangeText={handleChange('mb_nick')}
                            onBlur={handleBlur('mb_nick')}
                            value={values.mb_nick}
                        />
                        <Text style={{ color: 'red' }}>{touched.mb_nick && errors.mb_nick || ' '}</Text>

                        {mb_7 === 'C' && <>
                            <Text style={{...styles.mediumtxt16, marginTop: 15}}>이메일 <Text style={{ fontSize: 12 }}>(선택)</Text></Text>
                            <TextInput
                                ref={emailRef}
                                style={{ ...cstyles.input, flex: 1, marginRight: 10, marginTop: 10 }}
                                placeholder="이메일을 입력하세요."
                                placeholderTextColor={'#757575'}
                                returnKeyType="done"
                                onChangeText={handleChange('mb_email')}
                                onBlur={handleBlur('mb_email')}
                                value={values.mb_email}
                            />
                            <Text style={{ color: 'red' }}>{touched.mb_email && errors.mb_email || ' '}</Text>
                        </>}
                    </View>
                    <Underline10 />
                    <View style={{paddingTop: 15, backgroundColor: 'white' }}>
                        <BottomTos title="이용약관 동의" agree={appPolicyAgree} onPress={() => { navigation.navigate('Policy', { code: 'provision', setAppPolicyAgree ,}) }} />
                        <BottomTos title="개인정보처리방침 동의" agree={privacyAgree} onPress={() => { navigation.navigate('Policy', { code: 'privacy', setPrivacyAgree }) }} />
                        <BottomTos title="위치기반서비스 이용약관 동의" agree={positionTrackAgree} onPress={() => { navigation.navigate('Policy', { code: 'useguide2', setPositionTrackAgree }) }} />

                        <View style={{ marginTop: 15, marginBottom: 20, marginHorizontal: 15 }}>
                            <Button disabled={isSubmitting} loading={isSubmitting} onPress={handleSubmit}>회원가입</Button>
                        </View>
                    </View>
                </ScrollView>
            </>}
        </Formik>

        <MobileAuthModal visible={mobileAuthModalOpen} setVisible={setMobileAuthModalOpen} authenticatedCallback={authenticatedCallback} />
    </>
}

const BottomTos = props => {
  return (
    <View style={[ styles.Row1, { justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: 10, } ]}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[styles.mediumtxt16, { fontSize: 14 }]}>{props.title} <Text style={{ color: colors.textPrimary, fontSize: 12 }}>(필수)</Text></Text>
            {props.agree && <Text style={{ marginLeft: 10, color: colors.textSecondary, fontSize: 12 }}>- 동의완료</Text>}
        </View>
        
        {!props.agree && <TouchableOpacity style={{ width: 73, height: 29, backgroundColor: '#FEEDEC', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }} onPress={props.onPress}>
            <Text style={{fontWeight: '600', color: colors.primary}}>자세히</Text>
        </TouchableOpacity>}
    </View>
  );
};
