import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { Text, Image, View, StyleSheet, ScrollView, TouchableOpacity, FlatList, SafeAreaView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

import style from '../../style/style';
import { AuthContext } from '../../contexts/auth-context';
import { AppContext } from '../../contexts/app-context';
import { MemoryContext } from '../../contexts/memory-context';
import API from '../../api';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import Nodata from '../../components/Nodata';
import globals from '../../globals';
import colors from '../../appcolors';
import cstyles from '../../cstyles';
import {} from '../../pipes';
import { basicErrorHandler } from '../../http-error-handler';


export default function QuestionsView({navigation, route}) {
    const question = useMemo(() => {
        return route.params.question;
    }, [ route.params ]);

    const { me } = useContext(AuthContext);

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <View style={{paddingHorizontal: 15}}>
                <Text style={{fontSize: 18, marginTop: 15, marginBottom: 10}}>{question.wr_subject}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: '#B2B2B2', marginBottom: 5}}>{me.mb_name}</Text>
                    <Image source={require('../../images/questionsviewline.png')} style={{marginHorizontal: 5}}></Image>
                    <Text style={{color: '#B2B2B2', marginBottom: 5}}>{question.wr_datetime.substring(0,10)}</Text>
                </View>
                <View style={{marginVertical: 10}}>
                    <Text style={[style.text2]}>{question.wr_content}</Text>
                </View>
            </View>

            <View style={{ backgroundColor: '#F9F9F9', height: 35, marginTop: 30, justifyContent: 'center', paddingHorizontal: 15, }}>
                <Text style={[style.text2, {fontWeight: '600'}]}>답변/댓글</Text>
            </View>

            <View style={{padding: 15}}>
                {question.wr_5 ? <>
                    <View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{fontSize: 16, fontWeight: 'bold', marginRight: 10}}>강화N</Text>
                            <Text style={{color: '#B2B2B2'}}>{question.replied_at.substring(0,10)}</Text>
                        </View>
                        <Text style={[style.text2, {marginTop: 10}]}>{question.wr_5}</Text>
                    </View>
                    
                </> : <Nodata>현재 답변대기중입니다.</Nodata>}
                <View style={{ backgroundColor: '#E5E5E5', height: 1, marginVertical: 15, }}></View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({});
