import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import {View, Text, Image, TouchableOpacity, Dimensions, TextInput, ScrollView} from 'react-native';
import DatePicker from 'react-native-date-picker'
import moment from 'moment';
import {
  BtnSubmit,
  InputText,
  TitleAndInput,
  Underline1,
} from '../components/BOOTSTRAP';
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
import { Formik } from 'formik';
import * as Yup from 'yup';

import { StoreContext } from '../contexts/store-context';
import Button from '../components/Button';
import API from '../api';
import { basicErrorHandler } from '../http-error-handler';
import cstyles from '../cstyles';
import AppModal from './AppModal';
import { AppContext } from '../contexts/app-context';


const couponMethods = [
  {key: '0', name:'배달/포장'},
  {key: '1', name:'배달'},
  {key: '2', name:'포장'},
];

const validationSchema = Yup.object().shape({
  cp_method2: Yup.object().required('필수입력입니다.'),
  cz_subject: Yup.string().required('필수입력입니다.'),
  cz_period: Yup.number().required('필수입력입니다.'),
  cp_price: Yup.number().required('필수입력입니다.'),
  cp_minimum: Yup.number(),
});

export const AddCouponModal = ({ visible, setVisible, fetchCoupons, coupon }) => {
  const { store } = useContext(StoreContext);
  const { showSnackbar } = useContext(AppContext);

  const Cancel = () => {
    setVisible(false);
  };

  function handleSubmit(values, actions) {
    const data = {
      ...values,
      cz_type: '0',   // 고정
      cp_method: '2', // 고정
      cp_trunc: '0',  // 고정
      sl_sn: store.sl_sn,
      cz_dp_flag: 'Y',
      cp_method2: values.cp_method2.key,
      cz_start: moment(values.cz_start).format('YYYY-MM-DD'),
      cz_end: moment(values.cz_end).format('YYYY-MM-DD'),
    };

    if (coupon) {
      data['w'] = 'u';
      data['cz_id'] = coupon.cz_id;
    }

    API.post('/couponzoneformupdate.php', data)
    .then(() => {
      setVisible(false);
      fetchCoupons();
    })
    .catch(basicErrorHandler)
    .finally(() => { actions.setSubmitting(false); });
  }

  const handleRemove = () => {
    const data = {
      ...coupon,
      w: 'u',
      cz_dp_flag: 'N',
    };
    API.post('/couponzoneformupdate.php', data)
    .then(() => {
      showSnackbar('삭제했습니다.');
      setVisible(false);
      fetchCoupons();
    })
    .catch(basicErrorHandler);
  }

  const [ startDateModalOpen, setStartDateModalOpen ] = useState(false);
  const [ endDateModalOpen, setEndDateModalOpen ] = useState(false);

  const minimumPriceRef = useRef();
  const discountPriceRef = useRef();

  return (
    <Modal isVisible={visible}>
      <MenuProvider>
        <Formik
            initialValues={{ 
              cp_method2: coupon ? couponMethods.find(item => item.key == coupon.cp_method2) : couponMethods[0],
              cz_subject: coupon ? coupon.cz_subject : '',
              cz_start: coupon ? moment(coupon.cz_start).toDate() : new Date(),
              cz_end: coupon ? moment(coupon.cz_end).toDate() : new Date(),
              cz_period: coupon ? coupon.cz_period : '',
              cp_price: coupon ? coupon.cp_price : '',
              cp_minimum: coupon ? coupon.cp_minimum : '',
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
          {({handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, dirty, touched, errors, isValid, values, isSubmitting }) => <>
            <ScrollView>
              <View style={{ backgroundColor: 'white', width: '100%', justifyContent: 'center', padding: 15 }}>
                <View style={[styles.Row1, {justifyContent: 'space-between'}]}>
                  <Text style={styles.boldtxt18}>{coupon ? '쿠폰 수정' : '쿠폰 추가'}</Text>
                  <TouchableOpacity
                    onPress={() => { Cancel(); }}>
                    <Image source={require('../images/modalcancel.png')} />
                  </TouchableOpacity>
                </View>
                <Underline1 />

                <Text style={styles.mediumtxt16}>구분</Text>
                <MenuPopUp menuPopUp={values.cp_method2} setMenuPopUp={value => { setFieldValue('cp_method2', value ); }} />

                <Text style={[styles.mediumtxt16, {marginVertical: 10}]}>타이틀</Text>
                <TextInput
                  style={{ ...cstyles.input }}
                  placeholder={'타이틀'}
                  returnKeyType="next"
                  onSubmitEditing={() => { minimumPriceRef.current.focus(); }}
                  onChangeText={handleChange('cz_subject')}
                  onBlur={handleBlur('cz_subject')}
                  value={values.cz_subject}
                />
                <Text style={{ color: 'red' }}>{touched.cz_subject && errors.cz_subject || ' '}</Text>
                
                <Text style={[styles.mediumtxt16, {marginVertical: 10}]}>최소 주문 금액</Text>
                <TextInput
                  ref={minimumPriceRef}
                  style={{ ...cstyles.input }}
                  placeholder={'최소 주문 금액 입력'}
                  keyboardType="numeric"
                  returnKeyType="next"
                  onSubmitEditing={() => { discountPriceRef.current.focus(); }}
                  onChangeText={handleChange('cp_minimum')}
                  onBlur={handleBlur('cp_minimum')}
                  value={values.cp_minimum}
                />
                <Text style={{ color: 'red' }}>{touched.cp_minimum && errors.cp_minimum || ' '}</Text>

                <Text style={[styles.mediumtxt16, {marginBottom: 10}]}>할인 금액</Text>
                <TextInput
                  ref={discountPriceRef}
                  style={{ ...cstyles.input }}
                  placeholder={'할인 금액'}
                  keyboardType="numeric"
                  onChangeText={handleChange('cp_price')}
                  onBlur={handleBlur('cp_price')}
                  value={values.cp_price}
                />
                <Text style={{ color: 'red' }}>{touched.cp_price && errors.cp_price || ' '}</Text>

                <Text style={[styles.mediumtxt16, {marginBottom: 10}]}>유효 기간</Text>
                <TouchableOpacity onPress={() => { setStartDateModalOpen(true); }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', ...cstyles.input }}>
                    <Text style={{ ...styles.mediumgreytxt16 }}>{'시작날짜: '}{`${values.cz_start.getFullYear()}년 ${values.cz_start.getMonth() + 1}월 ${values.cz_start.getDate()}일`}</Text>
                    <Text style={[ styles.mediumtxt16, {position: 'absolute', right: 10} ]}>부터</Text>
                  </View>
                </TouchableOpacity>
                <AppModal visible={startDateModalOpen} setVisible={setStartDateModalOpen}>
                  <DatePicker
                    mode={'date'}
                    date={values.cz_start}
                    onDateChange={date => {
                      setFieldValue('cz_start', date);
                    }}
                  />
                </AppModal>
                
                <View style={{ marginTop: 5 }}>
                  <TouchableOpacity onPress={() => { setEndDateModalOpen(true); }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', ...cstyles.input }}>
                      <Text style={{ ...styles.mediumgreytxt16 }}>{'종료날짜: '}{`${values.cz_end.getFullYear()}년 ${values.cz_end.getMonth() + 1}월 ${values.cz_end.getDate()}일`}</Text>
                      <Text style={[ styles.mediumtxt16, {position: 'absolute', right: 10} ]}>까지</Text>
                    </View>
                  </TouchableOpacity>
                  <AppModal visible={endDateModalOpen} setVisible={setEndDateModalOpen}>
                    <DatePicker
                      mode={'date'}
                      date={values.cz_end}
                      onDateChange={date => {
                        setFieldValue('cz_end', date);
                      }}
                    />
                  </AppModal>
                </View>

                <Text style={[styles.mediumtxt16, {marginVertical: 10}]}>받은후 사용기일</Text>
                <TextInput
                  style={{ ...cstyles.input }}
                  placeholder={'받은 후 사용기일'}
                  keyboardType="numeric"
                  onChangeText={handleChange('cz_period')}
                  onBlur={handleBlur('cz_period')}
                  value={values.cz_period}
                />
                <Text style={{ color: 'red' }}>{touched.cz_period && errors.cz_period || ' '}</Text>

                <View style={{ marginTop: 10 }}><Button disabled={!dirty || !isValid || isSubmitting} loading={isSubmitting} onPress={handleSubmit}>{coupon ? '수정 완료' : '등록 완료'}</Button></View>
                {coupon && <View style={{ marginTop: 10 }}><Button style={{ backgroundColor: '#777777'}} onPress={handleRemove}>삭제</Button></View>}
              </View>
            </ScrollView>
          </>}
        </Formik>
      </MenuProvider>
    </Modal>
  );
};

const width = Dimensions.get('window').width;

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
        <Text style={{fontSize: 16}}>{menuPopUp.name}</Text>
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
        {couponMethods.map(method => <MenuOption key={method.key} onSelect={() => setMenuPopUp(method)}>
          <Text style={{color: 'black', fontSize: 16}}>{method.name}</Text>
        </MenuOption>)}
      </MenuOptions>
    </Menu>
  );
};
