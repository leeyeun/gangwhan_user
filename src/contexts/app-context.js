import React, { createContext, useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, Platform, PermissionsAndroid, Image } from 'react-native';
import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import { Snackbar } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import Geolocation from 'react-native-geolocation-service';
import { useNetInfo } from "@react-native-community/netinfo";

import AppModal from '../components/AppModal';
import AppButton from '../components/Button';
import colors from '../appcolors';
import API from '../api';
import { basicErrorHandler } from '../http-error-handler';
import { showAlertRef, showDialogRef, showSnackbarRef } from '../navigation/RootNavigation';


const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
	// snack bar 
	const [snack, setSnack] = useState(false);
	const [snackMessage, setSnackMessage] = useState(null);
	// const showSnackbar = (message) => {
	// 	setSnackMessage(message);
	// 	setSnack(true);
	// }
	const dismissSnackbar = () => {
		setSnack(false);
	}
	// end: snack bar

	// custom snackbar
	const [ customSnacbarVisible, setCustomSnackbarVisible ] = useState(false);
	const [ customMessage, setCustomMessage] = useState('');
	const showSnackbar = (message) => {
		setCustomMessage(message);
		setCustomSnackbarVisible(true);
		setTimeout(() => {
			setCustomSnackbarVisible(false);
		}, 1000);
	}
	const hideCustomSnackbar = () => { setCustomSnackbarVisible(false) }
	// end: custom snackbar

	// alert
	const [alertMessage, setAlertMessage] = useState();
	const [alertVisible, setAlertVisible] = useState(false);
	const showAlert = (message) => {
		setAlertMessage(message);
		setAlertVisible(true);
	}
	const hideAlert = () => setAlertVisible(false);
	// end: alert

	// dialog
	const [dialogData, setDialogData] = useState();
	const dialogCallbackRef = useRef();
	const [dialogVisible, setDialogVisible] = React.useState(false);
	const showDialog = (title, content, callback) => {
		setDialogData({title, content});
		dialogCallbackRef.current = callback;
		setDialogVisible(true);
	}
	const hideDialog = () => setDialogVisible(false);
	const handleDialogConfirm = () => {
		setDialogVisible(false);
		if (dialogCallbackRef.current) dialogCallbackRef.current();
	}
	// end: dialog

	// image picker
	const [ imagePickerModalOpen, setImagePickerModalOpen] = useState(false);
	const updateImageRef = useRef();
	const openImagePicker = (callback) => {
		updateImageRef.current = callback;
		setImagePickerModalOpen(true);
	};
	// end: image picker

	// get myLocation
	const getMyLocation = () => {
		return new Promise((resolve, reject) => {
			try {
				if (Platform.OS == 'android') {
					PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
					.then(granted => {
						if (granted === PermissionsAndroid.RESULTS.GRANTED) {
							Geolocation.getCurrentPosition(
								(position) => {
									resolve(position.coords);
								},
								(error) => {
									console.log(error.code, error.message);
									reject(error);
								},
								{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
							);
						} 
						else {
							console.log("Location permission denied");
							reject(new Error('Location permission denied'));
						}
					});
				}
				else {
					Geolocation.requestAuthorization('whenInUse')
					.then(() => {
						Geolocation.getCurrentPosition(
							(position) => {
								resolve(position.coords);
							},
							(error) => {
								console.log(error.code, error.message);
								reject(error);
							},
							{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
						);
					})
				}
			}
			catch (error) {
				console.warn(error);
				reject(error);
			}
		});
	}
	// end: get my location

	// network connection
	const netInfo = useNetInfo();
	const isConnected = useMemo(() => {
		return !!netInfo?.isConnected;
	}, [ netInfo ]);

	// log message
	const logMessage = (code, message) => {
		API.post('/test/log_test.php', { code, message })
		.then(() => {})
		.catch(basicErrorHandler);
	}
	// end: log message

	useEffect(() => {
		showSnackbarRef.current = showSnackbar;
		showAlertRef.current = showAlert;
		showDialogRef.current = showDialog;
	}, []);

	return (
		<AppContext.Provider  
			value={{
				showSnackbar,

				showAlert,

				showDialog,

				openImagePicker,

				getMyLocation,

				isConnected,

				logMessage,
			}}
		>
			{children}

			{/* alert */}
			<Portal>
				<Dialog visible={alertVisible} onDismiss={hideAlert}>
					<View style={{ paddingVertical: 40, alignItems: 'center' }}>
						<Image source={require('../images/warningcircle.png')} style={{ width: 66, height: 66 }} />
						<Text style={{ marginTop: 20, fontSize: 18, color: colors.textPrimary, fontWeight: 'bold' }}>{alertMessage}</Text>
					</View>
				</Dialog>
			</Portal>

			{/* dialog */}
			{dialogData && <Portal>
				<Dialog visible={dialogVisible} onDismiss={hideDialog}>
					<View style={{ padding: 15, alignItems: 'center' }}>
						{dialogData.title && <Text style={{ fontSize: 18, color: colors.textPrimary, fontWeight: 'bold' }}>{dialogData.title}</Text>}
						<View style={{ alignSelf: 'stretch', borderColor: colors.borderColor, borderBottomWidth: 1, marginVertical: 15 }} />
						<Text style={{ fontSize: 16, color: colors.textPrimary, marginVertical: 5, textAlign: 'center', lineHeight: 24 }}>{dialogData.content}</Text>
						<View style={{ flexDirection: 'row', marginTop: 25 }}>	
							<View style={{ flex: 1 }}><AppButton style={{ backgroundColor: '#777777' }} onPress={hideDialog}>취소</AppButton></View>
							<View style={{ flex: 1, marginLeft: 10 }}><AppButton onPress={handleDialogConfirm}>확인</AppButton></View>
						</View>
					</View>
				</Dialog>
			</Portal>}
			
			{/* snackbar */}
			<Snackbar
				visible={snack}
				onDismiss={dismissSnackbar}
				duration={1300}
			>
				{snackMessage}
			</Snackbar>

			{/* custom snackbar: 고객이 요청한 것 */}
			<Portal>
				<Dialog visible={customSnacbarVisible} onDismiss={hideCustomSnackbar}>
					<View style={{ paddingVertical: 40, alignItems: 'center' }}>
						<Text style={{ fontSize: 18, color: colors.textPrimary, fontWeight: 'bold' }}>{customMessage}</Text>
					</View>
				</Dialog>
			</Portal>

			{/* image picker */}
			<AppModal visible={imagePickerModalOpen} setVisible={setImagePickerModalOpen}>
				<Text style={{ fontSize: 22, fontWeight: 'bold' }}>사진을 가져올 방법을 선택하세요.</Text>
				<View style={{ marginTop: 32, flexDirection: 'row' }}>
					<View style={{ flex: 1 }}><AppButton style={{ backgroundColor: colors.secondary}} onPress={() => {
                        setImagePickerModalOpen(false);
                        ImagePicker.openPicker({})
                        .then(image => {
							updateImageRef.current(image);
						});
                    }}>갤러리</AppButton></View>
					<View style={{ marginLeft: 6, flex: 1 }}><AppButton onPress={() => {
                        setImagePickerModalOpen(false);
						ImagePicker.openCamera({})
                        .then(image => {
							updateImageRef.current(image);
						});   
					}}>카메라</AppButton></View>
				</View>
            </AppModal>
		</AppContext.Provider>
	);
};

export {
	AppContext,
	AppContextProvider
};