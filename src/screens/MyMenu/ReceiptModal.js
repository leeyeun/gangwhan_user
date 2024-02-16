import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, TextInput } from 'react-native';
import Modal from 'react-native-modal';

import { number_format_pipe, mobile_pipe, single_menu_price_pipe } from '../../pipes';


// 안씀
const ReceiptModal = ({ visible, setVisible, order }) => {
    // 부가세액
    const taxPrice = useMemo(() => {
        if (order) return Math.ceil(order.od_receipt_price * 0.1);
    }, [ order ]);

    // 물품가액: 전체금액 - 부가세액
    const supplyPrice = useMemo(() => {
        if (order) {
            const tax = Math.ceil(order.od_receipt_price * 0.1);
            return order.od_receipt_price - tax;
        }
    }, [ order ]);

    return (
        <Modal isVisible={visible} onRequestClose={() => { setVisible(false) }}>
            {order && <View style={{flex: 1, backgroundColor: 'white'}}>
                <TouchableOpacity style={{ alignItems: 'flex-end', marginTop: 10, marginRight: 15, }} onPress={() => { setVisible(false); }}>
                    <Image source={require('../../images/receiptclose.png')} />
                </TouchableOpacity>
                
                <ScrollView style={{ borderWidth: 1, flex: 1, margin: 15, padding: 15, paddingBottom: 20, }}>
                    <Text style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginVertical: 20, }}>영수증</Text>
                    <View>
                        {order.store && <>
                            <Text style={{marginBottom: 3}}>{order.store.sl_title} / {order.store.sl_biznum} / {order.store.sl_bizceo}</Text>
                            <Text style={{marginBottom: 3}}>{order.store.sl_addr1} {order.store.sl_addr2}</Text>
                            <Text style={{marginBottom: 3}}>{mobile_pipe(order.store.sl_biztel)}</Text>
                        </>}
                        <Text style={{marginBottom: 3}}>{order.od_receipt_time}</Text>
                        <View height={15}></View>
                        
                        {/* 구매내역 */}
                        <View style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: '#AAAAAA', }}></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: 35, alignItems: 'center', }}>
                            <Text style={{width: '50%'}}>상 품 명</Text>
                            <View style={{ flexDirection: 'row', width: '50%', }}>
                                <Text style={{ fontWeight: 'bold', width: '40%', textAlign: 'center', }}>단가</Text>
                                <Text style={{ fontWeight: 'bold', width: '20%', textAlign: 'center', }}>수량</Text>
                                <Text style={{ fontWeight: 'bold', width: '40%', textAlign: 'center', }}>금액</Text>
                            </View>
                        </View>
                        <View style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: '#AAAAAA', marginBottom: 10, }}></View>
                        {order.menus.map((menu) => <Fragment key={menu.ct_id}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, }}>
                                <View style={{width: '45%'}}>
                                    <Text>{menu.mnu_name}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: '55%', justifyContent: 'flex-end', alignItems: 'center', }}>
                                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ width: '35%', textAlign: 'right', }}>{number_format_pipe(single_menu_price_pipe(menu))}</Text>
                                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ width: '20%', textAlign: 'right', }}>{number_format_pipe(menu.it_qty)}</Text>
                                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ width: '40%', textAlign: 'right', }}>{number_format_pipe(single_menu_price_pipe(menu) * menu.it_qty)}</Text>
                                </View>
                            </View>    
                        </Fragment>)}
                        <View style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: '#AAAAAA', marginVertical: 15, }}></View>
                        {/* end: 구매내역 */}

                        {/* 요약 */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, }}>
                            <Text>합계금액</Text>
                            <Text>{number_format_pipe(order.od_cart_price)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            <Text>할인금액</Text>
                            <Text>{number_format_pipe(order.od_coupon_price)}</Text>
                        </View>
                        <View style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: '#AAAAAA', marginVertical: 15, }}></View>
                        {order.od_coupon_price > 0 && <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', }}>
                            <Text style={{width: '50%'}}>*할인내역: 쿠폰할인</Text>
                        </View>}
                        <View style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: '#AAAAAA', marginVertical: 15, }}></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, }}>
                            <Text>물품가액</Text>
                            <Text>{number_format_pipe(supplyPrice)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, }}>
                            <Text>부가세액</Text>
                            <Text>{number_format_pipe(taxPrice)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, }}>
                            <Text style={{fontWeight: 'bold'}}>합{'       '}계</Text>
                            <Text style={{fontWeight: 'bold'}}>{number_format_pipe(order.od_receipt_price)}</Text>
                        </View>
                        <View style={{height: 20}}></View>
                        {/* end: 요약 */}
                    </View>
                </ScrollView>
                <TouchableOpacity style={{ height: 50, backgroundColor: '#E51A47', justifyContent: 'center', alignItems: 'center', }} onPress={() => {}}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', }}>다운로드</Text>
                </TouchableOpacity>
            </View>}
        </Modal>
    );
}

export default ReceiptModal;