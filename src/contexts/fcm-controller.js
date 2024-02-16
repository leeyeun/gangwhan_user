import React, { useContext, useState, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';

import { NotificationContext } from './notification-context';



// background (only data, not notification)
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log(remoteMessage);
});


const FcmController = () => {
    const { push, setTrigger } = useContext(NotificationContext);

    // foreground push control
    useEffect(() => {
		const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log(remoteMessage);
            const title = remoteMessage.notification.title;
            const message = remoteMessage.notification.body;
            
            push('gwn_default', title, message, remoteMessage.data);
            setTrigger(new Date().getTime());
		});

		return unsubscribe;
	}, []);
    // end: foreground push control

	return null;
};

export default FcmController;