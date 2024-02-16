import React from 'react';
import { View, Modal, TouchableWithoutFeedback } from 'react-native';




const AppModal = ({ visible, setVisible, children, staticBackdrop }) => {
	return (
        <Modal
			transparent={true}
			visible={visible}
			onRequestClose={() => {
				setVisible(false);
			}}
		>
			<View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' }}>
				<View style={{ backgroundColor: 'white', paddingHorizontal: 22, paddingTop: 50, paddingBottom: 30 }}>
					{children}
				</View>
				
				<TouchableWithoutFeedback onPress={() => {
					if (!staticBackdrop) setVisible(false);
				}}>
					<View style={{ flex: 1 }}></View>
				</TouchableWithoutFeedback>
			</View>
		</Modal>
    );
}

export default AppModal;
