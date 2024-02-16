import React from 'react';
import { Text } from 'react-native';

import colors from '../appcolors';


const Nodata = ({ children, style }) => {
    return (
        <Text style={{ marginVertical: 20, fontSize: 16, color: colors.textSecondary, ...style }}>{children || '데이터가 없습니다.'}</Text>
    );
}

export default Nodata;