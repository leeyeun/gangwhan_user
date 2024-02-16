import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import API from '../api';
import { basicErrorHandler } from '../http-error-handler';
import { AppContext } from '../contexts/app-context';
import { Platform } from 'react-native';


const MemoryContext = createContext({});

const MemoryContextProvider = ({ children }) => {
	const { isConnected } = useContext(AppContext);

	// categories
    const [categories, setCategories] = useState();
    useEffect(() => {
		if (isConnected) {
			API.get('/category_list.php')
			.then(data => setCategories(data.rowdata))
			.catch(basicErrorHandler);
		}
    }, [ isConnected ]);
	// end: categories

	// app common info
	const [ appVersionInfo, setAppVersionInfo ] = useState();
	const [ oneshotNotice, setOneshotNotice ] = useState();
	const [ deliveryPolicy, setDeliveryPolicy ] = useState();
	useEffect(() => {
		if (isConnected) {
			API.get('/common/get_app_common_info.php')
			.then(data => {
				setAppVersionInfo(data.data.app_version[Platform.OS]);
				setOneshotNotice(data.data.oneshot_notice);
				setDeliveryPolicy(data.data.delivery_policy_info);
			})
			.catch(basicErrorHandler);
		}
	}, [ isConnected ]);
	// end: app common info

	// 기본배달비용
	const baseDeliveryPrice = useMemo(() => {
		if (deliveryPolicy) {
			let basePrice = +deliveryPolicy.base_price;
			basePrice = Math.round(basePrice * 1.1);
			return basePrice;
		}
	}, [ deliveryPolicy ]);
	
	// my address
	const [ myAddress, setMyAddress ] = useState();
	useEffect(() => {
		AsyncStorage.getItem('myaddress')
		.then(address => {
			if (address) setMyAddress(JSON.parse(address));
		});
	}, [ ]);
	const saveMyAddress = async (address) => {
		if ((address.road_address || address.legal_address) && address.address_detail && address.lat && address.lon) {
			await AsyncStorage.setItem('myaddress', JSON.stringify(address));
			setMyAddress(address);
		}
		else {
			throw new Error('주소정보를 저장할 수 없습니다.');
		}
	}
	const clearMyAddress = () => {
		AsyncStorage.removeItem('myaddress')
		.then(() => {
			setMyAddress(null);
		});
	}
	// end: my address

	

	return (
		<MemoryContext.Provider  
			value={{    
				categories,
				
				appVersionInfo,
				oneshotNotice,
				
				deliveryPolicy,
				baseDeliveryPrice,
				
				myAddress,
				saveMyAddress,
				clearMyAddress,
			}}
		>
			{children} 
		</MemoryContext.Provider>
	);
};

export {
	MemoryContext,
	MemoryContextProvider
};