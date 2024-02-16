import React, {useState, useEffect} from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
// import CreateModal from '../components/CreateModal';

export default function DeliveryDetailResInfo() {
  const [imgData, setImgData] = useState(imgDatas);
  //   const [modalVisible, setModalVisible] = useState(false);

  //   const onStart = () => {
  //     setModalVisible(!modalVisible);
  //   };
  return (
    <View style={{backgroundColor: 'white'}}>
      <View style={{backgroundColor: 'white'}}>
        <View
          style={{
            height: 50,
            justifyContent: 'center',
            backgroundColor: '#F9F9F9',
            borderBottomColor: '#E5E5E5',
            borderBottomWidth: 0.5,
            width: '100%',
            paddingHorizontal: 15,
          }}>
          <Text style={{fontSize: 18}}>가게소개</Text>
        </View>
        <View
          style={{
            marginTop: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FlatList
            data={imgData}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => (
              <View>
                <TouchableOpacity onPress={onStart}>
                  <Image
                    id={index}
                    source={item.img}
                    style={[
                      styles.img,
                      {width: windowWidth / 2.22, height: windowWidth / 2.22},
                    ]}></Image>
                  {/* 이미지 모달 위치 */}

                  {/* <CreateModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    body={<Image source={item.img}></Image>}
                  /> */}
                </TouchableOpacity>
              </View>
            )}
            numColumns={2}></FlatList>
        </View>
        <View style={{padding: 15}}>
          <Text style={{fontSize: 16}}>
            오늘도 저희 이차돌창원중동점 차돌박이 전문점을 찾아주신 고객님께
            감사드립니다.{'\n'}배달 영업시간 10:00~24:00입니다.{'\n'}
            이차돌창원중동점은 2년의 시간동안 고객과의 소통으로 만들어진
            가게입니다.
          </Text>
        </View>
        <View style={{width: '100%', paddingHorizontal: 15}}>
          <Image
            source={require('../images/map.png')}
            style={{resizeMode: 'contain', width: '100%'}}></Image>
        </View>
        <View>
          <View
            style={{
              height: 50,
              justifyContent: 'center',
              backgroundColor: '#F9F9F9',
              borderBottomColor: '#E5E5E5',
              borderBottomWidth: 0.5,
              width: '100%',
              paddingHorizontal: 15,
            }}>
            <Text style={{fontSize: 18}}>영업정보</Text>
          </View>
          <View>
            <View
              style={{
                padding: 15,
                backgroundColor: 'white',
                flexDirection: 'row',
              }}>
              <View style={{marginRight: 15}}>
                <Text style={styles.title}>운영시간</Text>
                <Text style={styles.title}>휴무일</Text>
                <Text style={styles.title}>전화번호</Text>
                <Text style={styles.title}>편의시설</Text>
              </View>
              <View style={{marginRight: 15}}>
                <Text style={styles.contents}>
                  매일 - 오전 10:00 ~ 오후 12:00
                </Text>
                <Text style={styles.contents}>매주 월요일</Text>
                <Text style={styles.contents}>070-1234-5678</Text>
                <Text style={styles.contents}>
                  주차, 단체석, 유아용 의자, 무선인터넷
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View>
          <View
            style={{
              height: 50,
              justifyContent: 'center',
              backgroundColor: '#F9F9F9',
              borderBottomColor: '#E5E5E5',
              borderBottomWidth: 0.5,
              width: '100%',
              paddingHorizontal: 15,
            }}>
            <Text style={{fontSize: 18}}>안내 및 혜택</Text>
          </View>
          <View>
            <View
              style={{
                padding: 15,
                backgroundColor: 'white',
                flexDirection: 'row',
              }}>
              <View style={{}}>
                <Text style={styles.contents}>
                  리뷰 이벤트 진행중이니 리뷰에서 확인 부탁드려요{'\n'}
                  {'\n'}소비자가 뽑은 한국의 영향력 있는 브랜드 대상{'\n'}
                  {'\n'}이차돌 특성상 상추 깻잎 등 쌈을 제공하지 않으니,{'\n'}
                  다양한 사이드 메뉴와 함께 곁들여 드시길 권장하오며,{'\n'}
                  손님들께 양해 말씀을 드립니다. 감사합니다.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
