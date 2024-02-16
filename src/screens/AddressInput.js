import React, { useState, useContext, useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Button from '../components/Button';
import { MemoryContext } from '../contexts/memory-context';
import { AppContext } from '../contexts/app-context';
import AddressForm from '../components/AddressForm';
import { getStatusBarHeight } from 'react-native-status-bar-height';


function AddressInputScreen({ navigation }) {
    const [ address, setAddress ] = useState();

    const { showSnackbar } = useContext(AppContext);
    const { saveMyAddress } = useContext(MemoryContext);
    

    const handleSubmit = async () => {
        try {
            if (!address.road_address && !address.legal_address) return showSnackbar('주소정보가 없습니다.');
            if (!address['address_detail']) return showSnackbar('상세주소 정보가 없습니다.');
            if (!address['lat'] || !address['lon']) return showSnackbar('좌표 정보가 없습니다.');
      
            await saveMyAddress(address);
            showSnackbar('주소를 저장했습니다.');
            navigation.goBack();
        }
        catch(error) {
            showSnackbar(error.message);
        } 
    }

    const dimensions = useWindowDimensions();
    const pageHeight = useMemo(() => {
        const titlebarHeight = 56;
        const statusBarHeight = getStatusBarHeight() || 16;
        return dimensions.height - statusBarHeight - titlebarHeight;
    }, [ dimensions ]);


    return (
        <View style={{ backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 20, height: pageHeight }}>

            <View style={{ flex: 1 }} >
                <AddressForm address={address} setAddress={setAddress} />
            </View>

            <View style={{ marginTop: 20 }}><Button onPress={handleSubmit}>적용</Button></View>
        </View>
    );
}

export default AddressInputScreen;
