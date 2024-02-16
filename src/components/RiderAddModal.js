import * as React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
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

export const RiderAddModal = props => {
  const [amPmPopUp, setAmPmPopUp] = React.useState('오전');
  const [amPmPopUp1, setAmPmPopUp1] = React.useState('오전');

  const Cancel = () => {
    props.cancel();
  };

  function Submit() {
    props.confirm();
  }
  return (
    <Modal isVisible={props.open} onBackButtonPress={() => Cancel()}>
      <MenuProvider>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: 'white',
              width: '100%',
              justifyContent: 'center',
              padding: 15,
            }}>
            <View style={[styles.Row1, {justifyContent: 'space-between'}]}>
              <Text style={styles.boldtxt18}>라이더 추가</Text>
              <TouchableOpacity
                onPress={() => {
                  Cancel();
                }}>
                <Image source={require('../images/modalcancel.png')} />
              </TouchableOpacity>
            </View>
            <Underline1 />
            <Text style={{fontSize: 16, marginBottom: 15}}>
              매장에 소속될 라이더의 코드를 입력하세요
            </Text>
            <Text style={{fontSize: 16}}>
              라이더 코드는 라이더 앱의 회원 정보에서{'\n'}
              확인 가능합니다
            </Text>
            <InputText placeholder="라이더 코드 입력" style={{marginTop: 15}} />
            <BtnSubmit title="라이더 지정 완료" style={{marginTop: 20}} />
          </View>
        </View>
      </MenuProvider>
    </Modal>
  );
};
