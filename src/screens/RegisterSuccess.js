import React from 'react';
import {Text, TouchableOpacity, View, Image, StatusBar} from 'react-native';
import {CommonActions} from '@react-navigation/native';

import style from '../style/style';
import {SafeAreaView} from 'react-navigation';

function RegisterSuccessScreen({navigation}) {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />

      <View
        style={{
          flex: 1,
          padding: 15,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <Image
          source={require('../images/register_success.png')}
          style={{height: 193, width: 266}}></Image>
        <View height={'45%'}></View>
        <TouchableOpacity
          style={[
            style.button3,
            {backgroundColor: '#E51A47', alignSelf: 'flex-end'},
          ]}
          onPress={() =>
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Main'}],
              }),
            )
          }>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('./../images/home_icon.png')}
              width={15}
              height={15}></Image>
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
                marginLeft: 5,
              }}>
              홈으로
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default RegisterSuccessScreen;
