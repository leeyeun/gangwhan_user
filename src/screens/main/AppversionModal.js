import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Modal, Platform, Linking } from 'react-native';
import { MemoryContext } from '../../contexts/memory-context';
import Button from '../../components/Button';
import colors from '../../appcolors';
import globals from '../../globals';


const AppversionModal = () => {
    const { appVersionInfo } = useContext(MemoryContext);
    const [ versionModalOpen, setVersionModalOpen ] = useState(false);
    const [ message, setMessage ] = useState('');
    const [ linkUrl, setLinkUrl ] = useState();

    useEffect(() => {
        if (appVersionInfo) {
            const latestVersion = appVersionInfo['current_version'];
            const thisVersion = +globals.version * 10;
            if ((thisVersion < latestVersion)) {
                setMessage(appVersionInfo.message || '유저분들의 의견을 반영하여 사용성을 개선했어요! 지금 바로 업데이트하고 즐겨보세요 :)');
                setLinkUrl(Platform.OS === 'android' ? globals.playstoreURL : globals.appstoreURL);
                setVersionModalOpen(true);
            }
        }
    }, [ appVersionInfo ]);

    const handleStorePress = () => {
        Linking.openURL(linkUrl);
        setVersionModalOpen(false);
    }

    const handleCloseModal = () => {
        setVersionModalOpen(false);
    }

	return (
        <Modal
			transparent={true}
			visible={versionModalOpen}
			onRequestClose={handleCloseModal}
		>
			<TouchableWithoutFeedback onPress={handleCloseModal}>
				<View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center' }}>
					<TouchableWithoutFeedback onPress={() => {
						// nothing
					}}>
						<View style={[{ backgroundColor: 'white', marginHorizontal: 20, paddingTop: 30, paddingBottom: 30, paddingHorizontal: 30, borderRadius: 5, }]}>
                            <Text style={{ fontSize: 16, marginBottom: 10, color: colors.textPrimary }}>{'새로운 버전이 업데이트 되었어요!'}</Text>
                            <Text style={{ fontSize: 12, marginBottom: 16, color: colors.textPrimary }} textBreakStrategy="simple" >{message}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, marginRight: 8 }}><Button mode={'outlined'} onPress={handleCloseModal} textStyle={{ fontSize: 14 }}>다음에 할래요</Button></View>
                                <View style={{ flex: 1 }}><Button onPress={handleStorePress} textStyle={{ fontSize: 14 }}>업데이트</Button></View>
                            </View>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
}


const styles = StyleSheet.create({
});

export default AppversionModal;