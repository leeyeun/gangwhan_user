import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, StatusBar } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {navigate} from '../../navigation/RootNavigation';
import style from '../../style/style';
import Loading from '../../components/Loading';
import Nodata from '../../components/Nodata';
import { number_format_pipe, order_pay_method_pipe, order_pay_price_pipe, order_state_pipe } from '../../pipes';
import useGetMyOrders from '../../api/useGetMyOrders';


const labels = ['주문완료', '상품 준비중', '배달중', '배달완료'];
const packageLabels = ['주문완료', '상품 준비중', '구매완료' ];
const quickLabels = ['주문완료', '픽업전', '배달중', '배달완료'];


const customStyles = {
  stepIndicatorSize: 12,
  currentStepIndicatorSize: 12,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#E51A47',
  stepStrokeWidth: 0,
  stepStrokeFinishedColor: '#E51A47',
  stepStrokeUnFinishedColor: '#E5E5E5',
  separatorFinishedColor: '#E51A47',
  separatorUnFinishedColor: '#E5E5E5',
  stepIndicatorFinishedColor: '#E51A47',
  stepIndicatorUnFinishedColor: '#E5E5E5',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: 'transparent',
  stepIndicatorLabelFinishedColor: 'transparent',
  stepIndicatorLabelUnFinishedColor: 'transparent',
  labelColor: 'black',
  labelSize: 14,
  currentStepLabelColor: '#E51A47',
  padding: 0,
  margin: 0,
};


const order_step_pipe = (order) => {
    switch(order.od_state) {
        case 'accepted':
        case 'taken': return 1;
        case 'ondelivery': return 2; 
        case 'delivered': return 3;
        default: return 0;
    }
}

const package_order_step_pipe = (order) => {
    switch(order.od_state) {
        case 'accepted': return 1;
        case 'delivered': return 2;
        default: return 0;
    }
}


const Order = ({item}) => {
    return <>
        <View style={{ backgroundColor: 'white', paddingVertical: 20, paddingHorizontal: 15, width: '100%', borderRadius: 5, marginVertical: 8, }}>
            <TouchableOpacity onPress={() => { navigate('MyOrderDetail', { od_id: item.od_id }); }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: -10, }}>
                    <Text style={style.text2}> 주문번호{'   '} {item.od_id} </Text>
                    <Image source={require('../../images/rightbtn.png')}></Image>
                </View>
            </TouchableOpacity>
            
            <View style={[style.underLine, {marginVertical: 10}]}></View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 10, }}>
                <Text style={[style.text2, {fontWeight: '600', marginRight: 44}]}>상품명</Text>
                <Text style={{...style.text2, flex: 1 }} numberOfLines={1} ellipsizeMode="tail">{item.item_name}</Text>
            </View>
            <View style={styles.title}>
                <Text style={[style.text2, styles.title1]}>결제일시</Text>
                <Text style={style.text2}>{item.od_misu == 0 ? item.od_receipt_time : '미결제'}</Text>
            </View>
            <View style={styles.title}>
                <Text style={[style.text2, styles.title1]}>결제방법</Text>
                <Text style={style.text2}>{order_pay_method_pipe(item)}</Text>
            </View>
            <View style={styles.title}>
                <Text style={[style.text2, styles.title1]}>결제금액</Text>
                <Text style={style.text2}>{number_format_pipe(order_pay_price_pipe(item))}원</Text>
            </View>
            <View style={[styles.title, { marginBottom: 0 }]}>
                <Text style={[style.text2, styles.title1]}>주문상태</Text>
                <Text style={style.text2}>{order_state_pipe(item)}</Text>
            </View>
            
            {item.od_state != 'canceled' && <View style={{ marginTop: 25, marginHorizontal: -10 }}>
                {item.od_type == 'Q' ? <StepIndicator
                        customStyles={customStyles}
                        currentPosition={order_step_pipe(item)}
                        labels={quickLabels}
                        stepCount={4}
                    /> : <>
                    {item.od_delv_flag == 'D' ? <StepIndicator
                        customStyles={customStyles}
                        currentPosition={order_step_pipe(item)}
                        labels={labels}
                        stepCount={4}
                    /> : <StepIndicator
                        customStyles={customStyles}
                        currentPosition={package_order_step_pipe(item)}
                        labels={packageLabels}
                        stepCount={3}
                    />}
                </>}
            </View>}
        </View>
    </>
};

export default function MyOrderList() {
    const [ page, setPage ] = useState(1);
    const [ trigger, setTrigger ] = useState();
    const { loading, fetched, rows } = useGetMyOrders(page, setPage, trigger);

    const onEndReacehd = () => { console.log('path1'); setPage(page => page + 1); }

    const handleRefresh = () => { setTrigger(new Date().getTime()); }

    const renderItem = ({ item }) => (<Order item={item} />);

    return <>
        <StatusBar barStyle="dark-content" backgroundColor={'white'} />


        <FlatList
            data={rows}
            keyExtractor={item => item.od_id}
            onEndReachedThreshold={0.2}
            onEndReached={onEndReacehd}
            onRefresh={handleRefresh}
            refreshing={false}
            ListEmptyComponent={fetched && <Nodata style={{ marginLeft: 20 }}>주문내역이 없습니다.</Nodata>}
            ListFooterComponent={loading && <Loading />}
            renderItem={renderItem}
        />
    </>;
}



const styles = StyleSheet.create({
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    title1: {fontWeight: '600', marginRight: 30},
});
