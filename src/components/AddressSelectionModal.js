import React from 'react';
import Postcode from '@actbase/react-daum-postcode';
import { View, Modal, SafeAreaView, Text, Image, TouchableWithoutFeedback } from 'react-native';

import colors from '../appcolors';


const AddressSelectionModal = ({ open, setOpen, setAddress }) => {
	return (
		<Modal visible={open} onRequestClose={() => { setOpen(false) }}>
            <SafeAreaView />
            <View style={{ flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 12, borderColor: colors.borderColor, borderBottomWidth: 1 }}>
                <TouchableWithoutFeedback onPress={() => { setOpen(false) }}>
                    <Image source={require('../images/receiptclose.png')} style={{ width: 20, height: 20, zIndex: 30 }} />
                </TouchableWithoutFeedback>

                <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, color: colors.textPrimary }}>주소검색</Text>
                </View>
            </View>
            
            <Postcode
                style={{ width: '100%', flex: 1 }}
                jsOptions={{ animated: true, hideMapBtn: true }}
                onSelected={data => {
                    // console.log(data);
                    setAddress(data);
                    setOpen(false);
                }}
            />
        </Modal>
	);
}


export default AddressSelectionModal;