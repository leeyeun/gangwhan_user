import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ScrollView, FlatList, Alert, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import { AppContext } from '../contexts/app-context';
import { MemoryContext } from '../contexts/memory-context';
import { NotificationContext } from '../contexts/notification-context';
import Button from '../components/Button';
import Loading from '../components/Loading';
import globals from '../globals';
import colors from '../appcolors';
import cstyles from '../cstyles';
import {} from '../pipes';
import { basicErrorHandler } from '../http-error-handler';
import API from '../api';


const Test3Screen = ({ navigation, route }) => {
	const { showDialog, showSnackbar, showAlert } = useContext(AppContext);

	const handleButtonPress1 = () => {
		showDialog('title', 'content', () => {
			console.log('callback');
		});
	}

	const handleButtonPress2 = () => {
		showAlert('message');
	}

	const handleButtonPress3 = () => {
		showSnackbar('snackbar');
	}

	const { testPush } = useContext(NotificationContext);
	const handleButtonPress4 = () => {
		testPush();
	}

	const handleApiTest = () => {
		// fetch("https://reactnative.dev/")
		fetch("https://ganghwaen.com/jax/test/test02.php")
		// fetch("http://192.168.0.105/jax/test/test02.php")
		.then((response) => {
			console.log(response)
		})
		.catch(() => { console.error('error') })

		// API.get("http://192.168.0.105/jax/test/test02.php")
		// .then(console.log)
		// .catch(basicErrorHandler);
	}

	const handleApiErrorTest = () => {
		API.get('/test/error_test2.php')
		.then()
		.catch(basicErrorHandler);
	}

	return (
		<View style={{ flex: 1 }}>
			<Button onPress={handleButtonPress1}>button1</Button>
			<Button onPress={handleButtonPress2}>button2</Button>
			<Button onPress={handleButtonPress3}>button3</Button>
			<Button onPress={handleButtonPress4}>button4</Button>
			<Button onPress={handleApiTest}>api test</Button>
			<Button onPress={handleApiErrorTest}>api error test</Button>
		</View>
	);
}


const styles = StyleSheet.create({
});

export default Test3Screen;