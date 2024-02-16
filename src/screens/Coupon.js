import React, { useState, useContext, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, StatusBar } from 'react-native';

import style from '../style/style';
import { AuthContext } from '../contexts/auth-context';
import { AppContext } from '../contexts/app-context';
import API from '../api';
import Loading from '../components/Loading';
import Nodata from '../components/Nodata';
import { number_format_pipe, coupon_method_pipe } from '../pipes';
import { basicErrorHandler } from '../http-error-handler';
import colors from '../appcolors';



const Coupon = ({coupon, handleDownload}) => {
    return (
        <View style={styles.coubody1}>
            <View style={{justifyContent: 'space-evenly', height: '100%'}}>
                <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: 'bold' }}>{coupon.cp_subject}</Text>
                <Text style={{ color: !coupon.mc_id ? '#E51A47' : '#777777', fontSize: 22, fontWeight: 'bold' }}>{number_format_pipe(coupon.cp_price)}원</Text>
                <Text style={{ fontSize: 14, color: 'white', width: 67, height: 20, textAlign: 'center', textAlignVertical: 'center', borderRadius: 3, backgroundColor: !coupon.mc_id ? '#E51A47' : '#777777' }}>{coupon_method_pipe(coupon)}</Text>
                <Text>최소주문금액 {number_format_pipe(coupon.cp_minimum)}원</Text>
                <Text>{coupon.cp_start} ~ {coupon.cp_end}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={require('../images/couline.png')}></Image>
                {!coupon.mc_id ? <>
                    <TouchableOpacity onPress={() => { handleDownload(coupon); }}>
                        <Image source={require('../images/coudownload.png')} style={styles.downimg}></Image>
                    </TouchableOpacity>
                </> : <>
                    <Image source={require('../images/coudownfalse.png')} style={styles.downimg}></Image>
                </>}
            </View>
        </View>
    );
}



export default function CouponScreen({navigation, route}) {
    const { me } = useContext(AuthContext);
    const { showSnackbar } = useContext(AppContext);

    // 매장 쿠폰
    const [ globalCoupons, setGlobalCoupons ] = useState();
    const [ coupons, setCoupons ] = useState();
    useEffect(() => {
        if (me) fetchCoupons();
    }, [ route.params, me ]);

    const fetchCoupons = () => {
        const sl_sn = route.params.store.sl_sn;

        const params = { sl_sn, mb_id: me.mb_id };

        API.get('/coupon/get_available_coupons.php', { params })
        .then(data => {
            setGlobalCoupons(data.data.filter(item => item.sl_sn == null));
            setCoupons(data.data.filter(item => item.sl_sn != null));
        })
        .catch(basicErrorHandler);
    }
    // end: 매장 쿠폰

    const storeName = useMemo(() => {
        return route.params.store.sl_title;
    }, [ route.params ]);

    const handleDownload = (coupon) => {
        const data = {
            cp_id: coupon.cp_id,
            mb_id: me.mb_id,
        };
        
        API.post('/coupon/download_coupon.php', data)
        .then(() => { 
            showSnackbar('다운로드했습니다.');
            fetchCoupons();
        })
        .catch(basicErrorHandler);
    }

    return (
        <>{me &&
            <ScrollView>
                <View style={{ flex: 1, paddingHorizontal: 15, paddingBottom: 15, backgroundColor: 'white' }}>
                    {coupons && globalCoupons ? <>
                        {globalCoupons.length > 0 && <View style={styles.coutitle}>
                            <Text style={{fontSize: 16, color: 'white'}}>강화N 쿠폰</Text>
                        </View>}
                        {globalCoupons.map(coupon => <Coupon key={coupon.cp_id} coupon={coupon} handleDownload={handleDownload} />)}

                        {coupons.length > 0 && <View style={styles.coutitle}>
                            <Text style={{fontSize: 16, color: 'white'}}>{storeName}</Text>
                        </View>}
                        {coupons.map(coupon => <Coupon key={coupon.cp_id} coupon={coupon} handleDownload={handleDownload} />)}
                        
                        
                        {coupons.length + globalCoupons.length == 0 && <Nodata>쿠폰이 없습니다</Nodata>}
                    </> : <Loading />}

                    <TouchableOpacity style={styles.closebtn} onPress={() => { navigation.goBack(); }}>
                        <Text style={{color: 'white', fontSize: 16}}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        }</>
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
    height: 160,
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
    height: 160,
    borderColor: '#F2F2F2',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 5,
    padding: 13,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 10,
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
