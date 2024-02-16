import { useEffect, useState } from "react";
import { Keyboard } from "react-native";



function useKeyboardOpen() {
	useEffect(() => {
		Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
		Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
	}, []);

	const [ keyboardOpen, setKeyboardOpen ] = useState(false);
	const _keyboardDidShow = () => setKeyboardOpen(true);
	const _keyboardDidHide = () => setKeyboardOpen(false);

	return keyboardOpen;
}

export default useKeyboardOpen;