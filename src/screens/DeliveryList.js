import React, { useState, useContext, useEffect, useMemo, Fragment } from 'react';
import { Text, Image, View, StyleSheet, ScrollView, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Left, Right, Body } from 'native-base';
import style from '../style/style';
import {Footer} from 'native-base';
import {TextInput} from 'react-native-paper';
import Nodata from '../components/Nodata';
import {navigate} from '../navigation/RootNavigation';
import API from '../api';
import colors from '../appcolors';
import { basicErrorHandler } from '../http-error-handler';
import { number_format_pipe, store_distance_pipe, store_worktime_timeonly_pipe } from '../pipes';
import Loading from '../components/Loading';
import useFocusEffect from '../hooks/useFocusEffect';
import { MemoryContext } from '../contexts/memory-context';
import { http_url_pipe } from '../pipes';


function DeliveryListScreen({ route, navigation }) {
    const { myAddress, baseDeliveryPrice } = useContext(MemoryContext);

    // categories
    const categories = useMemo(() => {
        return route.params.categories;
    }, [ route.params ]);

    // category
    const [ category, setCategory ] = useState();
    useEffect(() => {
        setCategory(route.params.category);
    }, [ route.params ]);

    // data
    const [ stores, setStores ] = useState([]);

    // parameters
    const [ page, setPage ] = useState(1);
    const [ keyword, setKeyword ] = useState('');

    // interface parameters
    const [ mayMore, setMayMore] = useState(true);
    const [ trigger, setTrigger ] = useState();
    const [ loading, setLoading ] = useState(false);

    useFocusEffect(() => {
        if (category) initLoad();
    }, [ category ]);

    const initLoad = () => {
        setStores([]);
        setPage(1);
        setMayMore(true);
        setTrigger(new Date().getTime());
    }

    const onEndReacehd = () => {
        if (!mayMore || loading) return;
        setTrigger(new Date().getTime());
    }

    useEffect(() => {
        if (trigger) {
            setLoading(true);
            const data = {
                ca_id: category.ca_id,
                lat: myAddress?.lat,
                lon: myAddress?.lon,
                keyword: keyword,
                page,
            };
            
            API.post('/store/search_available_stores.php', data)
            .then((data) => {
                setStores(value => {
                    return value.concat(data.data.rows);
                });
                setMayMore(data.data.rows.length === data.data.rows_in_page);
                setPage(val => val + 1);
            })
            .catch(basicErrorHandler)
            .finally(() => { setLoading(false); })
        }
    }, [ trigger ]);

    const renderItem = ({item}) => (<View style={{ paddingHorizontal: 10, backgroundColor: item.onwork == '1' ? 'white': '#f5f5f5', borderColor: colors.borderColor, borderBottomWidth: 1 }}>
        <TouchableWithoutFeedback style={styles.itemView} onPress={() => { navigation.navigate('DeliveryDetail', { sl_sn: item.sl_sn }); }}>
            <View style={{ paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: http_url_pipe(item.pic1 || item.pic2 || item.pic3 || item.pic4) }} style={styles.itemImg}></Image>
                <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.itemName}>{item.sl_title}</Text>
                        {item.new ? (<View style={{ backgroundColor: '#E51A47', height: 20, width: 37, borderRadius: 3, justifyContent: 'center', alignItems: 'center', marginRight: 5, }}>
                            <Text style={{color: 'white'}}>신규</Text>
                        </View>) : null}
                        {item.takeout ? (<View style={{ backgroundColor: '#28B766', height: 20, width: 37, borderRadius: 3, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{color: 'white'}}>포장</Text>
                        </View>) : null}
                        {item.onwork == '0' ? <Text style={{ marginLeft: 'auto', fontSize: 12, color: '#777777' }}>{'영업준비중'}</Text> : <>
                            {item.coupon_available === 'Y' && <View style={{ marginLeft: 'auto', backgroundColor: colors.primary, paddingHorizontal: 7, height: 22, borderRadius: 11, justifyContent: 'center' }}><Text style={{ fontSize: 9, color: 'white', fontWeight: 'bold' }}>{'쿠폰할인'}</Text></View>}
                        </>}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3, }}>
                        <Image source={require('./../images/starFilled.png')} style={{ width: 14, height: 14 }} />
                        <Text style={styles.itemMsg}>{item.review_avg > 0 ? item.review_avg : '-'}</Text>
                        <Text style={{ marginLeft: 7, fontSize: 14, color: '#777777' }}>기본 배달팁 {baseDeliveryPrice ? number_format_pipe(baseDeliveryPrice) : '-'}원</Text>
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', marginVertical: 3, justifyContent: 'space-between', }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('./../images/time.png')} style={{ width: 14, height: 14 }} />
                            <Text style={styles.itemMsg}>{item.start_time && item.end_time && `${item.start_time.substring(0,5)} ~ ${item.end_time.substring(0,5)}` || '-'}</Text>
                        </View>
                        <Text>{store_distance_pipe(item)}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    </View>)

    return (
        <View style={{flex: 1}}>
            {categories && <View style={{height: 50, backgroundColor: 'white'}}>
                <ScrollView horizontal={true} style={{ paddingHorizontal: 15, marginTop: 15 }} showsHorizontalScrollIndicator={false}>
                    {categories.map(category => <Fragment key={category.ca_id}>
                        <TouchableOpacity onPress={() => { 
                            if (loading) return;
                            setCategory(category); 
                        }}>
                            <View style={styles.tag_select}>
                                <Text style={styles.tag_select_text}>{category.ca_name}</Text>
                            </View>
                        </TouchableOpacity>
                    </Fragment>)}    
                </ScrollView>
            </View>}
            {/* 검색바 */}
            <View style={{backgroundColor: 'white', flex: 1}}>
                <View style={{margin: 15}}>
                    <View style={{backgroundColor: 'white'}}>
                        <TextInput
                            theme={{colors: {primary: 'white'}}}
                            borderWidth={1}
                            borderColor="#CCCCCC"
                            underlineColor="transparent"
                            borderRadius={100}
                            width="100%"
                            style={{ width: '100%', height: 42, backgroundColor: 'white', paddingHorizontal: 12, fontSize: 14 }}
                            placeholder="매장명을 입력하세요."
                            placeholderTextColor="#AAAAAA"
                            selectionColor="white"
                            right={<TextInput.Icon style={{backgroundColor: 'white'}} name={require('./../images/search_icon.png')} color={'#E51A47'} />}
                            value={keyword}
                            onChangeText={setKeyword}
                            returnKeyType="send"
                            onSubmitEditing={() => { initLoad(); }}
                        />
                    </View>
                </View>
                
                {/* stores */}
                <FlatList
                    data={stores}
                    keyExtractor={item => item.sl_sn}
                    renderItem={renderItem}
                    onEndReachedThreshold={0.2}
                    onEndReached={onEndReacehd}
                    ListEmptyComponent={loading ? <Loading /> : <Nodata style={{ marginLeft: 15 }}>현재 오픈매장이 없습니다.</Nodata>}
                    ListFooterComponet={loading && stores.length > 0 && <Loading />}
                />
            </View>

            <Footer style={styles.footer}>
                <View
                    style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.footer_touch} onPress={() => { navigate('MyHeartList'); }}>
                        <Left style={styles.footer_design}>
                            <Image source={require('./../images/footer_heart.png')} style={{ width: 15, height: 15, marginRight: 5 }} ></Image>
                            <Text style={[style.text2, {color: 'white'}]}>찜한매장</Text>
                        </Left>
                    </TouchableOpacity>
                    <Image source={require('./../images/verline.png')}></Image>
                    <TouchableOpacity style={styles.footer_touch} onPress={() => { navigate('MyOrderList'); }}>
                        <Body style={styles.footer_design}>
                            <Image source={require('./../images/footer_menu.png')} style={{ width: 14, height: 16, marginRight: 5 }}></Image>
                            <Text style={[style.text2, {color: 'white'}]}>주문내역</Text>
                        </Body>
                    </TouchableOpacity>
                    <Image source={require('./../images/verline.png')}></Image>
                    <TouchableOpacity style={styles.footer_touch} onPress={() => { navigate('Cart'); }}>
                        <Right style={styles.footer_design}>
                            <Image source={require('./../images/footer_cart.png')} style={{ width: 15, height: 15, marginRight: 5 }}></Image>
                            <Text style={[style.text2, {color: 'white'}]}> 장바구니</Text>
                        </Right>
                    </TouchableOpacity>
                </View>
            </Footer>
        </View>
    );
}

const styles = StyleSheet.create({
    tag_select: {
        paddingHorizontal: 15,
        height: 29,
        backgroundColor: '#FEEDEC',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 2,
    },
    tag_unselect: {
        paddingHorizontal: 15,
        height: 29,
        backgroundColor: '#F1F1F1',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 2,
    },
    tag_select_text: {color: '#E51A47'},
    tag_unselect_text: {color: '#777777'},
    footer: {height: 50, backgroundColor: '#E51A47'},
    footer_touch: {alignItems: 'center', flex: 1},
    footer_design: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    root: {flex: 1, backgroundColor: 'white'},
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
    },
    itemMsg: {
        marginLeft: 5,
    },
    delPrice: {
        color: '#777777',
        marginLeft: 4,
    },
    newtakeout: {marginRight: 5},
});

export default DeliveryListScreen;
