import React, { useState, useContext, useRef } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';

import { Underline10 } from '../../components/BOOTSTRAP';
import styles from '../../style/Styles';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { resetRoot } from '../../navigation/RootNavigation';
import { AuthContext } from '../../contexts/auth-context';
import { AppContext } from '../../contexts/app-context';
import API from '../../api';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import globals from '../../globals';
import colors from '../../appcolors';
import cstyles from '../../cstyles';
import {} from '../../pipes';
import { basicErrorHandler } from '../../http-error-handler';
import MobileAuth from '../../components/MobileAuth';


export default function MyinfoScreen() {
    const { me, clearAuthInfo, fetchMyinfo } = useContext(AuthContext);
    const { showSnackbar, showDialog } = useContext(AppContext);

    // password change
    const handlePasswordChange = (values, actions) => {
        API.post('/member/change_password.php', { ...values })
        .then(data => {
            showSnackbar('비밀번호를 변경했습니다.');
            actions.resetForm();
        })
        .catch(basicErrorHandler)
        .finally(() => { actions.setSubmitting(false); });
    }
    const new_passwordRef = useRef();
    const new_password_re_Ref =useRef();
    // end: password change

    // mobile change / mobile auth
    const authenticatedCallback = (mobile) => {
        API.post('/member/change_mobile.php', { mb_id: me.mb_id, mb_hp: mobile })
        .then(() => {
            showSnackbar('핸드폰번호를 업데이트했습니다.');
            fetchMyinfo();
        })
        .catch(basicErrorHandler);
    }
    // end: mobile change

    // leave app
    const handleLeaveApp = () => {
        showDialog('회원탈퇴', '강화N이 가지고 있는 사용자 정보가 모두 삭제됩니다. 탈퇴하시겠습니까?', () => {
            const data = { mb_id: me.mb_id };
            API.post('/member/leave_app.php', data)
            .then(() => {
                clearAuthInfo();
                showSnackbar('회원탈퇴했습니다.');
                resetRoot('Main');
            })
            .catch(basicErrorHandler);
        })
    }

    return (
        <>
            {me ? <ScrollView style={{ backgroundColor: 'white' }}>
                {/* 기본정보 */}
                <View style={{padding: 15}}>
                    {me.mb_7 === 'C' && <TextLine title="아이디" value={me.mb_id} />}
                    <TextLine title="닉네임" value={me.mb_nick} />
                </View>
                <Underline10 />

                {/* 비밀번호 변경 */}
                {me.mb_7 === 'C' && <Formik
                    initialValues={{ 
                        mb_id: me.mb_id,
                        old_password: '',
                        new_password: '',
                        new_password_re: '',
                    }}
                    validationSchema={Yup.object().shape({
                        mb_id: Yup.string().required('필수입력입니다.'),
                        old_password: Yup.string().required('필수입력입니다.'),
                        new_password: Yup.string().required('필수입력입니다.'),
                        new_password_re: Yup.string().required('필수입력입니다.').oneOf([Yup.ref('new_password'), null], '비밀번호가 일치하지 않습니다.'),
                    })}
                    onSubmit={handlePasswordChange}
                >
                    {({handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, dirty, touched, errors, isValid, values, isSubmitting }) => <>
                        <View style={{ padding: 15 }}>
                            <Text style={styles.mediumtxt16}>비밀번호 변경</Text>
                            <TextInput
                                placeholder="기존 비밀번호 입력"
                                style={{ ...cstyles.input, marginTop: 10 }}
                                placeholderTextColor={'#757575'}
                                textContentType="password"
                                secureTextEntry={true}
                                returnKeyType="next"
                                onSubmitEditing={() => { new_passwordRef.current.focus() }}
                                onChangeText={handleChange('old_password')}
                                onBlur={handleBlur('old_password')}
                                value={values.old_password}
                            />
                            <Text style={{ color: 'red' }}>{touched.old_password && errors.old_password || ' '}</Text>

                            <TextInput 
                                ref={new_passwordRef}
                                style={{...cstyles.input,}}
                                placeholder="새 비밀번호 입력"
                                placeholderTextColor={'#757575'}
                                textContentType="password"
                                secureTextEntry={true}
                                returnKeyType="next"
                                onSubmitEditing={() => { new_password_re_Ref.current.focus() }}
                                onChangeText={handleChange('new_password')}
                                onBlur={handleBlur('new_password')}
                                value={values.new_password}
                            />
                            <Text style={{ color: 'red' }}>{touched.new_password && errors.new_password || ' '}</Text>

                            <TextInput 
                                ref={new_password_re_Ref}
                                style={{ ...cstyles.input, }}
                                placeholder="새 비밀번호 재입력"
                                placeholderTextColor={'#757575'}
                                textContentType="password"
                                secureTextEntry={true}
                                returnKeyType="send"
                                onSubmitEditing={handleSubmit}
                                onChangeText={handleChange('new_password_re')}
                                onBlur={handleBlur('new_password_re')}
                                value={values.new_password_re}
                            />
                            <Text style={{ color: 'red' }}>{touched.new_password_re && errors.new_password_re || ' '}</Text>
                            
                            <Button disabled={isSubmitting} loading={isSubmitting} onPress={handleSubmit}>변경하기</Button>
                        </View>
                        <Underline10 />
                    </>}
                </Formik>}
                
                {/* 핸드폰 번호 변경 및 인증 */}
                <View style={{ marginVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 15 }}>
                        <Text style={{ fontSize: 16, color: colors.textPrimary }}>{me.hp_authenticated === 'Y' ? '핸드폰번호 변경' : '핸드폰 인증'}</Text>
                        {me.hp_authenticated === 'Y' && <Text style={{ fontSize: 12, color: colors.primary }}>(핸드폰인증을 완료하셨습니다.)</Text>}
                    </View>
                    <MobileAuth authenticatedCallback={authenticatedCallback} />
                </View>
                <Underline10 />

                {/* 회원탈퇴 */}
                <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
                    <Button style={{ backgroundColor: colors.gray300 }} onPress={handleLeaveApp}>회원탈퇴</Button>
                </View>
                <Underline10 />
            </ScrollView> : <Loading />}
        </>
    );
}

const TextLine = props => {
    return (
        <View style={[ styles.Row1, {justifyContent: 'space-between', marginBottom: 10}, ]}>
            <Text style={styles.mediumtxt16}>{props.title}</Text>
            <Text style={{fontSize: 16}}>{props.value}</Text>
        </View>
    );
};

