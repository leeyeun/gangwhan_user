import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TouchableWithoutFeedback, Image, TextInput, ScrollView, useWindowDimensions } from 'react-native';
import style from '../style/style';
import {RadioButton, Checkbox} from 'react-native-paper';


import { CartContext } from '../contexts/cart-context';
import API from '../api';
import colors from '../appcolors';
import { number_format_pipe, http_url_pipe } from '../pipes';
import { basicErrorHandler } from '../http-error-handler';


export default function DetailMenu({navigation, route}) {
    const { addCart } = useContext(CartContext);
    
    const store = useMemo(() => { return route.params.store }, [ route.params ]);

    const [ menu, setMenu ] = useState();
    useEffect(() => {
        if (route.params.menu && route.params.store) {
            const params = { sl_sn: store.sl_sn };
            API.get('/store/get_menus.php', { params })
            .then(data => {
                const target = data.data.find(item => item.it_id == route.params.menu.it_id)
                setMenu(target);
            })
            .catch(basicErrorHandler);
        }
    }, [ route.params ]);

    const dimensions = useWindowDimensions();
    const representImageSize = useMemo(() => {
        return {
            width: dimensions.width,
            height: dimensions.width / 4 * 3,
        }
    }, [ dimensions ]);

    // 수량
    const [ amount, setAmount ] = useState(1);
    const handleAddAmount = () => {
        setAmount(value => value + 1);
    }
    const handleSubtractAmount = () => {
        setAmount(value => {
            if (value > 1) {
                return value - 1;
            }
            return value;
        });
    }
    // end: 수량

    const totalPrice = useMemo(() => {
        if (menu) {
            const base = +menu.mnu_price;
            let additional = 0;
            menu.options.forEach(option => {
                option.items.map(item => {
                    if (item.checked) additional += +item.oit_price;
                });
            });
            return (base + additional) * amount;
        }
    }, [ menu, amount ]);

    const handleAddCart = () => {
        // 메뉴 일련번호
        let optionIds = [];
        menu.options.forEach(option => {
            option.items.map(item => {
                if (item.checked) optionIds.push(item.oit_sn);
            });
        });
        optionIds = optionIds.join(',');

        // data
        const data = {
            sl_sn: store.sl_sn,
            it_id: menu.it_id,
            it_qty: amount,
            ioi_id: optionIds,
        };
        
        addCart(data, () => {
            navigation.goBack();
        });
    }

    const handleOptionItemPressed = (option, optionIndex, item, itemIndex) => {
        if (option.opt_type === 'radio') {
            setMenu(menu => {
                const result = { ...menu };
                result.options[optionIndex].items.forEach(item => {
                    item.checked = false;
                });
                result.options[optionIndex].items[itemIndex].checked = true;
                return result;
            });
        }
        else {
            setMenu(menu => {
                const result = {...menu};
                const target = result.options[optionIndex].items[itemIndex];
                target.checked = !target.checked;
                return result;
            });
        }
    }

    return (
        <>
            {menu && <>
                <ScrollView style={{backgroundColor: 'white'}}>
                    <View>
                        <View>
                            <Image source={{ uri: http_url_pipe(menu.mnu_pic) }} style={{ width: representImageSize.width, height: representImageSize.height, resizeMode: 'cover' }} />
                            
                            <View style={{ position: 'absolute', left:0, bottom: -35, height: 70, flexDirection: 'column', width: '100%' }}>
                                <View style={{ flexDirection: 'row', marginHorizontal: 15, flex: 1, borderWidth: 0.5, borderRadius: 5, borderColor: '#E5E5E5', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', shadowColor: '#000', shadowOffset: {width: 1, height: 1}, shadowOpacity: 0.2, shadowRadius: 3, elevation: 5 }}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{menu.mnu_name}</Text>
                                    {menu.mnu_represent == 'Y' && <View style={{ backgroundColor: '#E51A47', height: 20, width: 37, borderRadius: 3, justifyContent: 'center', alignItems: 'center', marginLeft: 5, }}>
                                        <Text style={{color: 'white'}}>대표</Text>
                                    </View>}
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop: 60}}>
                            <View style={{marginHorizontal: 15}}>
                                <View style={{ position: 'relative', flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <Text style={style.text2}>기본금액</Text>
                                    <Text style={style.text2}>{number_format_pipe(menu.mnu_price)}원</Text>
                                </View>

                                {menu.options.filter(el => el.opt_dp == 'Y').map((option, optionIndex) => <Fragment key={option.opt_sn}>
                                    <View style={styles.underline}></View>
                                    <View style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.subtitle}>{option.opt_name}</Text>
                                        {option.opt_req == 'Y' && <Text style={{ marginLeft: 8, fontSize: 16, color: colors.danger }}>(필수선택)</Text>}
                                    </View>
                                    <View>
                                        {option.items.filter(el => el.oit_dp == 'Y').map((item, itemIndex) => <Fragment key={item.oit_sn}>
                                            <TouchableWithoutFeedback onPress={() => handleOptionItemPressed(option, optionIndex, item, itemIndex)}>
                                                <View style={styles.radioBox}>
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        {option.opt_type === 'radio' ? <RadioButton.Android color="#E51A47" status={item.checked ? 'checked' : 'unchecked' } onPress={() => { handleOptionItemPressed(option, optionIndex, item, itemIndex)}} /> :   // 라디오 버튼은 따로 클릭이벤트를 달아야 작동함
                                                        <Checkbox status={item.checked ? 'checked' : 'unchecked'} color="#E51A47" />}
                                                        <Text style={style.text2}>{item.oit_name}</Text>
                                                    </View>
                                                    <Text style={style.text2}>{item.oit_price > 0 && '+'}{number_format_pipe(item.oit_price)}원</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </Fragment>)}
                                    </View>
                                </Fragment>)}
                            </View>
                            <View style={{ height: 10, backgroundColor: '#F5F5F5', marginVertical: 20, }}></View>


                            <View style={{marginHorizontal: 15}}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                    <Text style={{fontSize: 18}}>수량</Text>
                                    <View style={{ flexDirection: 'row', height: 45, width: 133, borderColor: '#E5E5E5', borderWidth: 0.5, alignItems: 'center', justifyContent: 'space-around', borderRadius: 6, }}>
                                        <TouchableWithoutFeedback onPress={handleSubtractAmount}>
                                            <Image source={require('../images/minus.png')} style={{ width: 18, height: 18 }}></Image>
                                        </TouchableWithoutFeedback>
                                        <Text style={style.text2}>{amount}개</Text>
                                        <TouchableWithoutFeedback onPress={handleAddAmount}>
                                            <Image source={require('../images/plus.png')} style={{ width: 18, height: 18 }}></Image>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                                <View style={styles.underline}></View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                    <Text style={style.text2}>총 주문금액</Text>
                                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{number_format_pipe(totalPrice)} 원</Text>
                                </View>
                                <View style={{alignItems: 'flex-end', marginTop: 10}}>
                                    <Text style={{color: '#777777'}}>배달 최소 주문 금액 {number_format_pipe(store.min_order_price)}원</Text>
                                </View>
                            </View>
                            <View style={{ height: 10, backgroundColor: '#F5F5F5', marginVertical: 20, }}></View>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ backgroundColor: '#E51A47', borderTopLeftRadius: 15, borderTopRightRadius: 15, }}>
                    <TouchableOpacity style={styles.footer} onPress={handleAddCart}>
                        <Text style={[style.text2, {color: 'white', fontWeight: 'bold'}]}>{amount}개 담기</Text>
                    </TouchableOpacity>
                </View>
            </>}
        </>
    );
}

const styles = StyleSheet.create({
  titlebox: {
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    width: '100%',
    top: 250,
  },
  subtitle: {fontSize: 18, fontWeight: 'bold'},
  underline: {height: 1, backgroundColor: '#E5E5E5', marginVertical: 20},
  radioBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    height: 50,
    backgroundColor: '#E51A47',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
