import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import API from '../api';
import { Platform } from 'react-native';
import { basicErrorHandler } from '../http-error-handler';

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
	const [me, setMe] = useState(null);

	// 앱 실행될때 마다 내정보 싱크
	useEffect(() => {
		fetchMyinfo();
	}, []);

	const setAuthInfo = async (member, jwt) => {
		try {
			await AsyncStorage.setItem('me', JSON.stringify(member));
			await AsyncStorage.setItem('jwt', jwt);
			setMe(member);
		}
		catch(error) {
			// save error.
			console.error(error);
		}
	}

	const clearAuthInfo = async () => {
		try {
			await AsyncStorage.setItem('me', '');
			await AsyncStorage.setItem('jwt', '');
			setMe(null);
		}
		catch(error) {
			// save rror
			console.error(error);			
		}
	};

	// call after myinfo changed
	const fetchMyinfo = async () => {
		try {
			const myinfo = await AsyncStorage.getItem('me');

			if (myinfo) {
				const mb_id = JSON.parse(myinfo).mb_id;
				const params = { mb_id };
				const result = await API.get('/member/get_myinfo.php', { params });
				await setAuthInfo(result.data, result.data.jwt);
			}
		}
		catch(error) {
			clearAuthInfo();
			basicErrorHandler(error);
		}
	}

	// 앱을 실행할때마다 FCM 토큰 업데이트
	useEffect(() => {
		if (me) updateFCMToken();
	}, [ me ]);

	const updateFCMToken = async () => {
		if (Platform.OS === 'ios') {
			// Requesting permission
			const authorizationStatus = await messaging().requestPermission();
		}

		const token = await messaging().getToken();
		if (token) {
			API.post('/member_token.php', {
				mb_id: me.mb_id,
				token
			});
		}
		else {
			console.error('no FCM token.');
		}
	}

	return (
		<AuthContext.Provider  
			value={{    
				me,
				setAuthInfo,
				clearAuthInfo,
				fetchMyinfo,
			}}
		>
			{children} 
		</AuthContext.Provider>
	);
};

export {
	AuthContext,
	AuthContextProvider
};