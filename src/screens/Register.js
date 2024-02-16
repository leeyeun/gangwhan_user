import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {navigate} from '../navigation/RootNavigation';

import style from '../style/style';

function RegisterScreen({navigation}) {
    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            <View style={{ alignItems: 'center', padding: 15 }}>
                <Image source={require('../images/imageLogo3x.png')} style={[style.imgContain, {width: 250, height: 200}]}></Image>

                <View style={[style.social_group, {flex: 1, justifyContent: 'center'}]}>
                    <TouchableOpacity style={[ style.social_btn, style.container0, {backgroundColor: '#00C73C'}, ]}>
                        <View style={{flexDirection: 'row'}}>
                        <Image source={require('./../images/naver_login.png')} width={18} height={18}></Image>
                        <Text style={[style.social_txt, {color: '#fff'}]}>네이버 로그인</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[ style.social_btn, style.container0, {backgroundColor: '#FAE100'} ]}>
                        <View style={{flexDirection: 'row'}}>
                            <Image source={require('./../images/kakao_login.png')} width={18} height={18}></Image>
                            <Text style={[style.social_txt, {color: '#000'}]}>카카오톡 로그인</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[ style.social_btn, style.container0, {backgroundColor: '#000'}, ]}>
                        <View style={{flexDirection: 'row'}}>
                            <Image source={require('./../images/apple_login.png')} width={18} height={18}></Image>
                            <Text style={[style.social_txt, {color: '#fff'}]}>APPLE ID 로그인</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[ style.social_btn, style.container0, {backgroundColor: '#E51A47'}, ]} onPress={() => navigation.navigate('RegisterInput')}> 
                        <View style={{flexDirection: 'row'}}>
                            <Image source={require('./../images/register_icon.png')} width={18} height={18}></Image>
                            <Text style={[style.social_txt, {color: '#fff'}]}>일반 회원가입</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                
                <View style={[style.login_btnGroup2, {flex: 1}]}>
                    <TouchableOpacity style={[style.login_btnGroup]} onPress={() => { navigate('Login'); }}>
                    <Text style={{fontWeight: 'bold'}}>로그인</Text>
                    </TouchableOpacity>
                    <Text>|</Text>
                    <TouchableOpacity style={[style.login_btnGroup]} onPress={() => {}}>
                        <Text>비회원 이용</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
export default RegisterScreen;
