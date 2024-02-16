import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import colors from '../appcolors';


const Loading = () => {
    return (
        <View style={{ minHeight: 100, height: '100%', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
}

export default Loading;