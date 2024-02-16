import React, { useState, useContext, useMemo, Fragment } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking, Share } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import moment from 'moment';
import {navigate} from '../../navigation/RootNavigation';
import style from '../../style/style';
import { number_format_pipe, order_pay_method_pipe, menu_price_pipe, order_state_pipe, od_receipt_price_pipe, order_fulladdress_pipe, order_contact_pipe } from '../../pipes';
import Loading  from '../../components/Loading';
import { basicErrorHandler } from '../../http-error-handler';
import API from '../../api';
import colors from '../../appcolors';
import globals from '../../globals';
import useInterval from '../../hooks/useInterval';
import useFocusEffect from '../../hooks/useFocusEffect';
import { NotificationContext } from '../../contexts/notification-context';


// 퀵배달, 일반배달 모두 사용
export default function MyOrderDetail({route}) {
    const { trigger } = useContext(NotificationContext);

    const [ order, setOrder ] = useState();
    useFocusEffect(() => {
        // const params = { od_id: '272189748' };
        const params = { od_id: route.params.od_id };
        
        API.get('/order/get_order.php', { params })
        .then(data => setOrder(data.data))
        .catch(basicErrorHandler);
    }, [ route.params, trigger ]);

    const isReceiptAvailable = useMemo(() => {
        if (!order) return false;
        return order.od_type == 'P' && order.od_misu == '0';
    }, [ order ]);

    const handleShare = async () => {
        await Share.share({
            message: '강화도 전용 원스톱 배달 플랫폼, ' + globals.baseURL,
        });
    }

    // 남은 픽업가능시간
	const [ remainPickupTime, setRemainPickupTime ] = useState();
	const pickupTime = useMemo(() => {
		if (order && order.od_type == 'P' && order.od_delv_flag == 'P' && order.od_state == 'accepted' && order.od_accept_time && order.od_delv_etime) {
			const time = moment(order.od_accept_time).add(order.od_delv_etime, 'minutes');
			console.log(time.format('YYYY-MM-DD HH:mm:ss'));
			return time;
		}
	}, [ order ]);
	useInterval(() => {
		if (pickupTime) {
			const now = moment();
			const duration = moment.duration(pickupTime.diff(now));
            const hours = duration.hours();
			const minutes = duration.minutes();
            const seconds = duration.seconds();
            const inMinutes = minutes + hours * 60;
            
			let result;
			if (inMinutes >= 0 && seconds >= 0) {
				result = `${inMinutes}분 ${seconds}초 후 픽업 가능`;
			}
			else {
				result = '현재 픽업가능';
			}
			setRemainPickupTime(result);
		}
		else {
			return null;
		}
	}, 1000);

    // 현재 실제버전에서 앱 충돌 일어남
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
                if (file && file.filePath) {
                    return FileViewer.open(file.filePath);
                }
                else {
                    throw new Error('file generate failed.');
                }
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
        <ScrollView contentContainerStyle={[{justifyContent: 'space-between'}]}>
            {order ? <View style={{ backgroundColor: 'white' }}>
                {order.od_state == 'waiting' && <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 5, borderWidth: 0.5, borderColor: '#E5E5E5' }}>
                    <Image source={require('../../images/ordercheck.png')} style={{marginRight: 15, width: 62, height: 62}} />
                    <View style={{justifyContent: 'center'}}>
                        <Text style={{ fontSize: 16, color: colors.textPrimary }}>주문이 정상적으로 완료되었습니다</Text>
                        <Text style={{color: '#777777', marginTop: 5}}>주문일시 {order.od_time.substring(0,16)}</Text>
                    </View>
                </View>}

                <View style={{padding: 15, backgroundColor: 'white'}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, }}>
                        <Text style={[{fontSize: 16, color: colors.textPrimary, fontWeight: '600', marginRight: 20}]}>주문번호</Text>
                        <Text style={style.text2}>{order.od_id}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10,}}>
                        <Text style={[style.text2, {fontWeight: '600', marginRight: 20}]}>주문일시</Text>
                        <Text style={style.text2}>{order.od_time}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={[style.text2, {fontWeight: '600', marginRight: 20}]}>주문상태</Text>
                        <Text style={style.text2}>{order_state_pipe(order)}</Text>
                        {!!remainPickupTime && <Text style={{ marginLeft: 8, fontSize: 14, color: colors.danger, alignSelf: 'flex-end', fontWeight: 'bold' }}>{remainPickupTime}</Text>}
                    </View>

                    {order.od_state == 'canceled' && <>
                        <View style={style.underLine}></View>
                        <View style={{ backgroundColor: '#ebdcdb', borderRadius: 5, padding: 10 }}>
                            <Text style={{ fontSize: 16, color: colors.primary }}>매장에서 주문 접수를 거절했습니다.</Text>
                            <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 6}}>거절사유: {order.od_reject_memo}</Text>
                        </View>
                    </>}

                    {order.deleted == 'Y' && <>
                        <View style={style.underLine}></View>
                        <View style={{ backgroundColor: '#ebdcdb', borderRadius: 5, padding: 10 }}>
                            <Text style={{ fontSize: 16, color: colors.primary }}>앱관리자에 의해 삭제된 주문입니다.</Text>
                        </View>
                    </>}

                    <View style={style.underLine} />
                    <Text style={styles.subtitle}>주소</Text>
                    {order.od_type === 'P' ? <>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                            <View style={{ height: 26, width: 48, borderColor: '#E51A47', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{color: '#E51A47'}}>배달지</Text>
                            </View>
                            <Text style={[style.text2, {marginLeft: 10, flex: 1}]}>{order_fulladdress_pipe(order, 'user')}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{ height: 26, width: 48, borderColor: '#E51A47', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{color: '#E51A47'}}>연락처</Text>
                            </View>
                            <Text style={[style.text2, {marginLeft: 10, justifyContent: 'center'}]}>{order_contact_pipe(order, 'user')}</Text>
                        </View>
                    </> : <>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                            <View style={{ height: 26, width: 48, borderColor: '#E51A47', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{color: '#E51A47'}}>출발지</Text>
                            </View>
                            <View style={{ marginLeft: 10, flex: 1 }}>
                                <Text style={[style.text2]}>{order_fulladdress_pipe(order, 'start')}</Text>
                                <Text style={[style.text2]}>{order_contact_pipe(order, 'start')}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                            <View style={{ height: 26, width: 48, borderColor: '#E51A47', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{color: '#E51A47'}}>도착지</Text>
                            </View>
                            <View style={{ marginLeft: 10, flex: 1 }}>
                                <Text style={[style.text2]}>{order_fulladdress_pipe(order, 'end')}</Text>
                                <Text style={[style.text2]}>{order_contact_pipe(order, 'end')}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{ height: 26, width: 48, borderColor: '#E51A47', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{color: '#E51A47'}}>연락처</Text>
                            </View>
                            <Text style={[style.text2, {marginLeft: 10, justifyContent: 'center'}]}>{order_contact_pipe(order, 'user')}</Text>
                        </View>
                    </>}
                </View>
                
                <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>
                <View style={{backgroundColor: 'white', padding: 15}}>
                    {order.od_type === 'P' && <>
                        <Text style={[styles.subtitle, {marginBottom: 10}]}>매장 사장님에게</Text>
                        <Text numberOfLines={3} ellipsizeMode="tail" style={{fontSize: 16}}>{order.od_shop_memo}</Text>
                    </>}
                    
                    {(order.od_type === 'Q' || order.od_delv_flag == 'D') && <>
                        {order.od_type == 'P' && <View style={{ height: 1, backgroundColor: '#E5E5E5', marginVertical: 20, }}></View>}
                        <Text style={[styles.subtitle, {marginBottom: 10}]}>라이더님에게</Text>
                        <Text numberOfLines={3} ellipsizeMode="tail" style={{fontSize: 16}}>{order.od_memo}</Text>
                    </>}
                    {order.od_disposables === 'Y' && <Text style={{ fontSize: 14, color: colors.textSecondary }}>*일회용품 요청</Text>}
                </View>
                
                <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>
                <View style={{ paddingHorizontal: 15, paddingTop: 15, backgroundColor: 'white', }}></View>

                <View style={{padding: 15, backgroundColor: 'white'}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, }}>
                        <Text style={style.text2}>결제방법</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
                            <Text style={style.text2}>{order_pay_method_pipe(order)}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, }}>
                        <Text style={style.text2}>배달비</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
                            <Text style={style.text2}>{number_format_pipe(order.od_send_cost)}원</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, }}>
                        <Text style={style.text2}>{order.od_type == 'P' ? "주문금액" : "옵션금액"}</Text>
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

                {order.od_type == 'P' && <>
                    <View style={{backgroundColor: 'white', padding: 15}}>
                        {/* 상품정보 */}
                        {order.menus.map((item, index) => <Fragment key={item.ct_id}>
                            <Text style={{fontSize: 18}}>{item.mnu_name}</Text>
                            <View style={{marginVertical: 10}}>
                                <Text style={styles.subcontents}>기본: {number_format_pipe(item.mnu_price)}원</Text>
                                {item.items.map(option => 
                                    <Text key={option.oit_sn} style={styles.subcontents}>{option.opt_name}: {option.oit_name}(+{number_format_pipe(option.oit_price)}원)</Text>
                                )}
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, }}>
                                <Text style={{fontSize: 18}}>{number_format_pipe(menu_price_pipe(item))} 원</Text>
                                <Text style={{ fontSize: 16, color: colors.textPrimary }}>{item.it_qty}개</Text>
                            </View>
                            <View style={{ height: 1, backgroundColor: '#E5E5E5', marginVertical: 12, }}></View>
                        </Fragment>)}
                        
                        {/* 상점정보 */}
                        {order.store && <>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                <Text style={{fontSize: 18, fontWeight: '600'}}>{order.store.sl_title}</Text>
                                <TouchableOpacity onPress={() => { navigate('DeliveryDetail', { sl_sn: order.store.sl_sn }); }} style={{ height: 30, width: 88, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 5, borderColor: '#E51A47', }}>
                                    <Text style={[style.text2, {color: '#E51A47', fontWeight: '600'}]}>매장가기</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={style.text2}>{order.store.sl_addr1} {order.store.sl_addr2}</Text>
                        </>}
                    </View>
                    <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>
                </>}

                {order.od_type == 'Q' && <>
                    <View style={{backgroundColor: 'white', padding: 15}}>
                        {/* 상품정보 */}
                        {order.options.map((item, index) => <Fragment key={item.op_id}>
                            <Text style={{fontSize: 18}}>{item.op_type == 1 ? '필수옵션' : '선택옵션'}</Text>
                            <View style={{marginVertical: 10}}>
                                <Text style={styles.subcontents}>{item.op_name}: {number_format_pipe(item.op_price)}원</Text>
                            </View>
                            <View style={{ height: 1, backgroundColor: '#E5E5E5', marginVertical: 12, }}></View>
                        </Fragment>)}
                    </View>
                    <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>
                </>}

                <View style={{padding: 15, backgroundColor: 'white', width: '100%'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TouchableOpacity style={{ height: 45, width: '49%', backgroundColor: '#777777', justifyContent: 'center', alignItems: 'center', borderRadius: 5, }} onPress={handleShare}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={require('../../images/successshare.png')} style={{ width: 20, height: 20 }} ></Image>
                                <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>{'  '}공유하기</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height: 45, width: '49%', backgroundColor: '#E51A47', justifyContent: 'center', alignItems: 'center', borderRadius: 5, }} onPress={() => { 
                            if (order.od_type == 'P') {
                                Linking.openURL('tel:' + order.store?.sl_biztel);
                            }
                            else {
                                Linking.openURL('tel:' + order.rider.mb_hp);
                            }
                        }} >
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={require('../../images/orderdetailcall.png')} style={{ width: 16, height: 16 }} />
                                <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>{'  '}전화하기</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                    {/* {isReceiptAvailable && <TouchableOpacity style={[styles.fotterbtn, {backgroundColor: '#28B766'}]} onPress={handleShowReceiptClick}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('../../images/successdown.png')}></Image>
                            <Text style={[style.text2, {color: 'white', fontWeight: 'bold'}]}>{'  '}영수증 파일 받기</Text>
                        </View>
                    </TouchableOpacity>} */}
                </View>

                {/* <ReceiptModal visible={receiptModalOpen} setVisible={setReceiptModalOpen} order={order} /> */}
            </View> : <Loading />}
        </ScrollView>
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
