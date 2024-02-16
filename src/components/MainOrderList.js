import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Header, Left, Right, Title} from 'native-base';

import {BlueBorderBtn, BtnSubmit, InputText} from '../../components/BOOTSTRAP';
import {navigate} from '../navigation/RootNavigation';
import styles from '../style/Style';
import { order_menu_summary_pipe, order_menu_length_pipe, time_pipe, order_delivery_wrap_pipe, order_online_pipe, order_pay_method_pipe } from '../pipes';
import NumberFormat from '../components/NumberFormat';
import colors from '../appcolors';



// 리스트 내용
export const OrderListRender = ({item}) => (
  <TouchableOpacity
    onPress={() => {
      navigate(
        item.deltakeout === '배달' ? 'OrderDelDetail' : 'TakeOutDelDetail',
      );
    }}>
    <View
      style={{
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 20,
      }}>
      <Text style={[styles.mediumtxt16]}>{item.od_addr1}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 5,
        }}>
        <Text style={{fontSize: 16}}>{item.od_addr2}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <Text style={[styles.mediumtxt16, {fontSize: 14, color: '#777777'}]}>
          [메뉴 {order_menu_length_pipe(item)}개]{' '}
        </Text>
        <Text style={{color: '#777777'}}>{order_menu_summary_pipe(item)}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 5,
      }}>
          <Text style={{ fontSize: 14, color: '#777777' }}>{order_delivery_wrap_pipe(item)}</Text>
          <View style={{ alignSelf: 'stretch', borderColor: colors.textSecondary, borderRightWidth: 1, marginHorizontal: 10, marginVertical: 3 }} />
          <Text style={{ fontSize: 14, color: '#777777' }}>{order_online_pipe(item) ? '온' : '직'}.{order_pay_method_pipe(item)}</Text>
          <View style={{ alignSelf: 'stretch', borderColor: colors.textSecondary, borderRightWidth: 1, marginHorizontal: 10, marginVertical: 3 }} />
          <NumberFormat value={item.od_cart_price} render={value => <Text style={{color: '#777777'}}>{value}원</Text>} />
          <View style={{ flex: 1}}  />
          <Text>{time_pipe(item.od_time)}</Text>
      </View>
    </View>
    <View style={{height: 1, backgroundColor: '#CCCCCC'}}></View>
  </TouchableOpacity>
);
