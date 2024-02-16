import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { Text, Image, View, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native';

import { AuthContext } from '../../contexts/auth-context';
import { AppContext } from '../../contexts/app-context';
import API from '../../api';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import { basicErrorHandler } from '../../http-error-handler';
import Nodata from '../../components/Nodata';
import useFocusEffect from '../../hooks/useFocusEffect';


export default function Questions({ navigation }) {
    const { me } = useContext(AuthContext);

    const [ questions, setQuestions ] = useState();
    useFocusEffect(() => {
        if (me) {
            API.post('/qa/get_my_qas.php', { mb_id: me.mb_id })
            .then(data => {
                setQuestions(data.data);
            })
            .catch(basicErrorHandler);
        }
    }, [ me ]);
    

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {questions ? <>
                {questions.map(question => <Fragment key={question.wr_id}>
                    <View style={{marginHorizontal: 15}}>
                        <TouchableOpacity style={{paddingVertical: 15, width: '100%'}} onPress={() => { navigation.navigate('QuestionsView', { question }); }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', }}>
                                <Text style={[styles.title, {flex: 1}]} numberOfLines={1}>{question.wr_subject}</Text>
                                {question.wr_5 ? (<View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFEBEF', width: 72, height: 24, borderRadius: 5, }}>
                                    <Text style={{color: '#E51A47'}}>답변완료</Text>
                                </View>) : (<View style={{ justifyContent: 'center', alignItems: 'center', borderColor: '#E51A47', borderWidth: 1, width: 72, height: 24, borderRadius: 5, }}>
                                    <Text style={{color: '#E51A47'}}>답변대기</Text>
                                </View>)}
                            </View>
                            <Text style={{color: '#777777'}}>{question.wr_datetime}</Text>
                        </TouchableOpacity>
                        
                        {/* 구분선 */}
                        <View style={{backgroundColor: '#E3E3E3', height: 1}}></View>
                    </View>

                </Fragment>)}

                {questions.length == 0 && <Nodata style={{ marginLeft: 15 }}>문의내역이 없습니다.</Nodata>}
            </> : <Loading />}
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
  title: {marginBottom: 10, fontSize: 16, paddingRight: 10},
  contents: {marginRight: 20, marginBottom: 10, fontSize: 16, flex: 1},
  img: {resizeMode: 'cover', marginRight: 10, marginBottom: 10},
});
