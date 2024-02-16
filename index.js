/**
 * @format
 */

import React from 'react';
import {AppRegistry, LogBox} from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import {name as appName} from './app.json';
import PushNotification from './src/config/push-notification.config';
import colors from './src/appcolors';
import { AppContextProvider } from './src/contexts/app-context';
import Test3Screen from './src/screens/Test3';
import { AuthContextProvider } from './src/contexts/auth-context';
import { CartContextProvider } from './src/contexts/cart-context';
import { MemoryContextProvider } from './src/contexts/memory-context';
import App from './App';


const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: colors.primary,
		accent: colors.accent,
	},
};


// const Main = () => {
//     return (
//         <PaperProvider theme={ theme }>
//             <AppContextProvider>
//                 <AuthContextProvider>
//                     <MemoryContextProvider>
//                         <Test3Screen></Test3Screen>
//                     </MemoryContextProvider>
//                 </AuthContextProvider>
//             </AppContextProvider>
//         </PaperProvider>
//     )
// }


const Main = () => {
    return (
        <PaperProvider theme={ theme }>
            <AppContextProvider>
                <AuthContextProvider>
                    <MemoryContextProvider>
                        <CartContextProvider>
                            <App />
                        </CartContextProvider>
                    </MemoryContextProvider>
                </AuthContextProvider>
            </AppContextProvider>
            
        </PaperProvider>
    );
}

PushNotification.init();

LogBox.ignoreAllLogs();
AppRegistry.registerComponent(appName, () => Main);
