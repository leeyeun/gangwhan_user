import {Text, TouchableOpacity, Image, View, SafeAreaView} from 'react-native';
import React from 'react';
import style from '../style/style';
import {resetRoot} from '../navigation/RootNavigation';
import Modal from 'react-native-modal';

export const BtnSubmit = props => {
  return (
    <TouchableOpacity
      style={[style.btnSubmit, style.container0]}
      onPress={() => {
        resetRoot(props.navi);
      }}>
      <Text style={[style.btnSubmitTxt]}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export const RedIconButton = props => {
  const {style = {}, textStyle = {}, onPress} = props;
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: '#E51A47',
          height: 50,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        },
        style,
      ]}
      onPress={onPress}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {props.src !== null ? (
          <Image
            source={props.src}
            color={'#000'}
            style={{
              marginRight: 5,
              width: 20,
              height: 20,
              resizeMode: 'contain',
            }}
          />
        ) : null}

        <Text
          style={[
            {color: 'white', fontWeight: 'bold', fontSize: 16},
            textStyle,
          ]}>
          {props.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export const SharedButton = props => {
  const {style = {}, textStyle = {}, onPress} = props;
  return (
    <TouchableOpacity
      style={[
        {
          height: 50,
          flex: 1,
          backgroundColor: '#777777',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 5,
        },
        style,
      ]}
      onPress={onPress}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={props.src}></Image>
        <Text
          style={[
            {color: 'white', fontSize: 16, fontWeight: 'bold'},
            textStyle,
          ]}>
          {'  '}
          {props.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export const ReceiptButton = props => {
  const {style = {}, textStyle = {}, onPress} = props;
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: '#28B766',
          height: 50,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        },
        style,
      ]}
      onPress={onPress}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={require('../images/successdown.png')}></Image>

        <Text
          style={[
            {color: 'white', fontWeight: 'bold', fontSize: 16},
            textStyle,
          ]}>
          {'  '}영수증 파일 받기
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const ModalConfirm = props => {
  const Cancel = () => {
    props.cancel();
  };

  function Submit() {
    props.confirm();
  }

  return (
    <Modal isVisible={props.open} onBackButtonPress={() => Cancel()}>
      <SafeAreaView style={{flex: 1}}>
        <TouchableOpacity
          style={{alignItems: 'flex-end'}}
          onPress={() => Cancel()}>
          <Image source={require('../images/imgmodalcancel.png')} />
        </TouchableOpacity>
        <Image
          source={require('../images/modalimg1.png')}
          style={{resizeMode: 'contain', alignSelf: 'center', flex: 1}}
        />
      </SafeAreaView>
    </Modal>
  );
};

export const Underline10 = () => {
  return <View style={{height: 10, backgroundColor: '#F5F5F5'}} />;
};

export const Underline1 = () => {
  return (
    <View style={{height: 1, backgroundColor: '#E5E5E5', marginVertical: 15}} />
  );
};

export const ModalAdult = props => {
  const Cancel = () => {
    props.cancel();
  };

  function Submit() {
    props.confirm();
  }

  return (
    <Modal isVisible={props.open} onBackButtonPress={() => Cancel()}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View
          style={{backgroundColor: 'white', alignItems: 'center', padding: 15}}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>미성년자 확인</Text>
          <Underline1 />
          <Text style={{textAlign: 'center', fontSize: 16}}>
            19세 이상 취급 가능 제품의 경우,{'\n'}본인인증이 필요합니다.{'\n'}
            회원 정보 수정으로 이동하여 본인 인증을 해주세요.
          </Text>

          <TouchableOpacity
            style={{
              height: 45,
              backgroundColor: '#E51A47',
              width: '100%',
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 30,
            }}
            onPress={() => Cancel()}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
              확인
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export const BlueBorderBtn = props => {
  const {style = {}, textStyle = {}, onPress} = props;

  return (
    <TouchableOpacity
      style={[{height: 45, width: 127, borderWidth: 1, borderRadius: 5, borderColor: '#E51A47', justifyContent: 'center', alignItems: 'center',}, style]}
      onPress={onPress}>
      <Text style={[{color: '#E51A47', fontSize: 16, fontWeight: '600',}, textStyle]}>{props.title}</Text>
    </TouchableOpacity>
  );
};