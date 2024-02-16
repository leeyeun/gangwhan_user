import React, { useState, useContext, useRef, Fragment } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image, ScrollView } from 'react-native';
import style from '../style/style';
import {RadioButton} from 'react-native-paper';
import Modal from 'react-native-modal';
import { AppContext } from '../contexts/app-context';
import Nodata from '../components/Nodata';
import { number_format_pipe, menu_price_pipe } from '../pipes';
import { CartContext } from '../contexts/cart-context';


export default function Cart({navigation}) {
    const { cartInfo, modifyItemAmount, removeCartItem, division, setDivision } = useContext(CartContext);
    const { showSnackbar } = useContext(AppContext);

    const onMinusPress = (menu) => {
        if (+menu.it_qty > 0) {
            modifyItemAmount(menu.ct_id, +menu.it_qty - 1, () => {});
        }
    }

    const onPlusPress = (menu) => {
        modifyItemAmount(menu.ct_id, +menu.it_qty + 1, () => {});
    }

    // remove menu
    const [ removeItemModalOpen, setRemoveItemModalOpen ] = useState(false);
    const removeTargetRef = useRef();
    const handleRemoveMenuPress = (menu) => {
        removeTargetRef.current = menu;
        setRemoveItemModalOpen(true);
    }
    const handleRemoveMenu = () => {
        removeCartItem(removeTargetRef.current, () => { setRemoveItemModalOpen(false); });
    }
    // end: remove menu

    const handleSubmit = () => {
        if (cartInfo && cartInfo.menus.length > 0) {
            if (cartInfo.info.total_price < cartInfo.store.min_order_price) return showSnackbar(`최소주문금액(${number_format_pipe(cartInfo.store.min_order_price)})원 이상 주문해야합니다.`);
            navigation.navigate('OrderDeliOnline');
        }
        else {
            showSnackbar('장바구니에 상품이 없습니다.');
        }
    }

    return (
        <ScrollView>
            {cartInfo && <>
                <View style={{padding: 15, backgroundColor: 'white'}}>
                    <Text style={styles.subtitle}>{cartInfo.store ? cartInfo.store.sl_title : '매장명'}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableWithoutFeedback onPress={() => { setDivision('delivery') }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <RadioButton.Android color="#E51A47" status={division === 'delivery' ? 'checked' : 'unchecked'} onPress={() => { setDivision('delivery') }} />
                                <Text style={style.text2}>배달</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableWithoutFeedback onPress={() => { setDivision('wrap') }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <RadioButton.Android color="#E51A47" status={division === 'wrap' ? 'checked' : 'unchecked'} onPress={() => { setDivision('wrap') }} />
                                <Text style={style.text2}>포장</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>

                <View style={{height: 10, backgroundColor: '#F5F5F5'}}></View>
                <View style={{ paddingHorizontal: 15, paddingVertical: 15, backgroundColor: 'white', }}>
                    {cartInfo.menus.map(item => <Fragment key={item.ct_id}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 18}}>{item.mnu_name}</Text>
                            <TouchableOpacity onPress={() => { handleRemoveMenuPress(item) }}>
                                <Image source={require('../images/cartdelete.png')}></Image>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginVertical: 10}}>
                            <Text style={styles.subcontents}>기본: {number_format_pipe(item.mnu_price)}원</Text>
                            {item.items.map(option => 
                                <Text key={option.oit_sn} style={styles.subcontents}>{option.opt_name}: {option.oit_name}(+{number_format_pipe(option.oit_price)}원)</Text>
                            )}
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>
                            <Text style={{fontSize: 18}}>{number_format_pipe(menu_price_pipe(item))} 원</Text>
                            <View style={styles.plusminus}>
                                <TouchableWithoutFeedback onPress={() => { onMinusPress(item) }}>
                                    <Image source={require('../images/minus.png')} style={{ width: 18, height: 18 }}></Image>
                                </TouchableWithoutFeedback>
                                <Text>{item.it_qty}개</Text>
                                <TouchableWithoutFeedback onPress={() => { onPlusPress(item) }}>
                                    <Image source={require('../images/plus.png')} style={{ width: 18, height: 18 }}></Image>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#E5E5E5', marginVertical: 12, }}></View>
                    </Fragment>)}
                    
                    {cartInfo.menus.length === 0 && <Nodata>장바구니가 비어있습니다.</Nodata>}
                    
                    <TouchableOpacity style={styles.addcart} onPress={() => {
                        if (cartInfo.store) {
                            navigation.navigate('DeliveryDetail', { sl_sn: cartInfo.store.sl_sn });
                        }
                        else {
                            navigation.goBack();
                        }
                    }}>
                        <Image source={require('../images/plus1.png')} style={{ width: 16, height: 16 }} ></Image>
                        <Text style={[style.text2, {color: '#E51A47'}]}>{' '}제품 추가하기{' '}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <View style={styles.footer1}>
                        <Text style={{fontSize: 18}}>총 주문금액</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{number_format_pipe(cartInfo.info.total_price)}</Text>
                            <Text style={{fontSize: 20}}> 원</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.fotterbtn} onPress={handleSubmit}>
                        <Text style={[style.text2, {color: 'white', fontWeight: 'bold'}]}>주문하기</Text>
                    </TouchableOpacity>
                </View>
                
                {/* 메뉴 한개 제거 모달 */}
                <Modal isVisible={removeItemModalOpen} onRequestClose={() => { setRemoveItemModalOpen(false) }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <View style={{ backgroundColor: 'white', width: '100%', padding: 20, alignItems: 'center' }}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>장바구니 제품 삭제</Text>
                            <View style={{ height: 1, backgroundColor: '#E5E5E5', marginVertical: 20, width: '100%', }}></View>
                            <View>
                                <Text style={{textAlign: 'center', fontSize: 16}}> 해당 제품이 장바구니에서 삭제됩니다. {'\n'} 삭제하시겠습니까? </Text>
                            </View>
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', marginTop: 25, }}>
                                <TouchableOpacity style={styles.modalCancel} onPress={() => setRemoveItemModalOpen(false)}>
                                    <Text style={styles.modalBtnFont}>취소</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalOk} onPress={handleRemoveMenu}>
                                    <Text style={styles.modalBtnFont}>확인</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </>}
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
        marginHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
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
