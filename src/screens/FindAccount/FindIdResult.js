import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Button from '../../components/Button';
import colors from '../../appcolors';


export default function FindIdResult({ route, navigation }) {
    const mb_id = route.params.mb_id;
    const mb_datetime = route.params.mb_datetime;

    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 15 }}>
            <View style={{marginBottom: 20}}>
                <Text style={{ fontSize: 16, color: colors.textPrimary }}>가입하신 계정 정보입니다</Text>
            </View>
            <View>
                <View style={style.inputView}>
                    <Text style={style.resultButton}>아이디</Text>
                    <Text style={style.text2}>{mb_id}</Text>
                </View>
                <View style={style.inputView}>
                    <Text style={style.resultButton}>가입일</Text>
                    <Text style={style.text2}>{mb_datetime.substring(0,10)}</Text>
                </View>
            </View>

            <Button style={{ backgroundColor: '#777777', marginTop: 20 }} onPress={() => { navigation.navigate('FindAccount'); navigation.navigate('FindPass'); }}>비밀번호 찾기</Button>
            <View style={{ marginTop: 10 }}><Button onPress={() => { navigation.navigate('Login'); }}>로그인 화면으로 이동</Button></View>
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
    resultButton: {
        color: '#E51A47',
        borderRadius: 4,
        borderColor: '#E51A47',
        borderWidth: 1,
        paddingHorizontal: 3,
        paddingVertical: 5,
        marginRight: 10,
    },
});
