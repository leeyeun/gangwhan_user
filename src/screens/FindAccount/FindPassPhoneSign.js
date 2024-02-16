import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import API from '../../api';
import Button from '../../components/Button';
import { AppContext } from '../../contexts/app-context';
import cstyles from '../../cstyles';
import useInterval from '../../hooks/useInterval';
import colors from '../../appcolors';
import { basicErrorHandler } from '../../http-error-handler';


export default function FindPasswordPhoneSignScreen({ route, navigation }) {
    const { showAlert } = useContext(AppContext);

    const [ mobile, setMobile ] = useState('');
    const [ code, setCode ] = useState();
    const [ codeInput, setCodeInput ] = useState('');
    const [ remainTime, setRemainTime ] = useState(0);

    const fetchAuthenticationCode = () => {
        if (code) return;
        if (!mobile) return showAlert('핸드폰 번호를 입력하세요.');

        API.post('/hp_num_send.php', { mb_hp: mobile, mb_level: 2 })
        .then((data) => {
            setCode(data.message);
            setCodeInput('');
            setRemainTime(180);
            setTimeout(() => {
                codeRef.current.focus();
            }, 300);
        })
        .catch(basicErrorHandler);
    }

    const handleFindMyPassword = () => {
        if (!mobile) return showAlert('핸드폰 번호를 입력하세요.');
        if (remainTime <= 0) return showAlert('제한시간이 초과되었습니다.');
        if (codeInput !== code) return showAlert('인증번호를 잘못 입력하셨습니다.');

        setRemainTime(0);
        setCode(null);
        setCodeInput('');

        navigation.navigate('FindPassResult', { mb_id: route.params.mb_id, mb_hp: mobile });
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

    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 15 }}>
            <View style={{marginBottom: 20}}><Text style={{ fontSize: 16, color: colors.textPrimary }}>비밀번호를 찾습니다</Text></View>

            <View style={style.inputView}>
                <TextInput
                    style={{...cstyles.input, flex: 1, marginRight: 10}}
                    placeholder={'핸드폰 번호 입력'} 
                    keyboardType="number-pad"
                    editable={!code}
                    returnKeyType="send"
                    onSubmitEditing={fetchAuthenticationCode}
                    onChangeText={setMobile}
                />
                <Button onPress={fetchAuthenticationCode}>인증번호 발송</Button>
            </View>

            <View style={{...style.inputView, marginBottom: 4 }}>
                <TextInput
                    ref={codeRef}
                    style={[cstyles.input, { flex: 1 }]}
                    placeholder={'인증번호 입력'}
                    keyboardType="number-pad"
                    editable={!!code}
                    returnKeyType="send"
                    onSubmitEditing={handleFindMyPassword}
                    onChangeText={setCodeInput}
                />
            </View>
            <Text style={{ fontSize: 14, color: 'red' }}>{code ? "남은시간: " + remainTime : ' '}</Text>
            
            <View style={{ marginTop: 20}}><Button onPress={handleFindMyPassword}>다음</Button></View>
        </View>
    );
}

const style = StyleSheet.create({
    inputView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
});
