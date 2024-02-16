import React, { useState, useContext, useEffect, useMemo, Fragment } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, useWindowDimensions, TouchableWithoutFeedback, Linking } from 'react-native';
import {Header, Left, Right} from 'native-base';
import style from '../style/style';
import {navigate} from '../navigation/RootNavigation';
import Swiper from 'react-native-swiper';
import { MemoryContext } from '../contexts/memory-context';
import API from '../api';
import Loading from '../components/Loading';
import colors from '../appcolors';
import { basicErrorHandler } from '../http-error-handler';
import OneshotModal from './main/OneshotModal';
import moment from 'moment';
import { AppContext } from '../contexts/app-context';
import { address_pipe } from '../pipes';


const validSecondCategories = [ '10', '30' ];

export const MainCircleButton = ({title, source, onPress}) => {
    return (
        <TouchableOpacity style={{alignItems: 'center', resizeMode: 'contain'}} onPress={onPress}>
            <Image source={source} style={{width: 70, height: 70}}></Image>
            <Text style={[style.text2, {marginTop: 10}]}>{title}</Text>
        </TouchableOpacity>
    );
};

function MainScreen({navigation}) {
    // main categories
    const { categories, deliveryPolicy } = useContext(MemoryContext);
    const { showAlert } = useContext(AppContext);
    // end: main categories

    // banners
    const [ banners, setBanners ] = useState();
    const [ bannerTimeout, setBannerTimeout ] = useState(4);
    useEffect(() => {
        API.get('/banner/get_available_banners.php')
        .then(data => {
            setBanners(data.data.banners);
            setBannerTimeout(+data.data.banner_timeout);
        })
        .catch(basicErrorHandler);

        // API.get('/banner_list.php')
        // .then(data => { setBanners(data.rowdata)})
        // .catch(basicErrorHandler);
    }, []);

    const [bannerState, setBannerState] = useState(1);
    const [pauseBtn, setPauseBtn] = useState(false);
    function twolength(n) {
        return (n < 10 ? '0' : '') + n;
    }
    // end: banners

    const handleCategoryClick = (category) => {
        if (category.ca_name == '퀵배달') {
            const now = moment();
            const dateString = now.format('YYYY-MM-DD');
            const startTime = moment(`${dateString} ${deliveryPolicy.quick_start_time}`);
            const endTime = moment(`${dateString} ${deliveryPolicy.quick_end_time}`);
            // console.log(startTime.format('YYYY-MM-DD HH:mm'));
            // console.log(endTime.format('YYYY-MM-DD HH:mm'));
            if (startTime.isAfter(now) || endTime.isBefore(now)) {
                showAlert(`퀵배달 가능시간(${deliveryPolicy.quick_start_time} ~ ${deliveryPolicy.quick_end_time})이 아닙니다.`);
            } 
            else {
                navigation.navigate('QuickDelivery');
            }
        }
        else if (validSecondCategories.indexOf(category.ca_id) > -1) {
            navigation.navigate('DeliveryFood', { category });
        }
        else {
            navigation.navigate('DeliveryList', { category, title: category.ca_name });
        }
    }

    const { myAddress } = useContext(MemoryContext);

    const dimensions = useWindowDimensions();
    const categoryItemWidth = useMemo(() => {
        return (dimensions.width - 30) / 4;
    }, [ dimensions ]);

    const bannerHeight = useMemo(() => {
        return (dimensions.width / 800 * 480);
    }, [ dimensions ]);

    return (
        <View style={{flex: 1}}>
            <Header iosBarStyle={'dark-content'} androidStatusBarColor="white" style={{height: 50, backgroundColor: 'white'}}>
                <Left>
                    <Image source={require('./../images/appbar_icon.png')} style={{width: 63, height: 25, marginLeft: 10}}></Image>
                </Left>
                <Right>
                    <TouchableOpacity onPress={() => { navigate('MyMenuHome'); }} style={{ padding: 10 }}>
                        <Image source={require('./../images/main_drawer.png')} style={{width: 20, height: 16}}></Image>
                    </TouchableOpacity>
                </Right>
            </Header>

            {banners ? <>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* 배너 */}
                    <View style={{ height: bannerHeight }}>
                        <Swiper
                            containerStyle={{ height: '100%' }}
                            autoplay={pauseBtn ? false : true}
                            showsPagination={false}
                            autoplayTimeout={bannerTimeout}
                            paginationStyle={{backgroundColor: 'grey'}}
                            onIndexChanged={(idx) => { 
                                setBannerState(idx + 1); 
                            }}
                            // onMomentumScrollEnd={(e, state, context, total) => setBannerState(state.index + 1) }
                        >
                            {banners.map((item) => {
                                return (
                                    <TouchableWithoutFeedback key={item.bn_id} onPress={() => { 
                                        if (item.bn_url) Linking.openURL(item.bn_url);
                                    }}>
                                        <Image source={{ uri: item.bn_img }} style={{ resizeMode: 'cover', width: '100%', height: '100%' }}/>
                                    </TouchableWithoutFeedback>
                                );
                            })}
                        </Swiper>

                        <View style={{ position: 'absolute', right: 0, bottom: 20 }}>
                            <TouchableOpacity onPress={() => { setPauseBtn(val => !val); }}>
                                <View style={{ backgroundColor: 'rgba(0,0,0,.6)', height: 35, width: 105, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}>
                                    <Text style={{fontWeight: 'bold', color: 'white'}}>
                                        {twolength(bannerState)}
                                    </Text>
                                    <Text style={{color: 'white'}}>/{twolength(banners.length)}</Text>
                                    <View style={{ backgroundColor: 'white', height: 20, width: 1, marginHorizontal: 10 }}></View>
                                    <Image source={require('../images/pause.png')} style={{marginLeft: 5}}></Image>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* end: 배너 */}

                    {/* 카테고리 */}
                    {categories ? <View style={{backgroundColor: 'white'}}>
                        <View style={{margin: 15}}>
                            {/* 내 주소 */}
                            <TouchableOpacity style={{ height: 45, borderRadius: 40, borderColor: '#CCCCCC', borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, marginBottom: 10 }} onPress={() => {  navigation.navigate('AddressInput') }}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image source={require('./../images/address_left.png')} style={{ width: 16, height: 23 }}></Image>
                                    <Text style={[style.text2, {paddingHorizontal: 10}]}>{myAddress ? address_pipe(myAddress) : '배송주소를 설정하세요.'}</Text>
                                </View>
                                <View>
                                    <Image source={require('./../images/address_right.png')} style={{ width: 24, height: 24 }} />
                                </View>
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {categories.map(category => <Fragment key={category.ca_id}>
                                    <TouchableWithoutFeedback onPress={() => { handleCategoryClick(category) }}>
                                        <View style={{ width: categoryItemWidth, alignItems: 'center', paddingVertical: 20, borderColor: colors.borderColor, borderBottomWidth: 1 }}>
                                            <Image style={{ width: 70, height: 70 }} source={{ uri: category.cate_img }} />
                                            <Text style={{ marginTop: 10, fontSize: 16 }}>{category.ca_name}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </Fragment>)}
                            </View>
                        </View>
                    </View> : <Loading />}

                    <View style={{ flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{fontSize: 13, color: '#555555'}} onPress={() => { navigation.navigate('Policy', { code: 'provision', intend: 'show' }); }}>이용약관</Text>
                        <Text style={{color: '#CCCCCC'}}> | </Text>
                        <Text style={{fontSize: 13, color: '#555555'}} onPress={() => { navigation.navigate('Policy', { code: 'privacy', intend: 'show' }); }} >개인정보처리방침</Text>
                        <Text style={{color: '#CCCCCC'}}> | </Text>
                        <Text style={{fontSize: 13, color: '#555555'}} onPress={() => { navigation.navigate('Policy', { code: 'useguide2', intend: 'show' }); }} >위치기반 서비스약관</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', paddingVertical: 15 }}>
                        <Text style={{fontSize: 13, color: '#555555', fontWeight: 'bold'}}>오성패밀리</Text>
                        <Text style={{ fontSize: 12, color: '#555555', textAlign: 'center', marginVertical: 5 }}>
                        대표자: 김형석 | 사업자등록번호: 808-08-01980{'\n'}주소: 인천 강화군 길상면 길상로 294, 201~203호 | 대표번호: 1877-7147{'\n'}통신판매업신고번호: 제 2021-인천강화-0074 호
                        </Text>
                        <Text style={{fontSize: 12, color: '#999999', textAlign: 'center'}}>
                        강화N은 통신판매 중개자이며 판매 당사자가 아닙니다.{'\n'}따라서
                        강화N은 상품의 거래정보 및 판매에 대한 책임을 지지 않습니다.
                        </Text>
                    </View>
                </ScrollView>
            </> : <Loading />}

            <OneshotModal />
        </View>
    );
}

export default MainScreen;
