import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, Image, TextInput, ScrollView, Dimensions, useWindowDimensions } from 'react-native';

import style from '../style/style';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../contexts/auth-context';
import { AppContext } from '../contexts/app-context';
import API from '../api';
import Button from '../components/Button';
import Loading from '../components/Loading';
import globals from '../globals';
import colors from '../appcolors';
import cstyles from '../cstyles';
import {} from '../pipes';
import { basicErrorHandler } from '../http-error-handler';


const Stars = ({stars, setStars}) => {
	return (
		<View style={{ alignSelf: 'center', alignItems: 'center' }}>
			<View style={{ flexDirection: 'row' }}>
				{Array.from({length: 5}, (v, index) => <Fragment key={index}>
					<TouchableOpacity onPress={() => {
						setStars(index + 1);
					}}>
						<Image key={String(index)} source={index < stars ? require('../images/reviewstar.png') : require('../images/reviewstarempty.png')} style={{ width: 38, height: 37 }} />
					</TouchableOpacity>
				</Fragment>)}
			</View>
		</View>
	);	
};


export default function WriteReview1({ navigation, route }) {
    const { me } = useContext(AuthContext);
    const { showSnackbar } = useContext(AppContext);
    const { openImagePicker } = useContext(AppContext);

    // 리뷰 가져오기
    const [ review, setReview ] = useState();
    const is_id = useMemo(() => {
        return route.params.is_id;
    }, [ route.params ]);
    useEffect(() => {
        if (is_id) loadData();
    }, [ is_id ]);

    const loadData = () => {
        const params = { is_id };
        API.get('/review/get_review.php', { params })
        .then(data => {
            setReview(data.data);
        })
        .catch(basicErrorHandler);
    }
    // 리뷰 가져오기

    const handleAdd = (values, actions) => {
        const data = new FormData();

        data.append('sl_sn', route.params.store.sl_sn);
        data.append('mb_id', me.mb_id);
        data.append('is_score', values.is_score);
        data.append('is_content', values.is_content);
        
        values.photos.forEach(photo => {
            data.append('files[]', {
                name: photo.path.slice(photo.path.lastIndexOf('/')),
				type: photo.mime,
				uri: photo.path,
            });
        });

        API.post('/review/add_review.php', data)
        .then(() => {
            showSnackbar('리뷰를 등록했습니다.');
            navigation.goBack();
        })
        .catch(basicErrorHandler)
        .finally(() => {
            actions.setSubmitting(false);
        });
    }

    const handleModify = (values, actions) => {
        const data = new FormData();

        data.append('is_id', is_id);
        data.append('is_score', values.is_score);
        data.append('is_content', values.is_content);
        
        API.post('/review/modify_review.php', data)
        .then(() => {
            showSnackbar('리뷰를 수정했습니다.');
        })
        .catch(basicErrorHandler)
        .finally(() => {
            actions.setSubmitting(false);
        });
    }

    const dimenstions = useWindowDimensions();
    const imageWidth = useMemo(() => {
        return (dimenstions.width - 45) / 3
    }, [ dimenstions ]);

    return (
        <ScrollView>
            <Formik
                initialValues={{ 
                    is_score: review ? review.is_score : 3,
                    is_content: review ? review.is_content : '',
                    files: review ? review.files : [],
                    photos: [],
                }}
                validationSchema={Yup.object().shape({
                    is_score: Yup.string().required('필수입력입니다.'),
                    is_content: Yup.string().required('필수입력입니다.'),
                })}
                enableReinitialize={true}
                onSubmit={is_id ? handleModify : handleAdd}
            >
                {({handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, dirty, touched, errors, isValid, values, isSubmitting }) => <>
                    <View style={{ padding: 15, backgroundColor: 'white' }}>
                        <View style={{alignItems: 'center', flex: 1}}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: '6%', marginBottom: '8%' }}>음식은 맛있게 드셨나요?</Text>
                            <Text style={{textAlign: 'center', fontSize: 16}}>업체와 음식에 대한 리뷰를 작성해주세요{'\n'}작성해주신 리뷰는 저희에게 큰 힘이 됩니다.</Text>
                        </View>

                        <View style={{ marginTop: 37, alignItems: 'center' }}>
                            <Stars stars={values.is_score} setStars={value => setFieldValue('is_score', value)} />
                        </View>

                        <View style={{ marginTop: 50 }}>
                            <Text style={[style.text2, { marginTop: 20, marginBottom: 15}]}>리뷰내용</Text>
                            <TextInput
                                style={{...cstyles.input, height: 100 }}
                                textAlignVertical="top"
                                maxLength={100} 
                                multiline={true} 
                                placeholder="리뷰내용을 입력해주세요 (최대 100자)"
                                value={values.is_content}
                                onChangeText={handleChange('is_content')}
                                handleBlur={handleBlur('is_content')}
                            />
                            <Text style={{ color: 'red' }}>{touched.is_content && errors.is_content || ' '}</Text>

                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 15, paddingTop: 15 }}>
                                    <Text style={[style.text2]}>사진첨부</Text>
                                    <Text style={{color: '#E51A47'}}>사진은 최대 3장까지 첨부 가능합니다</Text>
                                </View>
                                <View style={{flexDirection: 'row', marginRight: -15 }}>
                                    {values.files.map((file, index) => <View key={file.id} style={{ borderWidth: 1, borderColor: '#E5E5E5', height: imageWidth, width: imageWidth, borderRadius: 3, marginRight: 5 }}>
                                        <Image source={{ uri: file.download_url }} style={{ width: '100%', height: '100%', borderRadius: 5 }} />
                                        <TouchableWithoutFeedback onPress={() => { 
                                            API.post('/common/remove_file.php', { id: file.id })
                                            .then(() => {
                                                showSnackbar('이미지를 삭제했습니다.');
                                                loadData();
                                            })
                                            .catch(basicErrorHandler);
                                        }}>
                                            <Image source={require('../images/reviewx.png')} style={{ position: 'absolute', right: 5, top: 5, width: 25, height: 25 }} />
                                        </TouchableWithoutFeedback>
                                    </View>)}

                                    {values.photos.map((photo, index) => <View key={index} style={{ borderWidth: 1, borderColor: '#E5E5E5', height: imageWidth, width: imageWidth, borderRadius: 3, marginRight: 5 }}>
                                        <Image source={{ uri: photo.path }} style={{ width: '100%', height: '100%', borderRadius: 5 }} />
                                        <TouchableWithoutFeedback onPress={() => { 
                                            const result = [ ...values.photos ];
                                            result.splice(index, 1);
                                            setFieldValue('photos', result);
                                        }}>
                                            <Image source={require('../images/reviewx.png')} style={{ position: 'absolute', right: 5, top: 5, width: 25, height: 25 }} />
                                        </TouchableWithoutFeedback>
                                    </View>)}

                                    {values.photos.length + values.files.length < 3 && <TouchableOpacity onPress={() => { 
                                        openImagePicker(photo => {
                                            if (!is_id) {
                                                const result = [ ...values.photos ];
                                                result.push(photo);
                                                setFieldValue('photos', result);
                                            }
                                            else {
                                                const data = new FormData();
                                                data.append('category', 'review');
                                                data.append('ref_id', is_id);
                                                data.append('file', {
                                                    name: photo.path.slice(photo.path.lastIndexOf('/')),
                                                    type: photo.mime,
                                                    uri: photo.path,
                                                });

                                                API.post('/common/add_file.php', data)
                                                .then(() => {
                                                    showSnackbar('이미지를 첨부했습니다.');
                                                    loadData();
                                                })
                                                .catch(basicErrorHandler)
                                                .finally(() => {
                                                    actions.setSubmitting(false);
                                                });
                                            }
                                        }); 
                                    }}>
                                        <View style={{ borderWidth: 1, borderColor: '#E5E5E5', height: imageWidth, width: imageWidth, borderRadius: 3, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image source={require('../images/reviewplus.png')}></Image>
                                        </View>
                                    </TouchableOpacity>}
                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: 30 }}><Button disabled={isSubmitting} loading={isSubmitting} onPress={handleSubmit}>{is_id ? '리뷰 수정 완료' : '리뷰 작성 완료'}</Button></View>
                    </View>
                </>}
            </Formik>

        </ScrollView>

    );
}
