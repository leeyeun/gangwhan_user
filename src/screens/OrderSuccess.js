import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, StatusBar, Linking, TouchableOpacity } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';

import { SharedButton, RedIconButton } from '../components/BOOTSTRAP';
import style from '../style/style';
import { NotificationContext } from '../contexts/notification-context';
import API from '../api';
import Loading from '../components/Loading';
import globals from '../globals';
import colors from '../appcolors';
import cstyles from '../cstyles';
import { number_format_pipe, order_pay_method_pipe, mobile_pipe, od_receipt_price_pipe, menu_price_pipe } from '../pipes';
import { basicErrorHandler } from '../http-error-handler';


// 퀵배달, 일반배달 모두 사용
// 사용안함 : MyOrderDetail 로 통합함
export default function OrderSuccess({ navigation, route }) {
    const { trigger } = useContext(NotificationContext);

    const [ order, setOrder ] = useState();
    useEffect(() => {
        const params = { od_id: route.params.od_id };
        API.get('/order/get_order.php', { params })
        .then(data => {
            setOrder(data.data);
        })
        .catch(basicErrorHandler);
    }, [ route.params, trigger ]);

    const isReceiptAvailable = useMemo(() => {
        if (!order) return false;
        return order.od_type == 'P' && order.od_misu == '0';
    }, [ order ]);

    // 아래코드가 현재 실버전에서 앱이 튕김
    const handleShowReceiptClick = () => {
        if (!isReceiptAvailable) return;
        
        API.get('/order/get_receipt_html.php?od_id=' + order.od_id)
        .then(data => {
            let options = {
                html: data.data.html,
                fileName: 'gwn_' + order.od_id,
                directory: 'Documents',
            };
          
            RNHTMLtoPDF.convert(options)
            .then(file => {
                return FileViewer.open(file.filePath);
            })
            .then(() => {
                // success
                console.log('success');
            })
            .catch(error => {
                // error
                console.error(error);
            });
        })
        .catch(basicErrorHandler);
    }

    return (
        <>{order ? <View style={{flex: 1}}>
            <StatusBar barStyle="dark-content" backgroundColor={'white'} />

            <ScrollView contentContainerStyle={[{justifyContent: 'space-between'}]}>
                <View style={{padding: 15, backgroundColor: 'white'}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 25, borderRadius: 5, borderWidth: 0.5, borderColor: '#E5E5E5' }}>
                        <Image source={require('../images/ordercheck.png')} style={{marginRight: 15, width: 62, height: 62}} />
                        <View style={{justifyContent: 'center'}}>
                            <Text style={style.text2}>주문이 정상적으로 완료되었습니다</Text>
                            <Text style={{color: '#777777', marginTop: 5}}>주문일시 {order.od_time.substring(0,16)}</Text>
                        </View>
                    </View>

                    {/* 주소정보 */}
                    {order.od_type == 'P' ? <>
                        {order.od_delv_flag == 'D' ? <>
                            <Text style={styles.subtitle}>주문자 정보</Text>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{ height: 26, width: 48, borderColor: '#E51A47', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={{color: '#E51A47'}}>배달지</Text>
                                </View>
                                <View style={{marginTop: 3, marginLeft: 10, width: '84%'}}>
                                    <Text numberOfLines={3} ellipsizeMode="tail" style={style.text2}>{order.od_addr1}</Text>
                                    <View style={{ flexDirection: 'row', marginVertical: 8, }}>
                                        <Text numberOfLines={3} ellipsizeMode="tail" style={{ color: '#777777', width: '78%', }}>{order.od_addr2}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{ height: 26, width: 48, borderColor: '#E51A47', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={{color: '#E51A47'}}>연락처</Text>
                                </View>
                                <View style={{marginLeft: 10, justifyContent: 'center'}}>
                                    <Text style={style.text2}>{mobile_pipe(order.od_hp)}</Text>
                                </View>
                            </View>
                        </> : <>
                            <Text style={styles.subtitle}>주문자 정보</Text>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{ height: 26, width: 48, borderColor: '#E51A47', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={{color: '#E51A47'}}>연락처</Text>
                                </View>
                                <View style={{marginLeft: 10, justifyContent: 'center'}}>
                                    <Text style={style.text2}>{mobile_pipe(order.od_hp)}</Text>
                                </View>
                            </View>
                        </>}
                        
                    </> : <>
                        <Text style={styles.subtitle}>출발지</Text>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{ height: 26, width: 48, borderColor: '#E51A47', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{color: '#E51A47'}}>주소</Text>
                            </View>
                            <View style={{marginTop: 3, marginLeft: 10, width: '84%'}}>
                                <Text numberOfLines={3} ellipsizeMode="tail" style={style.text2}>{order.od_addr1}</Text>
                                <View style={{ flexDirection: 'row', marginVertical: 8, }}>
                                    <Text numberOfLines={3} ellipsizeMode="tail" style={{ color: '#777777', width: '78%', }}>{order.od_addr2}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{ height: 26, width: 48, borderColor: '#E51A47', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{color: '#E51A47'}}>연락처</Text>
                            </View>
                            <View style={{marginLeft: 10, justifyContent: 'center'}}>
                                <Text style={style.text2}>{mobile_pipe(order.od_hp)}</Text>
                            </View>
                        </View>

                        <Text style={styles.subtitle}>도착지</Text>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{ height: 26, width: 48, borderColor: '#E51A47', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{color: '#E51A47'}}>주소</Text>
                            </View>
                            <View style={{marginTop: 3, marginLeft: 10, width: '84%'}}>
                                <Text numberOfLines={3} ellipsizeMode="tail" style={style.text2}>{order.od_b_addr1}</Text>
                                <View style={{ flexDirection: 'row', marginVertical: 8, }}>
                                    <Text numberOfLines={3} ellipsizeMode="tail" style={{ color: '#777777', width: '78%', }}>{order.od_b_addr2}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{ height: 26, width: 48, borderColor: '#E51A47', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{color: '#E51A47'}}>연락처</Text>
                            </View>
                            <View style={{marginLeft: 10, justifyContent: 'center'}}>
                                <Text style={style.text2}>{mobile_pipe(order.od_b_hp)}</Text>
                            </View>
                        </View>
                    </>}
                </View>
                <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>

                <View style={{backgroundColor: 'white', padding: 15}}>
                    {order.od_type == 'P' && <>
                        <Text style={[styles.subtitle, {marginBottom: 10}]}>매장 사장님에게</Text>
                        <Text numberOfLines={3} ellipsizeMode="tail" style={{fontSize: 16}}>{order.od_shop_memo}</Text>
                    </>}

                    {order.od_delv_flag == 'D' && <>
                        <View style={{ height: 1, backgroundColor: '#E5E5E5', marginVertical: 20, }}></View>
                        <Text style={[styles.subtitle, {marginBottom: 10}]}>라이더님에게</Text>
                        <Text numberOfLines={3} ellipsizeMode="tail" style={{fontSize: 16}}>{order.od_memo}</Text>
                    </>}
                </View>
                <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>
                <View style={{ paddingHorizontal: 15, paddingTop: 15, backgroundColor: 'white', }}></View>

                <View style={{padding: 15, backgroundColor: 'white'}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, }}>
                        <Text style={style.text2}>결제방법</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',}}>
                            <Text style={style.text2}>{order_pay_method_pipe(order)}</Text>
                        </View>
                    </View>
                    {order.od_delv_flag == 'D' && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, }}>
                        <Text style={style.text2}>배달비</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
                            <Text style={style.text2}>{number_format_pipe(order.od_send_cost)}원</Text>
                        </View>
                    </View>}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, }}>
                        <Text style={style.text2}>주문금액</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
                            <Text style={style.text2}>{number_format_pipe(order.od_cart_price)}원</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, }}>
                        <Text style={style.text2}>할인금액</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
                            <Text style={style.text2}>{number_format_pipe(order.od_coupon_price)}원</Text>
                        </View>
                    </View>
                    <View style={{ height: 1, backgroundColor: '#E5E5E5', marginVertical: 16, }}></View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5, }}>
                        <Text style={{fontSize: 18}}>결제금액</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{number_format_pipe(od_receipt_price_pipe(order))}원</Text>
                        </View>
                    </View>
                </View>
                <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>

                {/* 메뉴 */}
                {order.menus.length > 0 && <>
                    <View style={{backgroundColor: 'white', padding: 15}}>
                        {order.menus.map(menu => <Fragment key={menu.ct_id}>
                            <Text style={{fontSize: 18, marginBottom: 10}}>{menu.mnu_name}</Text>
                            <Text style={{fontSize: 16, color: '#777777', marginBottom: 5}}>기본: {number_format_pipe(menu.mnu_price)}원</Text>
                            {menu.items.map(option => 
                                <Text key={option.oit_sn} style={styles.subcontents}>{option.opt_name}: {option.oit_name}(+{number_format_pipe(option.oit_price)}원)</Text>
                            )}
                            <View style={{ height: 1, backgroundColor: '#E5E5E5', marginVertical: 20, }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: 18 }}>{number_format_pipe(menu_price_pipe(menu))} 원</Text>
                                <Text style={{ fontSize: 16 }}>{number_format_pipe(menu.it_qty)}개</Text>
                            </View>
                        </Fragment>)}
                    </View>
                    <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>
                </>}
                
                {/* 버튼 */}
                <View style={{padding: 15, backgroundColor: 'white', width: '100%'}}>
                <View style={style.Row1}>
                    {/* <SharedButton style={{marginRight: 5}} textStyle={{fontSize: 14}} src={require('../images/successshare.png')} title="공유하기" /> */}
                    <SharedButton style={{}} textStyle={{fontSize: 14}} src={require('../images/successcall.png')} title="전화하기" onPress={() => { Linking.openURL('tel:' + (order.store.sl_biztel || order.store.sl_hp) )}} />
                </View>

                {/* {isReceiptAvailable && <TouchableOpacity style={[styles.fotterbtn, {backgroundColor: '#28B766'}]} onPress={handleShowReceiptClick}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={require('../images/successdown.png')}></Image>
                        <Text style={[style.text2, {color: 'white', fontWeight: 'bold'}]}>{'  '}영수증 파일 받기</Text>
                    </View>
                </TouchableOpacity>} */}

                <View style={{ marginTop: 10 }}><RedIconButton title="주문내역으로 이동" style={{marginBottom: 10}} src={require('../images/successlist.png')} onPress={() => { navigation.navigate('MyOrderList'); }} /></View>
                </View>
            </ScrollView>
        </View> : <Loading />}</>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
