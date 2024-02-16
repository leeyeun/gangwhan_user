import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '../appcolors';
import ActivityIndicator from './ActivityIndicator';

export default ({mode, disabled, children, loading, style, textStyle, ...props}) => {
	if (disabled) {
		return (
			<View style={{...styles.wrapper, backgroundColor: colors.gray400, ...style }}>
				<Text style={{...styles.text, color: 'white', ...textStyle}}>{children}</Text>
				{loading && <ActivityIndicator style={{ position: 'absolute'}}  />}
			</View>
			
		);
	}
	
	else return (
		<TouchableOpacity onPress={() => {
			if (!disabled && !loading && props.onPress) props.onPress();
		}}>
			<View style={{...styles.wrapper, borderWidth: mode == 'outlined' ? 1 : 0, backgroundColor: mode == 'outlined' ? 'white' : colors.primary, ...style }}>
				<Text style={{...styles.text, color: mode == 'outlined' ? colors.primary : 'white', ...textStyle }}>{children}</Text>
			</View>
		</TouchableOpacity>
	);
}


const styles = StyleSheet.create({
	wrapper: {
		height: 45,
		paddingHorizontal: 18,
		borderColor: colors.primary,
		borderRadius: 5,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontSize: 16, 
	},
	
});