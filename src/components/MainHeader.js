import * as React from 'react';
import {View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import {Body, Header, Left, Right, Title} from 'native-base';

import {navigate} from '../navigation/RootNavigation';
import styles from '../style/Style';

// 헤더
export const MainHeader = props => {
  const {img} = props;
  return (
    <Header
      iosBarStyle={'dark-content'}
      androidStatusBarColor="white"
      style={{
        height: 50,
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E5E5',
      }}>
      <Left style={{flex: 1}}>
        <TouchableOpacity onPress={() => {}}>
          {img !== '' ? (
            <Image
              source={img}
              style={{resizeMode: 'contain', marginLeft: 10}}></Image>
          ) : null}
        </TouchableOpacity>
      </Left>
      <Body style={{flex: 6}}>
        <Title
          style={{
            alignSelf: 'center',
            color: 'black',
          }}>
          {props.title}
        </Title>
      </Body>
      <Right style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            navigate('SettingHome');
          }}>
          <Image
            source={require('../images/mainsetting.png')}
            style={{resizeMode: 'contain', marginRight: 10}}></Image>
        </TouchableOpacity>
      </Right>
    </Header>
  );
};
