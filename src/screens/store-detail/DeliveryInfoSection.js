import React, { useState, useContext, useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Modal } from 'react-native';
import { WebView } from 'react-native-webview';


import { MemoryContext } from '../../contexts/memory-context';
import globals from '../../globals';
import colors from '../../appcolors';
import { number_format_pipe, store_address_pipe } from '../../pipes';


const DeliveryInfoSection = ({ store }) => {
    const { baseDeliveryPrice, deliveryPolicy } = useContext(MemoryContext);
    const [ tab, setTab ] = useState('delivery');

    const webviewAddress = useMemo(() => {
        if (store.sl_lat && store.sl_lon) {
            return `${globals.baseURL}/jax/map_addres2.php?latlon=${store.sl_lat},${store.sl_lon}`;
        }
    }, [ store ]);

    const [ deliveryPriceinfoModalOpen, setDeliveryPriceinfoModalOpen ] = useState(false);

    const distanceValue = useMemo(() => {
        return number_format_pipe(+deliveryPolicy.base_distance / 1000);
    }, [ deliveryPolicy ]);

    const additionalFeeSpan = useMemo(() => {
        return `기본거리 초과시 ${deliveryPolicy.distance_unit}M 당 ${deliveryPolicy.price_per_unit}원씩 추가됩니다.`;
    }, [ deliveryPolicy ])

	return (
		<View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>
                <TouchableOpacity style={{ height: 50, justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: tab == 'delivery' ? '#E51A47' : '#e5e5e5', width: '50%', }} onPress={() => { setTab('delivery'); }}>
                    <Text style={{ textAlign: 'center', color: tab == 'delivery' ? '#E51A47' : '#777777', fontSize: 17, fontWeight: 'bold', }}>배달주문</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ height: 50, justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: tab == 'wrap' ? '#E51A47' : '#e5e5e5', width: '50%', }} onPress={() => { setTab('wrap'); }}>
                    <Text style={{ textAlign: 'center', color: tab == 'wrap' ? '#E51A47' : '#777777', fontSize: 17, }}>포장/방문 주문</Text>
                </TouchableOpacity>
            </View>

            {tab == 'delivery' && <View style={{padding: 15, backgroundColor: 'white'}}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.title}>최소주문금액</Text>
                    <Text style={styles.content}>{number_format_pipe(store.min_order_price)} 원</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.title]}>배달시간</Text>
                    <Text style={styles.content}>{store.delv_memo}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    <Text style={[styles.title]}>배달비</Text>
                    <View style={{ flex: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: colors.textPrimary }}>{baseDeliveryPrice ? number_format_pipe(baseDeliveryPrice) : '-'} 원</Text>
                        <TouchableOpacity onPress={() => { setDeliveryPriceinfoModalOpen(true); }}>
                            <Text style={{ marginLeft: 8, width: 40, height: 20, textAlign: 'center', textAlignVertical: 'center', fontSize: 12, color: colors.textPrimary, borderColor: colors.borderColor, borderWidth: 1, }}>자세히</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>}

            {tab == 'wrap' && <>
                <View style={{padding: 15, backgroundColor: 'white'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.title}>최소주문금액</Text>
                        <Text style={styles.content}>{number_format_pipe(store.min_order_price)} 원</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={[styles.title]}>조리시간</Text>
                        <Text style={styles.content}>{store.cook_memo}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={[styles.title]}>위치안내</Text>
                        <Text style={styles.content}>{store_address_pipe(store)}</Text>
                    </View>
                    <View>
                        {webviewAddress && <WebView source={{ uri: webviewAddress }} style={{ height: 200, minHeight: 1, opacity: 0.99 }}	/>}
                    </View>
                </View>
            </>}

            {/* 배달비 정보 모달 */}
            <Modal
                transparent={true}
                visible={deliveryPriceinfoModalOpen}
                onRequestClose={() => {
                    setDeliveryPriceinfoModalOpen(false);
                }}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <TouchableWithoutFeedback onPress={() => {
                        setDeliveryPriceinfoModalOpen(false);
                    }}>
                        <View style={{ flex: 1 }}></View>
                    </TouchableWithoutFeedback>
                    
                    <View style={{ backgroundColor: 'white', padding: 15, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <View>
                            <Text style={{ fontSize: 16, color: colors.textPrimary, fontWeight: 'bold', alignSelf: 'center' }}>배달요금 안내</Text>
                            <TouchableWithoutFeedback onPress={() => { setDeliveryPriceinfoModalOpen(false); }}>
                                <Image source={require('../../images/receiptclose.png')} style={{ width: 16, height: 16, position: 'absolute', right:0 }} />
                            </TouchableWithoutFeedback>
                        </View>

                        <Text style={{ marginTop: 14, fontSize: 14, color: colors.textSecondary }}>배달요금은 배달거리, 시간, 날씨 등에 따라 달라질 수 있습니다.</Text>
                        
                        <View style={{ marginTop: 10, backgroundColor: '#f0f0f0' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 }}>
                                <Text style={{ fontSize: 14, color: colors.textPrimary, marginLeft: 10 }}>최소주문금액</Text>
                                <Text style={{ fontSize: 14, color: colors.textPrimary, marginRight: 10 }}>{number_format_pipe(store.min_order_price)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6, borderColor: colors.borderColor, borderTopWidth: 1 }}>
                                <Text style={{ fontSize: 14, color: colors.textPrimary, marginLeft: 10 }}>배달비 ({distanceValue}km 기준)</Text>
                                <Text style={{ fontSize: 14, color: colors.textPrimary, marginRight: 10 }}>{number_format_pipe(baseDeliveryPrice)}</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: 4}}>{additionalFeeSpan}</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
    title: {marginRight: 20, marginBottom: 10, fontSize: 16, fontWeight: 'bold', color: colors.textPrimary, flex: 2},
    content: { fontSize: 16, color: colors.textPrimary, flex: 5 },
});

export default DeliveryInfoSection;