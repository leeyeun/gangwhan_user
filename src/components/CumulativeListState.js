import * as React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import {Header, Left, Right, Title} from 'native-base';

import {BlueBorderBtn, BtnSubmit, InputText} from './BOOTSTRAP';
import {navigate} from '../navigation/RootNavigation';
import styles from '../style/Style';

export const CumulativeData = [
  {
    id: 1,
    shopAddress: '인천 강화군 강화읍 갑룡길 3',
    delAddress: '인천광역시 강화군 강화읍 관청리 89-1',
    deltakeout: '배달',
    delKm: '온.결제완료',
    time: '2021.03.23 10:14',
    pay: '2,500',
    picKg: null,
    color: '#FBE0DE',
  },
  {
    id: 2,
    shopAddress: '인천 강화군 강화읍 갑룡길 3',
    delAddress: '인천광역시 강화군 강화읍 관청리 89-1',
    deltakeout: '포장',
    delKm: '온.결제완료',
    time: '2021.03.23 10:14',
    pay: '2,500',
    picKg: '1',
    color: '#E1F2FF',
  },
  {
    id: 3,
    shopAddress: '인천 강화군 강화읍 갑룡길 3',
    delAddress: '인천광역시 강화군 강화읍 관청리 89-1',
    deltakeout: '포장',
    delKm: '온.결제완료',
    time: '2021.03.23 10:14',
    pay: '2,500',
    picKg: null,
    color: '#FFFFAE',
  },
  {
    id: 4,
    shopAddress: '인천 강화군 강화읍 갑룡길 3',
    delAddress: '인천광역시 강화군 강화읍 관청리 89-1',
    deltakeout: '배달',
    delKm: '온.결제완료',
    time: '2021.03.23 10:14',
    pay: '2,500',
    picKg: null,
    color: '#FFDFB5',
  },
  {
    id: 11,
    shopAddress: '인천 강화군 강화읍 갑룡길 3',
    delAddress: '인천광역시 강화군 강화읍 관청리 89-1',
    deltakeout: '배달',
    delKm: '온.결제완료',
    time: '2021.03.23 10:14',
    pay: '2,500',
    picKg: null,
    color: '#E7F5E6',
  },
  {
    id: 5,
    shopAddress: '인천 강화군 강화읍 갑룡길 3',
    delAddress: '인천광역시 강화군 강화읍 관청리 89-1',
    deltakeout: '포장',
    delKm: '온.결제완료',
    time: '2021.03.23 10:14',
    pay: '2,500',
    picKg: null,
    color: '#FFD5F9',
  },
  {
    id: 6,
    shopAddress: '인천 강화군 강화읍 갑룡길 3',
    delAddress: '인천광역시 강화군 강화읍 관청리 89-1',
    deltakeout: '배달',
    delKm: '온.결제완료',
    time: '2021.03.23 10:14',
    pay: '2,500',
    picKg: null,
    color: '#BFCCFF',
  },
  {
    id: 7,
    shopAddress: '인천 강화군 강화읍 갑룡길 3',
    delAddress: '인천광역시 강화군 강화읍 관청리 89-1',
    deltakeout: '배달',
    delKm: '온.결제완료',
    time: '2021.03.23 10:14',
    pay: '2,500',
    picKg: null,
    color: '#E9C4C4',
  },
  {
    id: 8,
    shopAddress: '인천 강화군 강화읍 갑룡길 3',
    delAddress: '인천광역시 강화군 강화읍 관청리 89-1',
    deltakeout: '포장',
    delKm: '온.결제완료',
    time: '2021.03.23 10:14',
    pay: '2,500',
    picKg: null,
    color: '#CDF3F0',
  },
  {
    id: 9,
    shopAddress: '인천 강화군 강화읍 갑룡길 3',
    delAddress: '인천광역시 강화군 강화읍 관청리 89-1',
    deltakeout: '포장',
    delKm: '온.결제완료',
    time: '2021.03.23 10:14',
    pay: '2,500',
    picKg: null,
    color: '#E2D8FF',
  },
  {
    id: 10,
    shopAddress: '인천 강화군 강화읍 갑룡길 3',
    delAddress: '인천광역시 강화군 강화읍 관청리 89-1',
    deltakeout: '배달',
    delKm: '온.결제완료',
    time: '2021.03.23 10:14',
    pay: '2,500',
    picKg: null,
    color: '#F3F3F3',
  },
];

// 리스트 내용
export const CumulativeListState = ({item}) => (
  <TouchableOpacity
    onPress={() => {
      navigate('SuccessDelivery');
    }}>
    <View
      style={{
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 20,
      }}>
      <Text style={[styles.mediumtxt16]}>{item.shopAddress}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 5,
        }}>
        <Text style={{fontSize: 16}}>{item.delAddress}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <Text style={[styles.mediumtxt16, {fontSize: 14, color: '#777777'}]}>
          [메뉴 3개]{' '}
        </Text>
        <Text style={{color: '#777777'}}>김치찌개(대) 1개 외 2</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 5,
        }}>
        <Text style={{color: '#777777'}}>
          {item.deltakeout} | {item.delKm} | {item.pay}원
        </Text>
        <Text>{item.time}</Text>
      </View>
    </View>
    <View style={{height: 1, backgroundColor: '#CCCCCC'}}></View>
  </TouchableOpacity>
);
