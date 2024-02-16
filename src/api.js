import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import { Platform } from 'react-native';
import globals from './globals';


const API = Axios.create({
	baseURL: globals.baseURL + '/jax'
});

const getQueryString = (queries) => {
	if (!queries) return '';
    return Object.keys(queries).reduce((result, key) => {
        return [...result, `${encodeURIComponent(key)}=${encodeURIComponent(queries[key])}`]
    }, []).join('&');
};

// request interceptor
API.interceptors.request.use(async function (config) {
	const jwt = await AsyncStorage.getItem('jwt');
	
	if (config.method === 'post' || config.method === 'put') {
		if (!(config.data instanceof FormData) && typeof(config.data) !== 'string') {
			config.headers = { 
				'Authorization': jwt,
				'Content-Type': 'application/x-www-form-urlencoded',
				'Os': Platform.OS,
				'Appversion': (globals.version * 10).toFixed(1),
			}
			for(let prop in config.data) {
				if (config.data[prop] === true) config.data[prop] = 1;
				else if (config.data[prop] === false) config.data[prop] = 0;
				else if (config.data[prop] == null) config.data[prop] = '';     // php 에서 문자열 'null' 을 받으므로
			}

			config.data = getQueryString(config.data);
		}
		else {
			config.headers = { 
				'Authorization': jwt,
				'Content-Type': 'application/json',
				'Os': Platform.OS,
				'Appversion': globals.version * 10,		// 강화엔 서버는 괜찮지만, 표준에 의하면 언더바 는 key 로 사용하면 안됨, 그리고 첫글자가 대문자여야함
			}
		}		
	}
	else {
		config.headers = { 
			'Authorization': jwt,
			'Os': Platform.OS,
			'Appversion': globals.version * 10,
		}
	}

	// console.log('API Request:', config);

	return config;
});
 

// response interceptor
API.interceptors.response.use(function (response) {
	switch(response.data.result) {
		case '0':
			// console.log('API Response:', response);
			return response.data;
		case '1':
			console.log('API Fail: ', response);
			const error = new Error(response.data.message);
			error.code = response.data.error_code;
			throw error;
		default: 
			console.error('API FAIL:', response);
			throw new Error(response.data);
	}
}, function (error) {
	if (error.response) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		console.log('path1');
		console.log(error.response.data);
		console.log(error.response.status);
		console.log(error.response.headers);
	} else if (error.request) {
		// The request was made but no response was received
		// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
		// http.ClientRequest in node.js
		console.log('path2');
		console.log(error.request);
	} else {
		// Something happened in setting up the request that triggered an Error
		console.log('path3');
		console.log('Error', error.message);
	}

	return Promise.reject(error);
});

export default API;