import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import navigateWithMessaging from '../hooks/navigateWithMessaging';


const useFcmInitiation = () => {
    useEffect(() => {
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification caused app to open from background state:', remoteMessage?.notification);
            navigateWithMessaging(remoteMessage.data, false);
        });

        messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            console.log('Notification caused app to open from quit state:', remoteMessage?.notification);
            if (remoteMessage) navigateWithMessaging(remoteMessage.data, true);
        });
    }, []);
}


export default useFcmInitiation;