import { Alert } from 'react-native';

import API from './api';
import globals from './globals';
import { showAlertRef, openAppMinVersionModalRef } from './navigation/RootNavigation';


const alphanumericRegex = /^[a-z0-9]+$/i;
const basicErrorHandler = (error) => {
    const message = error?.message;
    const code = error?.code;

    // code 가 있으면 code 로 처리
    if (code) {
        switch(code) {
            case 'need_app_update':
                if (openAppMinVersionModalRef.current) openAppMinVersionModalRef.current();
                break;
            default: Alert.alert(message);
        }
        return;
    }

    if (globals.production === true) {
        if (message == 'Network Error') return Alert.alert('네트워크에 연결되지 않았습니다.\n확인바랍니다.');

        let friendlyMessage = '에러가 발생했습니다. 고객센터에 문의하세요.';
        if (message) {
            const spans = message.split(' ');
            if (spans && spans.length > 0) {
                const span = spans[0];
                if (!alphanumericRegex.exec(span)) {
                    friendlyMessage = message;    // message is not english
                }
                else {
                    // 영어 에러일 경우 시스템에서 처리하지 못한 에러일 가능성이 크므로 db에 저장 
                    API.post('/test/log_test.php', { code: 'user_app', message })
                    .catch(error => console.error(error.message));
                }
            }
        }
        doAlert(friendlyMessage);
    }
    else {
        doAlert(message);
    }
}

// const codeRegex = /(?<=\()\d(?=\))/;     // positive look behind 는 다음 표준에서 적용될 예정이라 여기서 쓰면 오류가 남
const codeRegex = /Processing error\((\d)\)/;
const extractErrorCode = (error) => {
    if (!error) return null;
    const errorCode = codeRegex.exec(error.message);
    return errorCode?.[1];
}

const errorCodeHandler = (error, codeInfos) => {
    if (error?.message == 'Network Error') return Alert.alert('네트워크에 연결되지 않았습니다.\n확인바랍니다.');
    
    const code = extractErrorCode(error);
    const info = codeInfos.find(item => item.code == code);
    if (info) {
        Alert.alert(info.message);
    }
    else {
        API.post('/test/log_test.php', { code: 'user_app', message: error.message })
        .catch(error => console.error(error.message));
        Alert.alert(error.message);
    }
}

const doAlert = (message) => {
    if (showAlertRef) {
        showAlertRef.current(message);
    }
    else {
        Alert.alert(message);
    }
}

export {
    basicErrorHandler,
    errorCodeHandler,
};