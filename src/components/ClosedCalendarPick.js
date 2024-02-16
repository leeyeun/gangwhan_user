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

export const ClosedCalendarPick = ({ visible, setVisible, restDate, confirm }) => {
  const [weekPopUp, setWeekPopUp] = React.useState('매월 첫째');
  const [weekPopUp1, setWeekPopUp1] = React.useState('월요일');

  const Cancel = () => {
    setVisible(false)
  };

  
  return (
    <Modal isVisible={visible} onBackButtonPress={() => Cancel()}>
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
              <Text style={styles.boldtxt18}>휴무일 설정</Text>
              <TouchableOpacity
                onPress={() => {
                  Cancel();
                }}>
                <Image source={require('../images/modalcancel.png')} />
              </TouchableOpacity>
            </View>
            <Underline1 />
            <View>
              <Text
                style={[
                  styles.mediumtxt18,
                  {color: '#28B766', marginBottom: 15},
                ]}>
                {restDate?.current?.toString()}
              </Text>
              <Text style={{fontSize: 16}}>
                선택하신 날을 휴무일로 등록하시겠습니까?{'\n'}
                (지정하신 휴무일에는 상품 판매가 불가합니다)
              </Text>
            </View>
            <BtnSubmit
              title="등록 완료"
              style={{marginTop: 20}}
              onPress={confirm}
            />
          </View>
        </View>
      </MenuProvider>
    </Modal>
  );
};
