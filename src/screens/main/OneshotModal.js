import React, { useState, useContext, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { MemoryContext } from '../../contexts/memory-context';
import AppCommonModal from '../../components/AppCommonModal';
import colors from '../../appcolors';



const OneshotModal = () => {
    const { oneshotNotice } = useContext(MemoryContext);
    const [ noticeModalOpen, setNoticeModalOpen ] = useState(false);

    useEffect(() => {
        if (oneshotNotice) {
            let show = true;
            
            AsyncStorage.getItem('nomore_notices')
            .then(nomore_notices => {
                if (nomore_notices) {
                    const list = JSON.parse(nomore_notices);
                    if (list.indexOf(oneshotNotice.id) > -1) show = false;
                }
                if (show) setNoticeModalOpen(true);
            })
        }
    }, [ oneshotNotice ]);

    const dimensions = useWindowDimensions();
    const imageSize = useMemo(() => {
        if (dimensions && oneshotNotice && oneshotNotice.image) {
            const width = dimensions.width - 100;
            const height = width / +oneshotNotice.image.width * +oneshotNotice.image.height;
            return { width, height };
        }
    }, [ oneshotNotice, dimensions ]);

    const handleNomoreShow = () => {
        AsyncStorage.getItem('nomore_notices')
        .then(nomore_notices => {
            const list = nomore_notices ? JSON.parse(nomore_notices) : [];
            if (!list.indexOf(oneshotNotice.id) > -1) {
                list.push(oneshotNotice.id);
            }
            return AsyncStorage.setItem('nomore_notices', JSON.stringify(list));
        })
        .then(() => {
            // nothing todo; 
        });

        setNoticeModalOpen(false);
    }

    const handleClose = () => {
        setNoticeModalOpen(false);
    }

	return (
		<>
            {/* oneshot notice */}
            {oneshotNotice && <AppCommonModal visible={noticeModalOpen} setVisible={setNoticeModalOpen}>
                {oneshotNotice.title && <Text>{oneshotNotice.title}</Text>}
                {oneshotNotice.image && imageSize && <TouchableWithoutFeedback onPress={() => {
                    if (oneshotNotice.link_url) {}
                }}>
                    <Image source={{ uri: oneshotNotice.image.download_url }} style={{ width: imageSize.width, height: imageSize.height }} />
                </TouchableWithoutFeedback>}
                {oneshotNotice.content && <Text>{oneshotNotice.content}</Text>}
                <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableWithoutFeedback onPress={handleNomoreShow}>
                        <Text style={{ color: colors.secondary, textDecorationLine: 'underline' }}>더이상 보지 않기</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={handleClose}>
                        <Text style={{ color: colors.secondary }}>닫기</Text>
                    </TouchableWithoutFeedback>
                    
                </View>
            </AppCommonModal>}
        </>
	);
}


const styles = StyleSheet.create({
});

export default OneshotModal;