import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ScrollView, FlatList, Alert, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import IMP from 'iamport-react-native';


import Loading from '../components/Loading';
import { AppContext } from '../contexts/app-context';
import { AuthContext } from '../contexts/auth-context';
import API from '../api';
import { basicErrorHandler } from '../http-error-handler';


const ImportAutuenticationScreen = ({ navigation, route }) => {
	const { showAlert, showSnackbar }	= useContext(AppContext);
	const { me, fetchMyinfo } = useContext(AuthContext)
	
	useEffect(() => {
		if (!me) {
			showAlert('로그인이 먼저 필요합니다.');
			return navigation.goBack();
		}

		// const mb_name = route.params?.mb_name;
		// const mb_hp = route.params?.mb_hp;
		// if (!mb_name || !mb_hp) {
		// 	showAlert('성함 및 핸드폰번호가 필요합니다.');
		// 	navigation.goBack();
		// }
	}, [ me ]);

	function callback(response) {
		console.log(response);

		if (!response.success) {
			showAlert('본인인증확인이 취소되었습니다.');
			return navigation.goBack();
		}

		const imp_uid = response.imp_uid;

		const data = { 
			mb_id: me.mb_id,
			imp_uid 
		};
		API.post('/member/confirm_danal_auth.php', data)
		.then(data => {
			const imp_auth_uid = data.data.imp_auth_uid;
			const mb_birth = data.data.mb_birth;
			console.log(imp_auth_uid, mb_birth);

			showSnackbar('본인확인이 완료되었습니다.');
			fetchMyinfo();
			navigation.goBack();
		})
		.catch(basicErrorHandler);
	}
	
	/* [필수입력] 본인인증에 필요한 데이터를 입력합니다. */
	const data = {
		merchant_uid: `gwn_${new Date().getTime()}`,
		// company: '오성패밀리',
		// carrier: 'KT',
		// name: route.params?.mb_name,
		// phone: route.params?.mb_hp,
		// min_age: '',
	};

	return (
		<>
			<IMP.Certification
				userCode={'imp08359128'}  	// 가맹점 식별코드
				loading={<Loading />} 		// 웹뷰 로딩 컴포넌트
				data={data}           		// 본인인증 데이터
				callback={callback}   		// 본인인증 종료 후 콜백
			/>
		</>
	);
}


const styles = StyleSheet.create({
});

export default ImportAutuenticationScreen;