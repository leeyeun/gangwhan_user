import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import {Text,Image,View,StyleSheet,ScrollView,TouchableOpacity,FlatList,Dimensions, useWindowDimensions } from 'react-native';

import style from '../../style/style';
import {navigate} from '../../navigation/RootNavigation';
import { AuthContext } from '../../contexts/auth-context';
import { AppContext } from '../../contexts/app-context';
import { MemoryContext } from '../../contexts/memory-context';
import API from '../../api';
import Button from '../../components/Button';
import Stars from '../../components/Stars';
import Loading from '../../components/Loading';
import Nodata from '../../components/Nodata';
import globals from '../../globals';
import colors from '../../appcolors';
import cstyles from '../../cstyles';
import {} from '../../pipes';
import { basicErrorHandler } from '../../http-error-handler';


const width = Dimensions.get('window').width;

export default function MyReview({navigation}) {
    const { me } = useContext(AuthContext);

    const [ reviews, setReviews ] = useState();
    
    useEffect(() => {
        if (me) {
            const params = { mb_id: me.mb_id };
            API.get('/review/get_my_reviews.php', { params })
            .then(data => {
                setReviews(data.data);
            })
            .catch(basicErrorHandler);
        }
    }, [ me ]);

    const dimenstions = useWindowDimensions();
    const imageWidth = useMemo(() => {
        return (dimenstions.width - 45) / 3
    }, [ dimenstions ]);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {reviews ? <>
                {reviews.map(review => <Fragment key={review.is_id}>
                    <View>
                        <View style={{padding: 15, backgroundColor: 'white'}}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                <View>
                                    <Text style={{color: '#777777'}}>{review.is_time}</Text>
                                    <Text style={[styles.title, {marginRight: 10}]}>{review.sl_title}</Text>
                                </View>
                                <TouchableOpacity style={{ height: 30, width: 88, justifyContent: 'center', alignItems: 'center', borderRadius: 5, borderColor: '#E51A47', borderWidth: 1, }} onPress={() => { navigate('DeliveryDetail', { sl_sn: review.sl_sn }); }}>
                                    <Text style={{fontSize: 16, fontWeight: '600', color: '#E51A47'}}>매장가기</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{alignItems: 'center', flexDirection: 'row'}}>
                                <Stars stars={review.is_score} />
                            </View>
                            <View>
                                <Text style={[styles.text2, {marginVertical: 10}]}>{review.is_content}</Text>
                            </View>
                            
                            <View style={{ flexDirection: 'row', marginRight: -15 }}>
                                {review.files.map(file => <Image key={file.id} source={{ uri: file.download_url }} style={{ width: imageWidth, height: imageWidth, marginRight: 5 }} />)}
                            </View>

                            {!!review.is_re && (
                            <View style={{ padding: 15, flexDirection: 'row', backgroundColor: '#F9F9F9', borderColor: '#E5E5E5', borderWidth: 1, borderRadius: 5, marginTop: 10, }}>
                                <Image source={require('../../images/adminreviewicon.png')} style={{ width: 31, height: 30 }}></Image>
                                <View style={{marginLeft: 15}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={[styles.title, {marginRight: 10}]}>{'store-name'}</Text>
                                        <Text style={{color: '#777777'}}>{review.is_re_date}</Text>
                                    </View>
                                    <Text style={style.text2}>{review.is_re}</Text>
                                </View>
                            </View>
                            )}
                        </View>
                        <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>
                    </View>
                </Fragment>)}

                {reviews.length == 0 && <Nodata style={{ marginLeft: 15 }}>작성한 리뷰가 없습니다.</Nodata>}
            </> : <Loading />}
        </View>
    );
}



const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'white'},
  searchBox: {
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 15,
  },
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
    marginRight: 5,
  },
  itemMsg: {
    marginLeft: 5,
  },
  delPrice: {
    color: '#777777',
  },
  newtakeout: {marginRight: 5},
  title: {marginBottom: 10, fontSize: 16, fontWeight: 'bold'},
  contents: {marginRight: 20, marginBottom: 10, fontSize: 16},
  img: {resizeMode: 'cover', marginRight: 10, marginBottom: 10},
});
