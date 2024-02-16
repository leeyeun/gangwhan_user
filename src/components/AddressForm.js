import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { AppContext } from '../contexts/app-context';
import Button from './Button';
import AddressSelectionModal from './AddressSelectionModal';
import colors from '../appcolors';
import cstyles from '../cstyles';
import { address_pipe } from '../pipes';


const defaultWebviewAddress = `https://ganghwaen.com/map/region_set_v.php`;

const AddressForm = ({ address, setAddress, contact, setContact, disableAutoInitiate, invisible }) => {
    const { getMyLocation } = useContext(AppContext);
  
    const [ postCodeModalOpen, setPostCodeModalOpen ] = useState(false);
  
    const [ webviewAddress, setWebviewAddress ] = useState();


    useEffect(() => {
        handleTrackMyLocation();
    }, []);

    // ----------------- place -----------------
    // zonecode, jibunAddress, roadAddress
    // 다음 postcode 결과에 위경도 정보가 없음
    const [ daumAddress, setDaumAddress ] = useState();
    useEffect(() => {
        if (daumAddress) {
            console.log(daumAddress);
            const command = `fromAddressMoveCenter('${daumAddress.address}')`;
            webviewRef.current?.injectJavaScript(command);
        }
    }, [ daumAddress ]);
    // ----------------- end: place -----------------

    // ----------------- my_position -----------------
    const handleTrackMyLocation = () => {
        console.log('start track mylocation');
        getMyLocation()
        .then(position => {
            console.log(`extract position from device: ${position.latitude}, ${position.longitude}`);
            const latitude = position.latitude;
            const longitude = position.longitude;
            setWebviewAddress(`${defaultWebviewAddress}?lat=${latitude}&lon=${longitude}&time=${new Date().getTime()}`);
        })
        .catch(() => {
            setWebviewAddress(`${defaultWebviewAddress}`);
        })
    }
    // ----------------- end: my_position -----------------
    const [ disableSetAddress, setDisableSetAddress ] = useState(disableAutoInitiate);
    const handleWebviewMessage = (text) => {
        const info = JSON.parse(text);
        console.log('address extracted from webview:', info, disableSetAddress);
        if (!info.address && !info.roadAddress) return;
        
        // 최초에 한번 막기 위한 플래그
        if (disableSetAddress) {
            setDisableSetAddress(false);
            return;
        }
        setAddress({
            ...address,
            road_address: info.roadAddress?.address,
            legal_address: info.address?.address,
            lat: info.position.lat,
            lon: info.position.lng,
        });
    }

    const webviewRef = useRef();
    const contactRef = useRef();

	return (
		<>
            {/* 주소 */}
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <TextInput
                    style={[cstyles.input, { flex: 1, marginRight: 10 }]}
                    placeholder="검색 버튼을 누르세요."
                    placeholderTextColor={'#757575'}
                    editable={false}
                    value={address_pipe(address)}
                />
                <Button onPress={() => { setPostCodeModalOpen(true); }}>주소 검색</Button>
            </View>
            <TouchableOpacity style={{ flexDirection: 'row', height: 45, borderRadius: 5, borderColor: colors.primary, borderWidth: 1, alignItems: 'center', justifyContent: 'center'  }} onPress={() => {
                handleTrackMyLocation();
            }}>
                <Image source={require('./../images/gps_icon.png')} style={{ width: 18, height: 18 }} />
                <Text style={{ color: '#E51A47', fontSize: 16, marginLeft: 5 }}>현위치로 주소 지정</Text>
            </TouchableOpacity>

            {/* 상세주소 */}
            <TextInput
                style={[cstyles.input, { backgroundColor: 'white', marginTop: 20, zIndex: 100 }]}
                placeholder={'상세 주소를 입력해주세요.'}
                placeholderTextColor={'#757575'}
                returnKeyType="next"
                onSubmitEditing={() => { contactRef.current?.focus(); }}
                value={address?.address_detail}
                onChangeText={text => {
                    setAddress({
                        ...address,
                        address_detail: text,
                    });
                }}
            />

            {/* 연락처 */}
            {setContact && <TextInput
                ref={contactRef}
                style={[cstyles.input, { backgroundColor: 'white', marginTop: 10, zIndex: 100 }]}
                placeholder={'연락처를 입력해주세요.'}
                placeholderTextColor={'#757575'}
                keyboardType="phone-pad"
                returnKeyType="done"
                value={contact}
                onChangeText={setContact}
            />}

            {/* 지도 */}
            <View style={invisible ? styles.invisibleWebview : styles.visibleWebview }>
                {webviewAddress && <WebView 
                    ref={webviewRef}
                    source={{ uri: webviewAddress }}
                    style={{ height: '100%', overflow: 'hidden', opacity: 0.99 }}
                    onMessage={(event) => { handleWebviewMessage(event.nativeEvent.data); }}
                />}
            </View>
            
            
            {/* daum post code */}
            <AddressSelectionModal open={postCodeModalOpen} setOpen={setPostCodeModalOpen} setAddress={setDaumAddress} />
		</>
	);
}


const styles = StyleSheet.create({
    visibleWebview: {
        flex: 1
    },
    invisibleWebview: {
        height: 10, marginTop: -20
    },
});

export default AddressForm;