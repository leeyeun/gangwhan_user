import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import API from '../../api';
import Button from '../../components/Button';
import { AppContext } from '../../contexts/app-context';
import cstyles from '../../cstyles';
import colors from '../../appcolors';
import { basicErrorHandler } from '../../http-error-handler';

export default function FindPassResultScreen({route, navigation}) {
    const { showSnackbar } = React.useContext(AppContext);

    const [ password, setPassword ] = React.useState('');
    const [ rePassword, setRePassword ] = React.useState('');

    const handlePasswordReset = () => {
        if (!password || !rePassword) return showSnackbar('입력란을 채워주세요.');
        if (password !== rePassword) return showSnackbar('비밀번호 재입력란과 일치하지 않습니다.');

        const data = {
            mb_hp: route.params.mb_hp,
            mb_id: route.params.mb_id,
            mb_password: password,
            mb_password_re: rePassword,
        };
        API.post('/pw_reset.php', data)
        .then(() => { 
            showSnackbar('비밀번호를 변경했습니다.');
            navigation.navigate('Login') 
        })
        .catch(basicErrorHandler);
    }

    const rePasswordRef = React.useRef();

    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 15 }}>
            <View style={{marginBottom: 20}}><Text style={{ color: colors.textPrimary}}>새로운 비밀번호를 설정해 주세요</Text></View>

            <View style={style.inputView}>
                <TextInput
                    style={{...cstyles.input, flex: 1}}
                    placeholder="새 비밀번호 입력"
                    textContentType="newPassword"
                    secureTextEntry={true}
                    returnKeyType="next"
                    onSubmitEditing={() => { rePasswordRef.current.focus(); }}
                    onChangeText={setPassword}
                />
            </View>

            <Text style={{color: '#E51A47', marginTop: 5}}>영문, 숫자, 특수기호를 모두 포함해 8자 이상</Text>
            <View style={[style.inputView, {marginTop: 10}]}>
                <TextInput
                    ref={rePasswordRef}
                    style={{...cstyles.input, flex: 1}}
                    placeholder="새 비밀번호 재입력"
                    textContentType="newPassword"
                    secureTextEntry={true}
                    returnKeyType="send"
                    onSubmitEditing={handlePasswordReset}
                    onChangeText={setRePassword}
                />
            </View>
            
            <View style={{ marginTop: 20 }}><Button onPress={handlePasswordReset}>비밀번호 변경</Button></View>
        </View>
    );
}

const style = StyleSheet.create({
    inputView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
});
