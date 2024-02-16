import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ScrollView, FlatList, Alert, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';

import Button from '../components/Button';
import { AppContext } from '../contexts/app-context';
import API from '../api';
import { basicErrorHandler } from '../http-error-handler';
import cstyles from '../cstyles';



const Test2 = ({ navigation, route }) => {
    const [ pauseBtn, setPauseBtn] = useState(false);
    const [bannerState, setBannerState] = useState(0);

    function twolength(n) {
        return (n < 10 ? '0' : '') + n;
    }


    const { showAlert, showDialog, logMessage } = useContext(AppContext);
    const handleOpenAlert = () => {
        showAlert('주문이 취소되었습니다.');
    }

    const handleOpenDialog = () => {
        showDialog('장바구니 제품 삭제', '해당 제품이 장바구니에서 삭제됩니다.\n삭제하시겠습니까?', () => {
            console.log('path1');
        });
    }

    const handleApiTest = () => {
        API.get('/test/test03.php')
        .then(data => { 
            console.log(data.data);
        })
        .catch(basicErrorHandler)
    }

    // iamport test
    const [od_id, setOd_id] = useState('');
    const handlePayIamportTest = () => {
        navigation.navigate('PayIamport', { od_id });
    }
    // end: iamport test

    const handleLogMessage = () => {
        const code = 'code01';
        const message = 'message01';
        logMessage(code, message);
    }

    const createPDF = async () => {
        let options = {
            html: '<h1>PDF TEST</h1>',
            fileName: 'test',
            directory: 'Documents',
        };
      
        let file = await RNHTMLtoPDF.convert(options)
        console.log(file.filePath);

        FileViewer.open(file.filePath)
        .then(() => {
            // success
            console.log('success');
        })
        .catch(error => {
            // error
            console.log('error');
        });
    }

    const downloadHTML = () => {
        API.get('/order/get_receipt_html.php?od_id=378225927')
        .then(data => {
            let options = {
                html: data.data.html,
                fileName: 'test',
                directory: 'Documents',
            };
          
            RNHTMLtoPDF.convert(options)
            .then(file => {
                console.log(file.filePath);
                return FileViewer.open(file.filePath);
            })
            .then(() => {
                // success
                console.log('success');
            })
            .catch(error => {
                // error
                console.error(error);
            });
        })
        .catch(basicErrorHandler);
    }

	return (
		<View style={{ flex: 1, padding: 15 }}>
			<TouchableOpacity onPress={() => { console.log('path1'); setPauseBtn(val => !val); }}>
                <View style={{ backgroundColor: 'rgba(0,0,0,.6)', height: 35, width: 105, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}>
                    <Text style={{fontWeight: 'bold', color: 'white'}}>
                        {twolength(bannerState)}
                    </Text>
                    <Text style={{color: 'white'}}>/{2}</Text>
                    <View style={{ backgroundColor: 'white', height: 20, width: 1, marginHorizontal: 10 }}></View>
                    <Image source={require('../images/pause.png')} style={{marginLeft: 5}}></Image>
                </View>
            </TouchableOpacity>

            <Button onPress={handleOpenAlert}>open alert</Button>
            <Button onPress={handleOpenDialog}>open dialog</Button>
            <Button onPress={handleApiTest}>api test</Button>
            <Button onPress={handleLogMessage}>log message</Button>
            <Button onPress={createPDF}>create pdf</Button>
            <Button onPress={downloadHTML}>download html</Button>
            <Button onPress={handlePayIamportTest}>pay iamport test</Button>
            <TextInput
                style={{...cstyles.input}}
                value={od_id}
                keyboardType="number-pad"
                onChangeText={setOd_id}
            />
		</View>
	);
}


const styles = StyleSheet.create({
});

export default Test2;