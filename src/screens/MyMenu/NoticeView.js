import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { Text, Image, View, StyleSheet, ScrollView, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

import style from '../../style/style';
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

const meta = '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"></meta>';

export default function NoticeView({route, navigation}) {
    const notice = useMemo(() => {
        return route.params.notice;
    }, [ route.params ]);

    return (
        <View style={{ flex: 1, paddingHorizontal: 15, paddingBottom: 0, backgroundColor: 'white' }}>
            <Text style={{fontSize: 18, marginTop: 15, marginBottom: 10}}>{notice.wr_subject}</Text>
            <Text style={{color: '#B2B2B2', marginBottom: 5}}>{notice.wr_datetime.substring(0,10)}</Text>
            <View style={{ flex: 1, marginVertical: 10}}>
                <WebView source={{ html: meta + notice.wr_content }} /> 
            </View>
        </View>
    );
}

const styles = StyleSheet.create({});
