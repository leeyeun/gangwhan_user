import React, { useState, useContext, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IMP from 'iamport-react-native';
import API from '../api';
import Loading from '../components/Loading';
import { basicErrorHandler } from '../http-error-handler';
import { AppContext } from '../contexts/app-context';
import { CartContext } from '../contexts/cart-context';
import { order_username_pipe, order_contact_pipe, order_fulladdress_pipe } from '../pipes';


const PayIamportScreen = ({ route, navigation }) => {
	const { logMessage } = useContext(AppContext);
	const { fetchCart } = useContext(CartContext);

	// order
	const [ order, setOrder ] = useState();
	useEffect(() => {
		const od_id = route.params.od_id;
		console.log('od_id',od_id)

		const params = { od_id };
		API.get('/order/get_order.php', { params })
		.then(data => {
			console.log('data.data',data.data)
			setOrder(data.data);
		})
		.catch(basicErrorHandler);
	}, []);
	// end: order

	const [ failed, setFailed ] = useState(false);
	const [ errorMessage, setErrorMessage ] = useState('');
	const callback = (response) => {
		logMessage('iamport', JSON.stringify(response));

		if (response.imp_success == 'true') {
			const { imp_uid, merchant_uid } = response;

			console.log('imp_uid',imp_uid)
			console.log('merchant_uid',merchant_uid)
			// 일반주문일 경우 카트정보 갱신이 필요함
			if (order.od_type == 'P') {
				// iamport 가 프론트와 백엔드로 전송하는 타이밍 이슈가 있어서 5초 늦게 요청
				setTimeout(() => {
					fetchCart();
				}, 5000);
			}
			
			navigation.popToTop();
			navigation.navigate('MyOrderDetail', { od_id: merchant_uid });
		}
		else {
			setErrorMessage(response.error_msg || '결제에 실패했습니다.');
			setFailed(true);
		}
	}

	const data = useMemo(() => {
		if (order) {
			const name = order.od_type == 'P' ? `일반배달(${order.item_name})` : `퀵배달(${order.item_name})`;
			const buyer_name = order_username_pipe(order, 'user');
			const buyer_tel = order_contact_pipe(order, 'user');
			const buyer_addr = order_fulladdress_pipe(order, 'user');

			const info = {
				pg: 'html5_inicis',
				pay_method: order.od_settle_case,
				name: name,
				merchant_uid: order.od_id,
				amount: +order.od_misu,
				buyer_name,
				buyer_email: '',
				buyer_tel,
				buyer_addr,
				app_scheme: order.od_type == 'P' ? 'normal_delivery' : 'quick_delivery',
			};

			console.log('$$',info);
			return info;
		}
	}, [ order ]);

	return (
		<>
			{failed ? <>
				<Text>{errorMessage}</Text>
			</> : <>
				{data ? <View style={{ flex: 1 }}>
					<IMP.Payment
						userCode={'imp08359128'}  // 가맹점 식별코드
						// tierCode={'AAA'}      // 티어 코드: agency 기능 사용자에 한함
						loading={<Loading />} // 웹뷰 로딩 컴포넌트
						data={data}           // 결제 데이터
						callback={callback}   // 결제 종료 후 콜백
					/>
				</View> : <Loading />}
			</>}
		</>
	);
}


const styles = StyleSheet.create({
});

export default PayIamportScreen;