import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';

import style from '../style/style';

export default function OrderDeliOffline() {
  const [orderModal, setOrderModal] = React.useState(false);

  const toggleOrderModal = () => {
    setOrderModal(!orderModal);
  };
  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={[{justifyContent: 'space-between'}]}>
        <View style={{padding: 15, backgroundColor: 'white'}}>
          <Text style={styles.subtitle}>주소</Text>
          <Text>인천 강화군 강화읍 갑룡길 3</Text>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 8,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16, color: '#777777'}}>[지번 주소] </Text>
            <Text style={{fontSize: 16, color: '#777777'}}>
              인천광역시 강화군 강화읍 관청리 89-1
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={require('../images/warning.png')}></Image>
            <Text style={{color: '#E51A47'}}> 주소가 맞는지 확인해주세요</Text>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: '#E5E5E5',
              marginVertical: 20,
            }}></View>
          <Text style={styles.subtitle}>연락처</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16}}>010-1234-5678</Text>
            <TouchableOpacity
              style={{
                height: 30,
                width: 70,
                borderWidth: 1,
                borderColor: '#E51A47',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}>
              <Text style={{fontSize: 16, color: '#E51A47'}}>변경</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={require('../images/warning.png')}></Image>
            <Text style={{color: '#E51A47', marginVertical: 8}}>
              {' '}
              연락처가 맞는지 확인해주세요
            </Text>
          </View>
        </View>

        <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>
        <View
          style={{
            paddingHorizontal: 15,
            paddingTop: 15,
            backgroundColor: 'white',
          }}>
          <View style={{}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>요청사항</Text>
          </View>
          <View style={{marginVertical: 10}}>
            <Text style={styles.subcontents}>매장 사장님에게</Text>
            <TextInput
              style={{
                height: 45,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: '#CCCCCC',
                marginVertical: 10,
              }}></TextInput>
            <Text style={styles.subcontents}>라이더님에게</Text>
            <TextInput
              style={{
                height: 45,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: '#CCCCCC',
                marginVertical: 10,
              }}></TextInput>
          </View>
        </View>
        <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>

        <View style={{padding: 15, backgroundColor: 'white'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text style={style.text2}>쿠폰</Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <Text style={style.text2}>2개 보유</Text>
              <Image source={require('../images/rightbtn.png')}></Image>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text style={style.text2}>엘포인트</Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <Text style={style.text2}>1,000P 사용</Text>
              <Image source={require('../images/rightbtn.png')}></Image>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={style.text2}>OK캐쉬백</Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <Image source={require('../images/rightbtn.png')}></Image>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: '#E5E5E5',
              marginVertical: 20,
            }}></View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <Text style={style.text2}>배 달 팁</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <Text style={style.text2}>1,000원</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <Text style={style.text2}>주문금액</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <Text style={style.text2}>1,000원</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text style={style.text2}>할인금액</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <Text style={style.text2}>1,000원</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <SafeAreaView
        style={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: 'white',
        }}>
        <View style={styles.footer}>
          <View style={styles.footer1}>
            <Text style={{fontSize: 18}}>결제금액</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>9,000</Text>
              <Text style={{fontSize: 20}}> 원</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.fotterbtn} onPress={toggleOrderModal}>
            <Text style={[style.text2, {color: 'white', fontWeight: 'bold'}]}>
              결제하기
            </Text>
            <Modal isVisible={orderModal} onRequestClose={toggleOrderModal}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    width: '100%',
                    padding: 20,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../images/warningcircle.png')}></Image>
                  <Text
                    style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>
                    주문이 정상적으로 완료되지 않았습니다.
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      marginTop: 25,
                    }}>
                    <TouchableOpacity
                      style={styles.modalCancel}
                      onPress={toggleOrderModal}>
                      <Text style={styles.modalBtnFont}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalOk}>
                      <Text style={styles.modalBtnFont}>확인</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 20},
  footer: {
    justifyContent: 'flex-end',
    backgroundColor: 'white',
  },
  footer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5E5',
    marginBottom: 10,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  fotterbtn: {
    backgroundColor: '#E51A47',
    height: 50,
    borderRadius: 6,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusminus: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderColor: '#E5E5E5',
    borderWidth: 0.5,
    height: 45,
    width: 133,
    alignItems: 'center',
    borderRadius: 5,
  },
  addcart: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    backgroundColor: '#FEEDEC',
    borderRadius: 5,
  },
  subcontents: {color: '#777777', fontSize: 16},
  modalCancel: {
    backgroundColor: '#777777',
    width: '50%',
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderRadius: 5,
  },
  modalOk: {
    backgroundColor: '#E51A47',
    width: '50%',
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderRadius: 5,
  },
  modalBtnFont: {color: 'white', fontSize: 16, fontWeight: 'bold'},
});
