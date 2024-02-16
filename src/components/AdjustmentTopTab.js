import * as React from 'react';
import {View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import {Header, Left, Right, Title} from 'native-base';

import {navigate} from '../navigation/RootNavigation';
import styles from '../style/Style';

// 주문, 배달중, 취소, 완료 상단 탭
export const AdjustmentTopTab = props => {
  const topTab = props.topTab;
  const setTopTab = props.setTopTab;
  const TabMenu = ({tapNum, title}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setTopTab(tapNum);
        }}
        style={topTab === tapNum ? styles.toptabOn : styles.toptabOff}>
        <Text
          style={
            topTab === tapNum ? styles.toptabontext : styles.toptabofftext
          }>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.toptabview}>
      <TabMenu tapNum={'1'} title={'월별 조회'} />
      <TabMenu tapNum={'2'} title={'기간 조회'} />
    </View>
  );
};
