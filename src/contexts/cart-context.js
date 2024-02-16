import React, { createContext, useState, useEffect, useContext } from 'react';
import messaging from '@react-native-firebase/messaging';
import API from '../api';
import { basicErrorHandler } from '../http-error-handler';
import { AppContext } from './app-context';
import { AuthContext } from './auth-context';


const CartContext = createContext({});

const CartContextProvider = ({ children }) => {
    const { showSnackbar, isConnected } = useContext(AppContext);
    const { me } = useContext(AuthContext);

    const [ cartInfo, setCartInfo ] = useState();
    useEffect(() => {
        if (isConnected) {
            fetchCart();
        }
    }, [ isConnected ]);

    const fetchCart = async () => {
        const token = await messaging().getToken();
        API.post('/cart/get_cart_info.php', { token })
        .then(data => {
            setCartInfo(data.data);
        })
        .catch(basicErrorHandler);
    }

    const addCart = async (data, callback) => {
        const token = await messaging().getToken();
        const info = {
            ...data,
            token,
        };
        if (me) info['mb_id'] = me.mb_id;

        API.post('/cart/append_menus.php', info)
        .then(() => {
            showSnackbar('장바구니에 추가했습니다.');
            fetchCart();
            callback();
        })
        .catch(error => {
            console.log(error);
            basicErrorHandler(error);
        });
    }

    const modifyItemAmount = async (ct_id, it_qty, callback) => {
        const data = {
            ct_id,
            it_qty,
        };
        API.post('/cart/modify_menu_quantity.php', data)
        .then(() => { 
            fetchCart();
            callback();
        })
        .catch(basicErrorHandler);
    }

    const removeCartItem = async (item, callback) => {
        const data = {
            ct_id: item.ct_id,
            it_qty: '0',
        };
        API.post('/cart/modify_menu_quantity.php', data)
        .then(() => {
            fetchCart();
            callback();
        })
        .catch(basicErrorHandler);
    }

    const removeAllCartItems = async (callback) => {
        const token = await messaging().getToken();
        const data = {
            token,
        };
        API.post('/cart/remove_all_menus.php', data)
        .then(() => {
            fetchCart();
            callback();
        })
        .catch(basicErrorHandler);
    }

    // 배달 / 포장
    const [ division, setDivision ] = useState('delivery');

	return (
		<CartContext.Provider  
			value={{    
                cartInfo,

				addCart,
                modifyItemAmount,
                removeCartItem,
                removeAllCartItems,
                modifyItemAmount,
                fetchCart,

                division,
                setDivision,
			}}
		>
			{children} 
		</CartContext.Provider>
	);
};

export {
	CartContext,
	CartContextProvider,
};