import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, SectionList, StatusBar } from 'react-native';
import {navigate} from '../../navigation/RootNavigation';
import style from '../../style/style';
import globals from '../../globals';
import colors from '../../appcolors';
import { AuthContext } from '../../contexts/auth-context';
import { AppContext } from '../../contexts/app-context';


export default function ServiceCenter() {
    const { me } = useContext(AuthContext);
    const { showDialog  } = useContext(AppContext);

    const handleInquiryPress = () => {
        if (me) {
            navigate('Questions');
        }
        else {
            showDialog('로그인', '로그인이 필요한 기능입니다.\n로그인하시겠습니까?', () => {
                navigate('Login');
            });
        }
    }

    return (
        <View style={{flex: 1}}>
            <View style={{ backgroundColor: 'white', paddingHorizontal: 15, }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 60, }} onPress={() => { navigate('Notice'); }}>
                    <Text style={style.text2}>공지사항</Text>
                    <Image source={require('../../images/rightbtn.png')}></Image>
                </TouchableOpacity>
                <View style={{backgroundColor: '#EEEEEE', height: 1}}></View>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 60, }} onPress={handleInquiryPress}>
                    <Text style={style.text2}>1:1문의</Text>
                    <Image source={require('../../images/rightbtn.png')}></Image>
                </TouchableOpacity>
                <View style={{backgroundColor: '#EEEEEE', height: 1}}></View>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 60, }} onPress={() => { navigate('FAQ'); }}>
                    <Text style={style.text2}>FAQ</Text>
                    <Image source={require('../../images/rightbtn.png')}></Image>
                </TouchableOpacity>
            </View>

            {/* app version */}
            <Text style={{ paddingVertical: 5, paddingHorizontal: 10, alignSelf: 'flex-end', color: colors.textSecondary }}>버전: v {globals.version}</Text>
        </View>
    );
}
