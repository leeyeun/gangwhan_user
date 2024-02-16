import React, { useMemo } from 'react';
import {Image, View, StatusBar, useWindowDimensions} from 'react-native';

export default function SplashScreen1() {
  const dimensions = useWindowDimensions();
  
  const sizeInfo = useMemo(() => {
    const horizontalPadding = 50;
    const width = dimensions.width - horizontalPadding * 2;
    const height = width / 1259 * 463;
    return { width, height };
  }, [ dimensions ])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <StatusBar hidden />
      {sizeInfo && <Image
        source={require('../images/splashimg.png')}
        style={{ flex: 1, resizeMode: 'contain', width: sizeInfo.width, height: sizeInfo.height }} />}
    </View>
  );
}
