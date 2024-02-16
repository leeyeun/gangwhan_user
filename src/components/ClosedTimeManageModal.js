import React, { useContext } from 'react';
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
import API from '../api';
import { StoreContext } from '../contexts/store-context';
import { basicErrorHandler } from '../http-error-handler';
import { AppContext } from '../contexts/app-context';



const days = [
  { key: '월', name: '월요일'},
  { key: '화', name: '화요일'},
  { key: '수', name: '수요일'},
  { key: '목', name: '목요일'},
  { key: '금', name: '금요일'},
  { key: '토', name: '토요일'},
  { key: '일', name: '일요일'},
];

const width = Dimensions.get('window').width;

export const ClosedTimeManageModal = ({ visible, setVisible, loadStoreTimeInfo }) => {
  const { store } = useContext(StoreContext);
  const { showSnackbar } = useContext(AppContext);

  const submit = () => {
    const data = {
      week_name: weekPopUp,
      yoil: day.name,
      sl_sn: store.sl_sn,
    };
    API.post('/shop_rh_update.php', data)
    .then(() => {
      showSnackbar('정기휴일을 추가했습니다.');
      setVisible(false);
      loadStoreTimeInfo();
    })
    .catch(basicErrorHandler);
  }

  const cancel = () => {
    setVisible(false);
  };

  const [weekPopUp, setWeekPopUp] = React.useState('매월 첫째');
  const [day, setDay] = React.useState(days[6]);

  return (
    <Modal isVisible={visible} onBackButtonPress={cancel}>
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
              <Text style={styles.boldtxt18}>정기 휴일 설정</Text>
              <TouchableOpacity
                onPress={cancel}>
                <Image source={require('../images/modalcancel.png')} />
              </TouchableOpacity>
            </View>
            
            <Underline1 />
            
            <View style={styles.Row1}>
              <WeekPopUp weekPopUp={weekPopUp} setWeekPopUp={setWeekPopUp} />
              
              <Menu style={{flex: 1}}>
                <MenuTrigger
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    height: 45,
                    borderColor: '#CCCCCC',
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 16}}>{day.name}</Text>
                  <Image source={require('../images/orderaccodiondown.png')} />
                </MenuTrigger>

                <MenuOptions
                  customStyles={{
                    optionsContainer: {
                      marginTop: 25,
                      marginLeft: -16,
                      width: width / 2.45,
                      paddingLeft: 5,
                    },
                  }}>
                  {days.map(item => <React.Fragment key={item.key}>
                    <MenuOption onSelect={() => setDay(item)}>
                      <Text style={{color: 'black', fontSize: 16}}>{item.name}</Text>
                    </MenuOption>
                  </React.Fragment>)}
                </MenuOptions>
              </Menu>
            </View>

            <BtnSubmit title="설정 완료" style={{marginTop: 20}} onPress={submit} />
          </View>
        </View>
      </MenuProvider>
    </Modal>
  );
};

const WeekPopUp = props => {
  const {weekPopUp, setWeekPopUp} = props;
  return (
    <Menu style={{flex: 1}}>
      <MenuTrigger
        style={{
          marginRight: 5,
          borderRadius: 5,
          borderWidth: 1,
          height: 45,
          borderColor: '#CCCCCC',
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{fontSize: 16}}>{weekPopUp}</Text>
        <Image source={require('../images/orderaccodiondown.png')} />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            marginTop: 25,
            marginLeft: -19,
            width: width / 2.55,
            paddingLeft: 5,
          },
        }}>
        <MenuOption onSelect={() => setWeekPopUp(`매월 첫째`)}>
          <Text style={{color: 'black', fontSize: 16}}>매월 첫째</Text>
        </MenuOption>
        <MenuOption onSelect={() => setWeekPopUp(`매월 둘째`)}>
          <Text style={{color: 'black', fontSize: 16}}>매월 둘째</Text>
        </MenuOption>
        <MenuOption onSelect={() => setWeekPopUp(`매월 셋째`)}>
          <Text style={{color: 'black', fontSize: 16}}>매월 셋째</Text>
        </MenuOption>
        <MenuOption onSelect={() => setWeekPopUp(`매월 넷째`)}>
          <Text style={{color: 'black', fontSize: 16}}>매월 넷째</Text>
        </MenuOption>
        <MenuOption onSelect={() => setWeekPopUp(`매월 다섯째`)}>
          <Text style={{color: 'black', fontSize: 16}}>매월 다섯째</Text>
        </MenuOption>
        <MenuOption onSelect={() => setWeekPopUp(`매월 다섯째`)}>
          <Text style={{color: 'black', fontSize: 16}}>매월 마지막</Text>
        </MenuOption>
        <MenuOption onSelect={() => setWeekPopUp(`매월 다섯째`)}>
          <Text style={{color: 'black', fontSize: 16}}>매주</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};
