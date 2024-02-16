import React, { useMemo } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

import globals from '../globals';


const PolicyScreen = ({ route }) => {
    const code = useMemo(() => {
        return route.params?.code;
    }, [ route.params ]);

	return (
		<View style={{ flex: 1 }}>
            {code && <WebView 
                source={{ uri: globals.baseURL + '/views/policy.php?code=' + code }}
                onMessage={(event) => { handleWebviewMessage(event.nativeEvent.data); }}
            />}
        </View>
	);
}


export default PolicyScreen;