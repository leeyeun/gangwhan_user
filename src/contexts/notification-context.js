import React, { createContext, useState, useEffect } from 'react';
// import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";


const NotificationContext = createContext({});

const NotificationContextProvider = ({ children }) => {

    const testPush = () => {
        PushNotification.localNotification({
            channelId: 'gwn_default',
            title: "My Notification Title", // (optional)
            message: "My Notification Message", // (required)
        });
    }

    const push = (channelId, title, message, data) => {
        PushNotification.localNotification({ channelId: channelId, title, message, userInfo: data });
    }

    const [ trigger, setTrigger ] = useState();

	return (
		<NotificationContext.Provider  
			value={{    
                testPush,
                push,

                trigger,
                setTrigger,
			}}
		>
			{children} 
		</NotificationContext.Provider>
	);
};

export {
	NotificationContext,
	NotificationContextProvider
};