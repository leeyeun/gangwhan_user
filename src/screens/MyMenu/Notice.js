import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { Text, Image, View, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import {TextInput} from 'react-native-paper';
import {navigate} from '../../navigation/RootNavigation';
import style from '../../style/style';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';

import { AuthContext } from '../../contexts/auth-context';
import { AppContext } from '../../contexts/app-context';
import { MemoryContext } from '../../contexts/memory-context';
import API from '../../api';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import globals from '../../globals';
import colors from '../../appcolors';
import cstyles from '../../cstyles';
import {} from '../../pipes';
import { basicErrorHandler } from '../../http-error-handler';


export default function Notice({navigation}) {
    const [ notices, setNotices ] = useState();
    
    useEffect(() => {
        API.post('/notice_select.php')
        .then(data => {
            setNotices(data.rowdata);
        })
        .catch(basicErrorHandler);
    }, []);

    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            {/* <View style={styles.searchBox}>
                <TextInput
                    borderWidth={1}
                    borderColor="#CCCCCC"
                    underlineColor="white"
                    borderRadius={100}
                    width="100%"
                    style={{ width: '100%', height: 45, backgroundColor: 'white', paddingHorizontal: 12, }}
                    placeholder="제목을 입력하세요"
                    placeholderTextColor="#AAAAAA"
                    right={<TextInput.Icon style={{backgroundColor: 'white'}}
                        name={require('../../images/search_icon.png')}
                        color={'#E51A47'}
                    />}
                />
            </View> */}

            {notices ? <>
                {notices.map(notice => <Fragment key={notice.wr_id}>
                    <TouchableOpacity onPress={() => { navigation.navigate('NoticeView', { notice }) }}>
                        <View style={{ padding: 15 }}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.title]}>{notice.wr_subject}</Text>
                            <Text style={{color: '#777777'}}>{notice.wr_datetime}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{backgroundColor: '#E3E3E3', height: 1}}></View>
                </Fragment>)}

                {notices.length == 0 && <Nodata>공지사항이 없습니다.</Nodata>}
            </> : 
            <Loading />}



            {/* <View style={{alignItems: 'center', flex: 1, backgroundColor: 'white'}}>
                <View style={{ marginTop: '15%', flex: 1, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', marginBottom: '5%', width: 180, }}>
                    <Image source={require('../../images/questionsbottomleft.png')}></Image>
                    <Text style={{ fontSize: 16, textDecorationLine: 'underline', textAlign: 'center', color: '#E51A47', }}>1</Text>
                    <Text style={{fontSize: 16}}>2</Text>
                    <Text style={{fontSize: 16}}>3</Text>
                    <Text style={{fontSize: 16}}>4</Text>
                    <Text style={{fontSize: 16}}>5</Text>
                    <Image source={require('../../images/questionsbottomright.png')}></Image>
                </View>
            </View> */}
        </View>
    );
}


const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'white'},
  searchBox: {
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 5,
  },
  itemView: {
    flexDirection: 'row',
    borderBottomColor: 'grey',
    margin: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  itemImg: {
    width: 70,
    height: 70,
    resizeMode: 'cover',
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginRight: 5,
  },
  itemMsg: {
    marginLeft: 5,
  },
  delPrice: {
    color: '#777777',
  },
  newtakeout: {marginRight: 5},
  title: {marginBottom: 10, fontSize: 16},
  contents: {marginRight: 20, marginBottom: 10, fontSize: 16},
  img: {resizeMode: 'cover', marginRight: 10, marginBottom: 10},
});
