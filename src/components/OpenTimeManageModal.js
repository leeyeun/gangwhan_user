import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {BtnSubmit, InputText, Underline1} from '../components/BOOTSTRAP';
import {AmPmPopUp} from '../components/AmPmPopUp';
import {ModalWeekButton} from '../components/ModalWeekButton';
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
import { AppContext } from '../contexts/app-context';
import { StoreContext } from '../contexts/store-context';
import API from '../api';
import { basicErrorHandler } from '../http-error-handler';


const validHour = (input) => {
  if (!input || input < 0 || input > 11) return false;
  return true;
}

const validMinute = (input) => {
  if (!input || input < 0 || input > 59) return false;
  return true;
}


export const OpenTimeManageModal = ({ visible, setVisible, loadStoreTimeInfo }) => {
  const { store } = useContext(StoreContext);
  const { showSnackbar } = useContext(AppContext);

  // 영업시간 추가
  const [ days, setDays ] = useState([]);
  const [ startHour, setStartHour ] = useState('');
  const [ startMinute, setStartMinute ] = useState('');
  const [ endHour, setEndHour] = useState('');
  const [ endMinute, setEndMinute] = useState('');

  const [amPmPopUp, setAmPmPopUp] = React.useState('오전');
  const [amPmPopUp1, setAmPmPopUp1] = React.useState('오전');

  const handleAddBusinessDays = () => {
    if (days.length == 0) return showSnackbar('요일을 선택하세요.');
    
    if (!validHour(startHour)) return showSnackbar('시작시간을 잘못입력하셨습니다.');
    if (!validMinute(startMinute)) return showSnackbar('시작분을 잘못입력하셨습니다.');
    if (!validHour(endHour)) return showSnackbar('종료시간을 잘못입력하셨습니다.');
    if (!validMinute(endMinute)) return showSnackbar('종료분을 잘못입력하셨습니다.');

    const startTime = `${amPmPopUp} ${startHour}:${startMinute}`;
    const endTime = `${amPmPopUp1} ${endHour}:${endMinute}`;

    const data = {
      h_name: days.join(','),
      start_time: startTime,
      end_time: endTime,
      sl_sn: store.sl_sn,
    };
    
    API.post('/shop_worktime_update.php', data)
    .then(() => {
      showSnackbar('영업시간을 추가했습니다.');
      setVisible(false);
      loadStoreTimeInfo();
    })
    .catch(basicErrorHandler);
  }
  // end 영업시간 추가  

  
  return (
    <Modal isVisible={visible} onBackButtonPress={() => { setVisible(false) }}>
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
              <Text style={styles.boldtxt18}>영업시간 추가</Text>
              <TouchableOpacity
                onPress={() => { setVisible(false); }}>
                <Image source={require('../images/modalcancel.png')} />
              </TouchableOpacity>
            </View>
            <Underline1 />
            <ModalWeekButton days={days} setDays={setDays} />
            <View style={[styles.Row1, {marginBottom: 5}]}>
              <AmPmPopUp amPmPopUp={amPmPopUp} setAmPmPopUp={setAmPmPopUp} />
              <InputText placeholder="00" style={{flex: 1}} value={startHour} onChangeText={setStartHour} keyboardType="numeric" />
              <Text style={{flex: 0.5, fontSize: 16}}> 시</Text>
              <InputText placeholder="00" style={{flex: 1}} value={startMinute} onChangeText={setStartMinute} keyboardType="numeric" />
              <Text style={{fontSize: 16}}> 분 부터</Text>
            </View>
            <View style={styles.Row1}>
              <AmPmPopUp amPmPopUp={amPmPopUp1} setAmPmPopUp={setAmPmPopUp1} />
              <InputText placeholder="00" style={{flex: 1}} value={endHour} onChangeText={setEndHour} keyboardType="numeric" />
              <Text style={{flex: 0.5}}> 시</Text>
              <InputText placeholder="00" style={{flex: 1}} value={endMinute} onChangeText={setEndMinute} keyboardType="numeric" />
              <Text style={{fontSize: 16}}> 분 까지</Text>
            </View>
            <BtnSubmit title="추가" style={{marginTop: 20}} onPress={handleAddBusinessDays} />
          </View>
        </View>
      </MenuProvider>
    </Modal>
  );
};
