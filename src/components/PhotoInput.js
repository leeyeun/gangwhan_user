import React, { useContext } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import cstyles from '../cstyles';
import { AppContext } from '../contexts/app-context';


const PhotoInput = ({photo, setPhoto}) => {
    const { openImagePicker } = useContext(AppContext);
    return (
        <View style={{ flexDirection: 'row' }}>
            {photo ? <View>
                <Image source={{ uri: photo.path }} style={{ width: 70, height: 70, borderRadius: 5 }} />
                <TouchableWithoutFeedback onPress={() => { setPhoto(null); }}>
                    <Image source={require('../images/addshopimgdel.png')} style={{ position: 'absolute', right: 5, top: 5, width: 25, height: 25 }} />
                </TouchableWithoutFeedback>
            </View> : <TouchableOpacity onPress={() => { openImagePicker(setPhoto); }}>
                <View style={{ ...cstyles.borderRounded, alignItems: 'center', justifyContent: 'center', width: 70, height: 70 }}>
                    <Image source={require('../images/addshopaddimg.png')} style={{ width: 22, height: 22}} />
                </View>
            </TouchableOpacity>}
        </View>
    );
}

export default PhotoInput;