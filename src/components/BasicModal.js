import React from 'react';
import { View, Modal, TouchableWithoutFeedback } from 'react-native';




export default function BasicModal({ visible, setVisible, children }) {
	return (
        <Modal
			transparent={true}
			visible={visible}
			onRequestClose={() => {
				setVisible(false);
			}}
		>
			
			<TouchableWithoutFeedback onPress={() => { setVisible(false) }}>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }}>
					<TouchableWithoutFeedback onPress={() => {
						// 의도적으로 비워둠: 상위뷰 클릭을 무시하기 위함
					}}>
						<View style={{ padding: 14, width:'90%', backgroundColor: 'white', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5}}>
							{children}
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
    );
}

