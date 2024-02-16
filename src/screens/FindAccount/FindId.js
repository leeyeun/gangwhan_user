import React from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';

import style from '../../style/style';
import {BtnSubmit} from '../components/BOOTSTRAP';

// const FindButton = (props) => {
//     return (
//         <TouchableOpacity onPress={() => { }}>
//             <View style={style.findButton}>
//                 <Text style={style.text2}>{props.title}</Text>
//                 <Image source={require('./../images/top_back.png')}
//                     style={{ width: 15, height: 15, tintColor: '#000', resizeMode: 'contain' }}></Image>
//             </View>
//         </TouchableOpacity>
//     );
// }

function FindIdScreen({navigation}) {
  return (
    <View style={{height: 140, backgroundColor: 'white'}}>
      <View style={{padding: 15}}>
        <View style={{paddingTop: 10, paddingBottom: 20}}>
          <Text style={style.subtitle}>아이디를 찾습니다</Text>
        </View>

        <TouchableOpacity
          style={[style.btnSubmit, style.container0]}
          onPress={() => navigation.navigate('FindIdPhoneSign')}>
          <Text style={[style.btnSubmitTxt]}>휴대폰 인증</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default FindIdScreen;
