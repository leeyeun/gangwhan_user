import React, { useMemo } from 'react';
import { View, Image } from 'react-native';

const Stars = ({stars}) => {
    const filled = useMemo(() => {
        return Math.round(stars);
    }, [ stars ]);

    const offCount = useMemo(() => {
        return 5 - filled;
    }, [filled]);

    return (
        <View style={{ flexDirection: 'row' }}>
            {Array.from({length: filled}, (v, index) => <Image key={String(index)} source={require('../images/reviewstar.png')} style={{ width: 17, height: 17, marginRight: 2 }} />)}
            {Array.from({length: offCount}, (v, index) => <Image key={String(index)} source={require('../images/reviewstarempty.png')} style={{ width: 17, height: 17, marginRight: 2 }} />)}
        </View>
    );
}

export default Stars;