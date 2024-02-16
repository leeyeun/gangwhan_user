import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Text, Image, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { AuthContext } from '../../contexts/auth-context';
import { AppContext } from '../../contexts/app-context';
import API from '../../api';
import Loading from '../../components/Loading';
import Nodata from '../../components/Nodata';
import {store_worktime_timeonly_pipe, store_distance_pipe, http_url_pipe } from '../../pipes';
import { basicErrorHandler } from '../../http-error-handler';


export default function MyHeartList({navigation}) {
    const { me } = useContext(AuthContext);
    const { getMyLocation } = useContext(AppContext); 

    const [ stores, setStroes ] = useState();

    useEffect(() => {
        if (me) {
            getMyLocation()
            .then(position => {
                const params = {
                    mb_id: me.mb_id,
                    lat: position?.latitude,
                    lon: position?.longitude,
                }
                return API.get('/store/get_my_favorites.php', { params })
            })
            .then((data) => {
                setStroes(data.data);
            })
            .catch(basicErrorHandler);
        }
    }, [ me ]);

    const handleStorePress = (store) => {
        navigation.navigate('DeliveryDetail', { sl_sn: store.sl_sn });
    }

    return (
        <>
            {stores ? <>
                {stores.map(store => <Fragment key={store.wi_id}>
                    <TouchableWithoutFeedback onPress={() => { handleStorePress(store); }}>
                        <View style={{paddingHorizontal: 10}}>
                            <View style={styles.itemView}>
                                <Image source={{ uri: http_url_pipe(store.pic1 || store.pic2 || store.pic3 || store.pic4) }} style={styles.itemImg} />
                                <View style={{flex: 1}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.itemName}>{store.sl_title}</Text>
                                        </View>
                                        <Image source={require('../../images/myheartlisticon.png')} style={{resizeMode: 'contain', width: 21, height: 21 }}></Image>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3, }}>
                                        <Image source={require('../../images/starFilled.png')} style={{ width: 14, height: 14 }} />
                                        <Text style={styles.itemMsg}>{store.review_avg > 0 ? store.review_avg : '-'}</Text>
                                    </View>
                                    <View style={{ width: '100%', flexDirection: 'row', marginVertical: 3, justifyContent: 'space-between', }}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Image source={require('../../images/time.png')} style={{ width: 14, height: 14}} />
                                            <Text style={styles.itemMsg}>{store_worktime_timeonly_pipe(store)}</Text>
                                        </View>
                                        <Text>{store_distance_pipe(store)}</Text>
                                    </View>
                                </View>
                            </View>
                            
                            <View style={{ borderWidth: 0.7, borderColor: '#E5E5E5', marginVertical: 10, }}></View>
                        </View>
                    </TouchableWithoutFeedback>
                </Fragment>)}
                
                {stores.length == 0 && <Nodata style={{ marginLeft: 15 }}>찜한 매장이 없습니다.</Nodata>}
            </> : <Loading />}
        </>
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
        shadowOpacity: 0.2,
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
    newtakeout: {marginRight: 5, width: 37, height: 20},
});
