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


export default function QuestionForm({navigation, route}) {
    const { me } = useContext(AuthContext);
    const { showAlert } = useContext(AppContext);
    
    const [ title, setTitle ] = useState('');
    const [ content, setContent ] = useState('');

    const [ submitting, setSubmitting ] = useState(false);
    const handleSubmit = () => {
        if (!title) return showAlert('제목을 입력하세요.');
        if (!content) return showAlert('내용을 입력하세요.');

        setSubmitting(true);

        const data = {
            mb_id: me.mb_id,
            wr_subject: title,
            wr_content: content,
        };
        API.post('/qa/add_qa.php', data)
        .then(() => {
            navigation.goBack();
        })
        .catch(basicErrorHandler)
        .finally(() => { setSubmitting(false); });
    }

    const contentRef = useRef();

    return (
        <View style={{ flex: 1, padding: 15 }}>
            <TextInput
                style={{ ...cstyles.input, }}
                placeholder="제목을 입력하세요."
                value={title}
                onChangeText={setTitle}
                returnKeyType="next"
                onSubmitEditing={() => { contentRef.current.focus(); }}
            />

            <TextInput
                ref={contentRef}
                style={{ ...cstyles.input, marginVertical: 10, flex: 1 }}
                placeholder="내용을 입력하세요."
                multiline={true}
                textAlignVertical="top"
                autoCapitalize="none"
                value={content}
                onChangeText={setContent}
            />
            <Button onPress={handleSubmit} disabled={submitting}>제출</Button>
        </View>
    );
}

const styles = StyleSheet.create({});
