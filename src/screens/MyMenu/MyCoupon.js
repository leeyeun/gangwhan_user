import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView, SectionList, StatusBar } from 'react-native';

import API from '../../api';
import Loading from '../../components/Loading';
import Nodata from '../../components/Nodata';
import { AuthContext } from '../../contexts/auth-context';
import { basicErrorHandler } from '../../http-error-handler';
import { coupon_method_pipe, number_format_pipe } from '../../pipes';


const Coupon = ({coupon, navigation, intend}) => {

    const handleCouponClick = () => {
        if (intend == 'use') {
            // console.log(coupon);
            navigation.navigate('OrderDeliOnline', { coupon });
        }
        else if(intend == 'use_quick') {
            navigation.navigate('QuickDelivery', { coupon });
        }
        else {
            if (coupon.use_flag == 'N' && !!coupon.sl_sn) {
                navigation.navigate('DeliveryDetail', { sl_sn : coupon.sl_sn });
            }
        }
    }

    const title = useMemo(() => {
        return coupon.sl_title || coupon.cp_subject;
    }, [ coupon ]);

    return (
        <View style={{ marginBottom: 15 }}>
            <View style={styles.coutitle}>
                <Text style={{fontSize: 16, color: 'white'}}>{title}</Text>
            </View>
            <View style={styles.coubody1}>
                <View style={{justifyContent: 'space-evenly', height: '100%'}}>
                    <Text style={{ color: coupon.use_flag == 'N' ? '#E51A47' : '#777777', fontSize: 24, fontWeight: 'bold', }}>{number_format_pipe(coupon.cp_price)}원</Text>
                    <Text style={{ fontSize: 14, color: 'white', width: 67, height: 20, textAlign: 'center', textAlignVertical: 'center', borderRadius: 3, backgroundColor: coupon.use_flag == 'N' ? '#E51A47' : '#777777' }}>{coupon_method_pipe(coupon)}</Text>
                    <Text>최소주문금액 {number_format_pipe(coupon.cp_minimum)}원</Text>
                    <Text>{coupon.cp_start} ~ {coupon.cp_end}</Text>
                </View>

                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={handleCouponClick}>
                    <Image source={require('../../images/couline.png')}></Image>
                    <Image source={ coupon.use_flag == 'N' ?  require('../../images/couponunused.png') : require('../../images/couponused.png') } style={styles.downimg} />
                </TouchableOpacity>
            </View>     
        </View>
    );
}

export default function MyCoupon({route, navigation}) {
    const { me } = useContext(AuthContext);

    const [ globalCoupons, setGlobalCoupons ] = useState();
    const [ coupons, setCoupons ] = useState();
    useEffect(() => {
        // API.post('/coupon/get_my_coupons.php', { mb_id: '2477617829' })
        API.post('/coupon/get_my_coupons.php', { mb_id: me.mb_id })
        .then(data => {
            setGlobalCoupons(data.data.filter(item => item.sl_sn == null));
            if (route.params?.sl_sn) {
                setCoupons(data.data.filter(item => item.sl_sn == route.params.sl_sn ));
            }
            else {
                setCoupons(data.data.filter(item => item.sl_sn != null));
            }
        })
        .catch(basicErrorHandler);
    }, [ me, route ]);

    const intend = useMemo(() => {
        if (route.params?.intend == 'use') {
            return 'use';
        }
        else if (route.params?.intend == 'use_quick') {
            return 'use_quick';
        }
        else {
            return 'normal';
        }
    }, [route.params]);


    return (
        <ScrollView>
            <View style={{flex: 1, padding: 15, backgroundColor: 'white'}}>
                {globalCoupons && coupons ? <>
                    {globalCoupons.map(coupon => <Coupon key={coupon.cp_id} coupon={coupon} navigation={navigation} intend={intend} />)}
                    {intend && intend !== 'use_quick' && coupons.map(coupon => <Coupon key={coupon.cp_id} coupon={coupon} navigation={navigation} intend={intend} />)}

                    {coupons.length + globalCoupons.length == 0 && <Nodata>{intend == 'use' ? '해당 매장에서 사용가능한 쿠폰이 없습니다.' : intend == 'use_quick' ? '사용가능한 쿠폰이 없습니다.' : '쿠폰이 없습니다.'}</Nodata>}
                </> : <Loading />}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    coutitle: {
        alignSelf: 'flex-start',
        borderRadius: 20,
        backgroundColor: 'black',
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginTop: 10,
    },
    coubody: {
        height: 150,
        borderWidth: 1,
        borderColor: '#F2F2F2',
        marginTop: 10,
        alignItems: 'center',
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 5,
    },
    coubody1: {
        borderWidth: 0.5,
        height: 150,
        borderColor: '#F2F2F2',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 5,
        padding: 13,
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginTop: 10,
        marginBottom: 3,
        marginHorizontal: 2,
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    downimg: {marginLeft: 30, marginRight: 10, width: 68, height: 68},
    closebtn: {
        backgroundColor: 'black',
        height: 45,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
    },
    header: {
        fontSize: 32,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
    },
});
