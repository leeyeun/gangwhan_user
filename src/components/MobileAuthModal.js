import React from 'react';
import { View, Image, Modal, TouchableWithoutFeedback, Text, TextInput } from 'react-native';

import colors from '../appcolors';
import { SafeAreaView } from 'react-native-safe-area-context';
import MobileAuth from './MobileAuth';



const MobileAuthModal = ({ visible, setVisible, authenticatedCallback }) => {
	return (
        <Modal
			visible={visible}
			onRequestClose={() => {
				setVisible(false);
			}}
		>
            <SafeAreaView />
			<View style={{ flex: 1 }}>
				<View style={{ flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 12, borderColor: colors.borderColor, borderBottomWidth: 1 }}>
                    <TouchableWithoutFeedback onPress={() => { setVisible(false) }}>
                        <Image source={require('../images/receiptclose.png')} style={{ width: 20, height: 20, zIndex: 30 }} />
                    </TouchableWithoutFeedback>

                    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, color: colors.textPrimary }}>휴대폰번호 인증</Text>
                    </View>
                </View>

                <MobileAuth authenticatedCallback={authenticatedCallback} />
			</View>
		</Modal>
    );
}

export default MobileAuthModal;