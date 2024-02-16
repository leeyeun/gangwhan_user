import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  Dimensions,
} from 'react-native';

import {BtnSubmit} from './BOOTSTRAP';
import {navigate} from '../navigation/RootNavigation';
import styles from '../style/Style';

const data = ['월','화','수','목','금','토','일'];

export const ModalWeekButton = ({ days, setDays }) => {
  const [category, setCategory] = React.useState(data);

  function test(index) {
    const weeks = [...category];
    weeks[index].checked = !weeks[index].checked;
    setCategory(weeks);
  }

  const handleClickDay = (day) => {
    setDays(days => {
      const result = [...days];
      const index = days.indexOf(day);
      if (index > -1) {
        result.splice(index, 1);
      }
      else {
        result.push(day)
      }
      return result;
    });
  }



  const width = Dimensions.get('window').width;

  return (
    <View
      style={[
        styles.Row1,
        {justifyContent: 'space-between', marginBottom: 20},
      ]}>
      {data.map((item) => <Fragment key={item}>
        <BtnSubmit
            title={item}
            style={{
              width: width / 9,
              height: width / 9,
              backgroundColor: days.indexOf(item) > -1 ? '#28B766' : '#E5E5E5',
            }}
            textStyle={{color: days.indexOf(item) > -1 ? 'white' : '#AAAAAA'}}
            onPress={() => {
              handleClickDay(item);
            }}
          />
      </Fragment>)}
    </View>
  );
};
