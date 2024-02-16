import React, { useState, useRef } from 'react';
import { View, Text, TextInput } from 'react-native';

import useInterval from '../hooks/useInterval';
import API from '../api';
import Button from './Button';
import cstyles from '../cstyles';
import colors from '../appcolors';
import { basicErrorHandler } from '../http-error-handler';



const MobileAuth = ({ authenticatedCallback }) => {
    const [ id, setId ] = useState();
    const [ code, setCode ] = useState();
    const [ codeInput, setCodeInput ] = useState('');
    const [ remainTime, setRemainTime ] = useState(0);
    const [ mobile, setMobile ] = useState('');

    const fetchAuthenticationCode = () => {
        if (!mobile || mobile.length !== 11) return setError('올바른 핸드폰번호를 입력하세요.');

        API.post('/member/request_mobile_auth.php', { mobile })
        .then((data) => {
            setId(data.data.id);
            setCode(data.data.code);
            setCodeInput('');
            setRemainTime(180);
            setError(null);
            codeRef.current?.focus();
        })
        .catch(basicErrorHandler);
    }

    const confirmCode = () => {
        if (!mobile) return setError('핸드폰번호를 입력하세요.');
        if (remainTime <= 0) return setError('제한시간이 초과되었습니다.');
        if (codeInput !== code) return setError('인증번호를 잘못 입력하셨습니다.');

        setRemainTime(0);
        setCode(null);
        setCodeInput('');

        API.post('/member/confirm_mobile_auth.php', { id, code })
        .then(() => {
            authenticatedCallback(mobile);
            setMobile('');
            setError(null);
        })
        .catch(basicErrorHandler);
    }

    useInterval(() => {
        if (remainTime > 0) {
            setRemainTime(time => time - 1);
            if (remainTime == 1) {
                setCode(null);
            }
        }
    }, 1000);

    const codeRef = useRef();

    const [ error, setError ] = useState();

	return (
        <>
            <View style={{ padding: 15 }}>
                <View style={{ flexDirection: 'row' }}>
                    <TextInput
                        style={{...cstyles.input, flex: 1, marginRight: 8, fontSize: 12 }}
                        placeholder="핸드폰번호 (국번없이 숫자만 입력)"
                        placeholderTextColor={'#757575'}
                        keyboardType="phone-pad"
                        returnKeyType="send"
                        onSubmitEditing={fetchAuthenticationCode}
                        onChangeText={setMobile}
                        value={mobile}
                    />
                    <Button mode="outlined" style={{ width: 140 }} textStyle={{ fontSize: 14 }} onPress={fetchAuthenticationCode} >인증번호 받기</Button>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8, paddingLeft: 6, paddingRight: 10,  height: 45, borderColor: '#e3e3e3', borderRadius: 5, borderWidth: 1 }}>
                        <TextInput
                            ref={codeRef}
                            style={{ color: colors.textPrimary, flex: 1, marginRight: 8, fontSize: 12 }}
                            placeholder="인증번호 입력"
                            placeholderTextColor={'#757575'}
                            keyboardType="number-pad"
                            returnKeyType="send"
                            onSubmitEditing={confirmCode}
                            onChangeText={setCodeInput}
                            value={codeInput}
                        />
                        <Text style={{ color: 'red', fontSize: 14 }}>{code ? remainTime : ''}</Text>
                    </View>
                    
                    <Button style={{ width: 140 }} textStyle={{ fontSize: 14 }} onPress={confirmCode}>인증확인</Button>
                </View>

            </View>

            {error && <Text style={{ color: 'red', fontSize: 12, marginLeft: 15}}>{error}</Text>}
        </>
    );
}

export default MobileAuth;
