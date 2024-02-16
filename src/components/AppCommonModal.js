import React from 'react';
import { View, Modal, TouchableWithoutFeedback } from 'react-native';


const AppCommonModal = ({
	visible,
	setVisible,
	children,
	style,
}) => {
	return (
		<Modal
			transparent={true}
			visible={visible}
			onRequestClose={() => {
				setVisible(false);
			}}
		>
			<TouchableWithoutFeedback onPress={() => { setVisible(false); }}>
				<View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center' }}>
					<TouchableWithoutFeedback onPress={() => {
						// nothing
					}}>
						<View style={[{ backgroundColor: 'white', marginHorizontal: 20, paddingTop: 30, paddingBottom: 30, paddingHorizontal: 30, borderRadius: 5, }, style]}>
							{children}
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
}

export default AppCommonModal;
