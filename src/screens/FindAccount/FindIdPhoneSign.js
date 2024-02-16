import React, { useContext, useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import API from '../../api';
import { AppContext } from '../../contexts/app-context';
import { basicErrorHandler } from '../../http-error-handler';
import useInterval from '../../hooks/useInterval';
import cstyles from '../../cstyles';
import colors from '../../appcolors';
import Button from '../../components/Button';

export default function FindIdPhoneSignScreen({ navigation }) {
    const { showSnackbar } = useContext(AppContext);

    const [ mobile, setMobile ] = useState('');
    const [ code, setCode ] = useState();
    const [ codeInput, setCodeInput ] = useState('');
    const [ remainTime, setRemainTime ] = useState(0);

    const fetchAuthenticationCode = () => {
        if (code) return;
        if (!mobile) return showSnackbar('핸드폰 번호를 입력하세요.');

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

    const handleFindMyID = () => {
        if (!mobile) return showSnackbar('핸드폰 번호를 입력하세요.');
        if (remainTime <= 0) return showSnackbar('제한시간이 초과되었습니다.');
        if (codeInput !== code) return showSnackbar('인증번호를 잘못 입력하셨습니다.');

        setRemainTime(0);
        setCode(null);
        setCodeInput('');

        API.post('/id_find.php', { mb_hp: mobile, mb_level: 2 })
        .then((data) => {
            const mb_id = data.message;
            const mb_datetime = data.mb_datetime;
            navigation.navigate('FindIdResult', { mb_id, mb_datetime });
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

    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 15 }}>
            <View style={{marginBottom: 20}}><Text style={{ fontSize: 16, color: colors.textPrimary }}>아이디를 찾습니다</Text></View>

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
                <Button mode="outlined" onPress={fetchAuthenticationCode}>인증번호 발송</Button>
            </View>

            <View style={{...style.inputView, marginBottom: 3}}>
                <TextInput
                    ref={codeRef}
                    style={[cstyles.input, { flex: 1 }]}
                    placeholder={'인증번호 입력'}
                    keyboardType="number-pad"
                    editable={!!code}
                    returnKeyType="send"
                    onSubmitEditing={handleFindMyID}
                    onChangeText={setCodeInput}
                />
            </View>
            <Text style={{ fontSize: 14, color: 'red' }}>{code ? "남은시간: " + remainTime : ' '}</Text>
            
            <View style={{ marginTop: 16}}><Button onPress={handleFindMyID}>다음</Button></View>
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
