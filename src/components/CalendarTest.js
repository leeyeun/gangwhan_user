import * as React from 'react';
import {View, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import {BtnSubmit, InputText, Underline1} from './BOOTSTRAP';
import {AmPmPopUp} from './AmPmPopUp';
import {ModalWeekButton} from './ModalWeekButton';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';
import Modal from 'react-native-modal';

import {navigate} from '../navigation/RootNavigation';
import styles from '../style/Style';

export const CalendarHeader = () => {
  const now = new Date();
  return (
    <View
      style={[
        styles.Row1,
        {
          flex: 1,
          backgroundColor: '#F6F6F6',
          justifyContent: 'space-evenly',
          height: 45,
          marginHorizontal: -15,
          marginTop: 20,
        },
      ]}>
      <Text style={{fontSize: 16}}>월</Text>
      <Text style={{fontSize: 16}}>화</Text>
      <Text style={{fontSize: 16}}>수</Text>
      <Text style={{fontSize: 16}}>목</Text>
      <Text style={{fontSize: 16}}>금</Text>
      <Text style={{fontSize: 16}}>토</Text>
      <Text style={{color: 'red', fontSize: 16}}>일</Text>
    </View>
  );
};
