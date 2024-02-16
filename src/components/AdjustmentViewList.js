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

import {BlueBorderBtn, BtnSubmit, InputText, Underline1} from './BOOTSTRAP';
import {navigate} from '../navigation/RootNavigation';
import styles from '../style/Style';

export const AdjustmentViewData = [
  {
    id: 1,
    month: '3',
    adjustState: '정산중',
    money: '2,775,000',
  },
  {
    id: 2,
    month: '2',
    adjustState: '정산완료',
    money: '1,999,000',
  },
  {
    id: 3,
    month: '1',
    adjustState: '정산완료',
    money: '204,000',
  },
];

// 리스트 내용
export function AdjustmentViewListRender({
  item,
  setAdjustModal,
  setAdjustSuccess,
}) {
  return (
    <>
      <View style={[styles.underline100, {marginHorizontal: 15}]} />
      <TouchableOpacity
        onPress={() => {
          setAdjustModal(true);
          {
            item.adjustState === '정산완료'
              ? setAdjustSuccess(true)
              : setAdjustSuccess(false);
          }
        }}>
        <View
          style={{
            height: 50,
            flex: 1,
            padding: 15,
          }}>
          <View style={[styles.Row, {paddingHorizontal: 15}]}>
            <Text style={{fontSize: 16, flex: 0.7}}>{item.month}월</Text>
            <Text style={{fontSize: 16, flex: 2}}>{item.adjustState}</Text>
            <Text style={[styles.mediumtxt16, {flex: 1, textAlign: 'right'}]}>
              {item.money}원
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}
