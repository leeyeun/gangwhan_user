import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import API from '../../api';
import Button from '../../components/Button';
import { AppContext } from '../../contexts/app-context';
import { basicErrorHandler } from '../../http-error-handler';
import cstyles from '../../cstyles';
import colors from  '../../appcolors';

export default function FindPassScreen({ navigation }) {
    const { showSnackbar } = useContext(AppContext)
    const [ id, setId ] = useState()

    const handleIdCheck = () => {
        if (!id) return showSnackbar('아이디를 입력하세요.');

        API.post('/check_id.php', { mb_id: id })
            .then(() => {
            showSnackbar('존재하지 않는 아이디 입니다.');
        })
        .catch(error => {
            if (error.message == '사용중인 ID') {   // 성공한 플로우
                navigation.navigate('FindPassPhoneSign', { mb_id: id });
                return;
            }
            basicErrorHandler(error);
        });
    }

    return (
        <View style={{ flex: 1, padding: 15, backgroundColor: 'white' }}>
            <View style={{ marginBottom: 20 }}><Text style={{ fontSize: 16, color: colors.textPrimary }}>비밀번호를 찾습니다</Text></View>
            
            <View style={style.inputView}>
                <TextInput
                    style={{...cstyles.input, flex: 1}}
                    placeholder={'아이디를 입력해주세요'}
                    autoCapitalize="none"
                    returnKeyType="send"
                    onSubmitEditing={handleIdCheck}
                    onChangeText={setId}
                />
            </View>
            
            <View style={{ marginTop: 10 }}><Button onPress={handleIdCheck}>휴대폰 인증</Button></View>
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
