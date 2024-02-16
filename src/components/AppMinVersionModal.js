import React, { useState, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback, Modal, Platform, Linking } from 'react-native';
import Button from './Button';
import colors from '../appcolors';
import { openAppMinVersionModalRef } from '../navigation/RootNavigation';
import globals from '../globals';


const AppMinVersionModal = () => {
    const [ versionModalOpen, setVersionModalOpen ] = useState(false);

    const openAppVersionModal = () => {
        setVersionModalOpen(true);
    }

    useEffect(() => {
        openAppMinVersionModalRef.current = openAppVersionModal;
    }, []);

    const handleStorePress = () => {
        const linkUrl = Platform.OS === 'android' ? globals.playstoreURL : globals.appstoreURL
        Linking.openURL(linkUrl);
    }


    return (
        <Modal
			transparent={true}
			visible={versionModalOpen}
			// onRequestClose={handleCloseModal}
		>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center' }}>
                <TouchableWithoutFeedback onPress={() => {
                    // nothing
                }}>
                    <View style={[{ backgroundColor: 'white', marginHorizontal: 20, paddingTop: 30, paddingBottom: 30, paddingHorizontal: 30, borderRadius: 5, }]}>
                        <Text style={{ fontSize: 16, marginBottom: 10, color: colors.textPrimary }}>{'새로운 버전이 업데이트 되었어요!'}</Text>
                        <Text style={{ fontSize: 12, marginBottom: 16, color: colors.textPrimary }} textBreakStrategy="simple" >{'유저분들의 의견을 반영하여 사용성을 개선했어요!\n지금 바로 업데이트하고 즐겨보세요 :)'}</Text>
                        <Button onPress={handleStorePress}>업데이트</Button>
                    </View>
                </TouchableWithoutFeedback>
            </View>
		</Modal>
	);
}


export default AppMinVersionModal;