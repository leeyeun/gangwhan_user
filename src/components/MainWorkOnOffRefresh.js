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
  SafeAreaView,
} from 'react-native';

import {navigate} from '../navigation/RootNavigation';
import styles from '../style/Style';

// 출근 퇴근 새로고침
export const MainWorkOnOffRefresh = () => {
  return (
    <View style={styles.workonoffview}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={require('../images/mainworkon.png')} />
        <Image
          source={require('../images/mainoffworkoff.png')}
          style={{marginLeft: 5}}
        />
      </View>
      <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{fontSize: 16, marginRight: 5}}>새로고침</Text>
        <Image source={require('../images/mainrefresh.png')}></Image>
      </TouchableOpacity>
    </View>
  );
};
