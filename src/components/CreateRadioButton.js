import * as React from 'react';
import {View, Text} from 'react-native';
import {RadioButton} from 'react-native-paper';

import styles from '../style/Style';

export default function CreateRadioButton() {
  //   const {checked, setChecked, style = {}} = props;
  const [checked, setChecked] = React.useState('first');

  return (
    <View style={styles.Row1}>
      <RadioButton.Android
        value="first"
        color="#28B766"
        status={checked === 'first' ? 'checked' : 'unchecked'}
        onPress={() => setChecked('first')}
      />
      <Text>단일 선택</Text>
      <RadioButton.Android
        value="second"
        color="#28B766"
        status={checked === 'second' ? 'checked' : 'unchecked'}
        onPress={() => setChecked('second')}
      />
      <Text>여러개 선택</Text>
    </View>
  );
}
