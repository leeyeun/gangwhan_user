import React from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';

import style from '../../style/style';

const FindButton = props => {
  return (
    <TouchableOpacity onPress={() => props.navigations}>
      <View style={style.findButton}>
        <Text style={style.text2}>{props.title}</Text>
        <Image
          //   source={require('./../images/top_back.png')}
          source={require('../../images/top_back.png')}
          style={{
            width: 15,
            height: 15,
            tintColor: '#000',
            resizeMode: 'contain',
          }}></Image>
      </View>
    </TouchableOpacity>
  );
};

function FindAccountScreen({navigation}) {
  return (
    <View style={{height: 200, backgroundColor: 'white'}}>
      <View style={{padding: 15}}>
        <View style={{paddingTop: 10, paddingBottom: 20}}>
          <Text style={style.subtitle}>강화N 가입정보를 확인합니다</Text>
        </View>
        <View
          style={{
            borderWidth: 0.5,
            height: 110,
            borderColor: '#E5E5E5',
            borderRadius: 6,
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('FindId')}>
            <View style={style.findButton}>
              <Text style={style.text2}>아이디를 찾습니다.</Text>
              <Image
                source={require('../../images/top_back.png')}
                style={{
                  width: 15,
                  height: 15,
                  tintColor: '#000',
                  resizeMode: 'contain',
                }}></Image>
            </View>
          </TouchableOpacity>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: '#EEEEEE',
              marginHorizontal: 15,
            }}></View>
          <TouchableOpacity onPress={() => navigation.navigate('FindPass')}>
            <View style={style.findButton}>
              <Text style={style.text2}>비밀번호를 찾습니다.</Text>
              <Image
                source={require('../../images/top_back.png')}
                style={{
                  width: 15,
                  height: 15,
                  tintColor: '#000',
                  resizeMode: 'contain',
                }}></Image>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default FindAccountScreen;
