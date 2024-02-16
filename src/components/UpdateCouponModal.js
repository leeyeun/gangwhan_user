import * as React from 'react';
import {View, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import {BtnSubmit, InputText, TitleAndInput, Underline1} from './BOOTSTRAP';
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

const width = Dimensions.get('window').width;

export const UpdateCouponModal = props => {
  const [menuPopUp, setMenuPopUp] = React.useState('배달/포장');
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
              <Text style={styles.boldtxt18}>쿠폰 수정</Text>
              <TouchableOpacity
                onPress={() => {
                  Cancel();
                }}>
                <Image source={require('../images/modalcancel.png')} />
              </TouchableOpacity>
            </View>
            <Underline1 />

            <Text style={styles.mediumtxt16}>구분</Text>
            <MenuPopUp menuPopUp={menuPopUp} setMenuPopUp={setMenuPopUp} />
            <Text
              style={[styles.mediumtxt16, {marginBottom: 10, marginTop: 15}]}>
              최소 주문금액
            </Text>
            <InputText placeholder="최소 주문 금액 입력" input="17000" />
            <Text
              style={[styles.mediumtxt16, {marginBottom: 10, marginTop: 15}]}>
              할인 금액
            </Text>
            <InputText placeholder="할인 금액 입력" input="5000" />
            <Text style={[styles.mediumtxt16, {marginBottom: 10}]}>
              유효 기간
            </Text>
            <View>
              <InputText placeholder="시작 날짜 입력" input="2021-02-08" />
              <Text
                style={[
                  styles.mediumtxt16,
                  {position: 'absolute', right: 10, top: 15},
                ]}>
                부터
              </Text>
            </View>
            <View style={{marginTop: 5}}>
              <InputText placeholder="종료 날짜 입력" input="2021-02-28" />
              <Text
                style={[
                  styles.mediumtxt16,
                  {position: 'absolute', right: 10, top: 15},
                ]}>
                까지
              </Text>
            </View>
            <View>
              <BtnSubmit title="수정 완료" style={{marginTop: 20}} />
              <BtnSubmit
                title="삭제"
                style={{backgroundColor: '#777777', marginTop: 10}}
              />
            </View>
          </View>
        </View>
      </MenuProvider>
    </Modal>
  );
};

const MenuPopUp = props => {
  const {menuPopUp, setMenuPopUp} = props;

  return (
    <Menu>
      <MenuTrigger
        style={{
          marginTop: 10,
          borderRadius: 5,
          borderWidth: 1,
          height: 45,
          borderColor: '#CCCCCC',
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{fontSize: 16}}>{menuPopUp}</Text>
        <Image source={require('../images/orderaccodiondown.png')} />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            marginTop: 35,
            marginLeft: -17,
            width: width / 1.22,
            paddingLeft: 5,
          },
        }}>
        <MenuOption onSelect={() => setMenuPopUp(`배달/포장`)}>
          <Text style={{color: 'black', fontSize: 16}}>배달/포장</Text>
        </MenuOption>
        <MenuOption onSelect={() => setMenuPopUp(`배달`)}>
          <Text style={{color: 'black', fontSize: 16}}>배달</Text>
        </MenuOption>
        <MenuOption onSelect={() => setMenuPopUp(`포장`)}>
          <Text style={{color: 'black', fontSize: 16}}>포장</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};
