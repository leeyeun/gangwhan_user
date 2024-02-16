import { useCallback } from 'react';
import { useFocusEffect as RNUseFocusEffect } from '@react-navigation/native';

function useFocusEffect(callback, dependencies) {
    // 화면이 보일때마다 초기화
	RNUseFocusEffect(
		useCallback(callback, dependencies)
	);
}

export default useFocusEffect;