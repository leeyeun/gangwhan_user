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
  Dimensions,
} from 'react-native';
import {
  BtnSubmit,
  FooterBtn,
  IconBtn,
  InputText,
  TitleAndInput,
  Underline1,
  Underline10,
  RowTwoText,
  BtnSubmitIcon,
  BtnSubmitIcon1,
  BlueBorderBtn,
} from '../components/BOOTSTRAP';
import {OpenTimeManageModal} from '../components/OpenTimeManageModal';
import {ModalWeekButton} from '../components/ModalWeekButton';
import {Checkbox} from 'react-native-paper';
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
} from 'react-native-calendars';

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

export const AmPmPopUp = props => {
  const {amPmPopUp, setAmPmPopUp} = props;

  return (
    <Menu>
      <MenuTrigger
        style={{
          marginRight: 5,
          borderRadius: 5,
          borderWidth: 1,
          height: 45,
          width: 80,
          borderColor: '#CCCCCC',
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{fontSize: 16}}>{amPmPopUp}</Text>
        <Image source={require('../images/orderaccodiondown.png')} />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            ...Platform.select({
              ios: {
                marginLeft: -18,
                width: width / 5,
                marginTop: -46,
              },
              android: {
                width: width / 5.5,
                marginLeft: -20,
                marginTop: -11,
              },
            }),
            marginTop: 25,
            paddingLeft: 5,
          },
        }}>
        <MenuOption onSelect={() => setAmPmPopUp(`오전`)}>
          <Text style={{color: 'black', fontSize: 16}}>오전</Text>
        </MenuOption>
        <MenuOption onSelect={() => setAmPmPopUp(`오후`)}>
          <Text style={{color: 'black', fontSize: 16}}>오후</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};
