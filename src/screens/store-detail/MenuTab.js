import React, { useState, useContext, useEffect, useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import {navigate} from '../../navigation/RootNavigation';
import { ModalAdult } from '../../components/BOOTSTRAP';
import { AuthContext } from '../../contexts/auth-context';
import { AppContext } from '../../contexts/app-context';
import Loading from '../../components/Loading';
import colors from '../../appcolors';
import { number_format_pipe, http_url_pipe, check_adult_pipe } from '../../pipes';


const Badge = ({ name, viewStyle, textStyle }) => {
    return (
        <View style={{ width: 37, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 3, marginLeft: 5, ...viewStyle }}>
            <Text style={{ fontSize: 12, ...textStyle }}>{name}</Text>
        </View>
    );
}


const MenuItem = ({ menu, store, index }) => {
    const { showAlert, showDialog } = useContext(AppContext);
    const { me } = useContext(AuthContext);

    const imgSource = useMemo(() => {
        return menu.mnu_pic ? { uri: http_url_pipe(menu.mnu_pic) } : require('../../images/noimg.png');
    }, [ menu ]);

    const handleMenuPress = () => {
        // 성인 체크
        if (menu.adult_flag == 'Y') {
            const output = check_adult_pipe(me);
            switch(output) {
                case 'need_login': return showAlert('성인인증이 필요합니다. 로그인 하세요.');
                case 'no_adult': return showAlert('성인만 주문할수 있는 상품입니다.');
                case 'need_authenticate': 
                    showDialog('성인인증', '성인인증이 필요합니다.\n계속 진행하시겠습니까?', () => {
                        navigate('IamportAuthentication');
                    });
                    return;
            }
        }

        navigate('DetailMenu', { menu, store });
    }
    
    return (
        <TouchableWithoutFeedback onPress={handleMenuPress}>
            <View style={{ marginHorizontal: 15, paddingVertical: 15, flexDirection: 'row', borderColor: colors.borderColor, borderTopWidth: index > 0 ? StyleSheet.hairlineWidth : 0 }}>
                <View style={{ flex: 1, marginRight: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Text style={{ fontSize: 16, color: colors.textPrimary, fontWeight: 'bold' }} ellipsizeMode="tail" numberOfLines={2} >{menu.mnu_name}</Text>
                        {menu.mnu_represent == 'Y' && <Badge viewStyle={{ backgroundColor: colors.primary }} textStyle={{ color: 'white', fontSize: 12 }} name={'대표'} />}
                        {menu.adult_flag == 'Y' && <Text style={{ color: colors.textPrimary, borderColor: '#FF4848', borderWidth: 2, marginLeft: 5, borderRadius: 11, width: 22, height: 22, textAlign: 'center', textAlignVertical: 'center' }}>19</Text>}
                        {menu.mnu_soldout == 'N' && <Badge viewStyle={{ backgroundColor: 'orange' }} textStyle={{ color: 'white', fontSize: 12 }} name={'품절'} />}
                    </View>
                    <Text style={{ marginTop: 7, marginRight: 6, fontSize: 14, color: '#777777' }} ellipsizeMode="tail" numberOfLines={2} textBreakStrategy="simple">{menu.mnu_soge}</Text>
                    <Text style={{ marginTop: 17, fontSize: 16, color: colors.textPrimary }}>{number_format_pipe(menu.mnu_price) + '원'}</Text>
                </View>
                <Image source={imgSource} style={{ width: 90, height: 90, borderRadius: 5 }} />
            </View>
        </TouchableWithoutFeedback>
    );
}

const CategoryItem = ({ category, expandInfo, setExpandInfo, store }) => {
    const expanded = useMemo(() => {
        const target = expandInfo.find(info => info.key == category.ca_id);
        
        if (!target) return false;
        return target.expanded;
    }, [ category, expandInfo ]);

    return (
        <View style={{ borderColor: colors.gray400, borderBottomWidth: StyleSheet.hairlineWidth }}>
            {/* // header */}
            <TouchableWithoutFeedback onPress={() => { 
                setExpandInfo(value => {
                    const result = [...value];
                    const target = result.find(item => item.key == category.ca_id);
                    target.expanded = !target.expanded;
                    return result;
                });
            }}>
                <View style={{ flexDirection: 'row', height: 50, backgroundColor: '#F9F9F9', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 }}>
                    <Text style={{ fontSize: 18, color: colors.textPrimary }}>{category.ca_name}</Text>
                    <Image source={expanded ? require('../../images/accordionicon1.png') : require('../../images/accordionicon2.png')} style={{ width: 16, height: 7 }} />
                </View>
            </TouchableWithoutFeedback>

            {/* body */}
            {expanded && <View>
                {category.menus.map((menu, index) => <MenuItem key={menu.it_id} menu={menu} store={store} index={index} />)}
            </View>}
        </View>
    );
}

const MenuTab = ({ store, categories }) => {
    const [ expandInfo, setExpandInfo ] = useState();

    useEffect(() => {
        if (categories) {
            setExpandInfo(categories.map(item => ({
                key: item.ca_id,
                expanded: false,
            })));
        }
    }, [ categories ]);

    const [onAdultModal, setOnAdultModal] = useState(false);

	return (
		<>
            {categories && expandInfo ? <>
                {categories.map(category => <CategoryItem key={category.ca_id} category={category} expandInfo={expandInfo} setExpandInfo={setExpandInfo} store={store} />)}
            </> : <Loading />}

            {/* 원산지 */}
            {store && <View style={{ backgroundColor: '#F9F9F9', paddingHorizontal: 15, paddingVertical: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#777777' }}>원산지 표기</Text>
                <Text style={{ marginTop: 10, fontSize: 14, color: '#777777' }}>{store.sl_memo2}</Text>
            </View>}

            <View style={{backgroundColor: '#E5E5E5', height: 1}}></View>

            <ModalAdult open={onAdultModal} cancel={() => setOnAdultModal(false)} confirm={() => {}} />
        </>
	);
}


const styles = StyleSheet.create({
});

export default MenuTab;