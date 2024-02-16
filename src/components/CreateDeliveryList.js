import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {navigate} from '../navigation/RootNavigation';

const defaultData = {
  datas3: [
    {
      key: '0',
      name: '강화김치찌개',
      stars: 3.0,
      img: require('./../images/listitemimg.png'),
      delPrice: '3,850',
      delTime: '13:00 ~ 20:00',
      delKm: '1.2',
      new: true,
      takeout: true,
    },
    {
      key: '1',
      name: '강화김치찌개1',
      stars: 3.5,
      img: require('./../images/listitemimg.png'),
      delPrice: '3,850',
      delTime: '14:00 ~ 20:00',
      delKm: '1.2',
      new: true,
      takeout: true,
    },
    {
      key: '2',
      name: '강화김치찌개3',
      stars: 5.0,
      img: require('./../images/listitemimg.png'),
      delPrice: '3,850',
      delTime: '15:00 ~ 20:00',
      delKm: '1.2',
      new: false,
      takeout: true,
    },
    {
      key: '3',
      name: '강화김치찌개2',
      stars: 2.5,
      img: require('./../images/listitemimg.png'),
      delPrice: '3,850',
      delTime: '10:00 ~ 20:00',
      delKm: '1.2',
      new: false,
      takeout: true,
    },
  ],
};

const RenderItem = ({item}) => {
  return (
    <View style={{paddingHorizontal: 10}}>
      <TouchableOpacity
        style={style.itemView}
        onPress={() => {
          navigate(
            'DeliveryDetail' /*{
            NAME: item.name,
            STARS: item.stars,
            DELPRICE: item.delPrice,
            DELTIME: item.delTime,
          }*/,
          );
        }}>
        <Image source={item.img} style={style.itemImg}></Image>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={style.itemName}>{item.name} </Text>
            {item.new ? (
              <View
                style={{
                  backgroundColor: '#E51A47',
                  height: 20,
                  width: 37,
                  borderRadius: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 5,
                }}>
                <Text style={{color: 'white'}}>신규</Text>
              </View>
            ) : null}
            {item.takeout ? (
              <View
                style={{
                  backgroundColor: '#28B766',
                  height: 20,
                  width: 37,
                  borderRadius: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: 'white'}}>포장</Text>
              </View>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 3,
            }}>
            <Image source={require('./../images/stars.png')} />
            <Text style={style.itemMsg}>{item.stars}</Text>
            <Text style={style.delPrice}> 배달비용 {item.delPrice}원</Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              marginVertical: 3,
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={require('./../images/time.png')} />
              <Text style={style.itemMsg}>{item.delTime}</Text>
            </View>

            <Text>{item.delKm}km</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          borderWidth: 0.7,
          borderColor: '#E5E5E5',
          marginVertical: 10,
        }}></View>
    </View>
  );
};

function CreateDeliveryList() {
  const [foodplace, setFoodPlace] = useState(defaultData.datas3);

  return (
    <View style={style.root}>
      <FlatList
        data={foodplace}
        renderItem={RenderItem}
        keyExtractor={item => item.key}></FlatList>
    </View>
  );
}
const style = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'white'},
  itemView: {
    flexDirection: 'row',
    borderBottomColor: 'grey',
    margin: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  itemImg: {
    width: 70,
    height: 70,
    resizeMode: 'cover',
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemMsg: {
    marginLeft: 5,
  },
  delPrice: {
    color: '#777777',
  },
  newtakeout: {marginRight: 5},
});

export default CreateDeliveryList;
