import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import { resetRoot } from '../navigation/RootNavigation';
import colors from '../appcolors';


const JoinDoneScreen = ({ navigation, route }) => {

	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../images/ordercheck.png')} style={{ width: 62, height: 62 }} />
                <Text style={{ marginTop: 20, fontSize: 24, color: colors.textPrimary, textAlign: 'center' }}><Text style={{ fontWeight: 'bold' }}>회원가입</Text>이{'\n완료되었습니다.'}</Text>
                <Text style={{ marginTop: 20, fontSize: 16, color: colors.textPrimary }}>이제부터 강화N을 원활히 이용가능 합니다.</Text>
            </View>
            
            <View style={{ margin: 15 }}><TouchableOpacity onPress={() => { resetRoot('Main') }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderRadius: 5, height: 45 }}>
                    <Image source={require('../images/home_icon.png')} style={{ width: 15, height: 15 }} />
                    <Text style={{ marginLeft: 5, color: 'white', fontSize: 16  }}>홈으로</Text>
                </View>
            </TouchableOpacity></View>

        </View>
	);
}


const styles = StyleSheet.create({
});

export default JoinDoneScreen;