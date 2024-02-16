import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, useWindowDimensions, Modal } from 'react-native';
import {navigate} from '../../navigation/RootNavigation';
import { AuthContext } from '../../contexts/auth-context';
import { AppContext } from '../../contexts/app-context';
import API from '../../api';
import Loading from '../../components/Loading';
import Stars from '../../components/Stars';
import { get_image_height } from '../../pipes';
import { basicErrorHandler } from '../../http-error-handler';
import style from '../../style/style';


const ReviewTab = ({ store }) => {
	const { me } = useContext(AuthContext);
	const { showAlert } = useContext(AppContext);
	const [ reviews, setReviews ] = useState();

	useEffect(() => {
		if (store) {
			const params = { sl_sn: store.sl_sn, expose: '1' };
			API.get('/review/search_review.php', { params })
			.then(data => { 
				setReviews(data.data);
			})
			.catch(basicErrorHandler);
		}
	}, [ store ]);

	// 리뷰쓰기가 가능한지 확인
	const [ canReview, setCanReview ] = useState(false);
	useEffect(() => {
		if (me) {
			const params = { mb_id: me.mb_id, sl_sn: store.sl_sn };
			API.get('/review/can_store_review.php', { params })
			.then(data => { 
				setCanReview(data.data.can_review == 'Y');
			})
			.catch(basicErrorHandler);
		}
		else {
			setReviews(false);
		}
		
	}, [ me, store ]);
	

	const handleWriteReviewPress = () => {
		if (!me) return showAlert('로그인이 필요한 기능입니다.');
		navigate('WriteReview1', { store });
	}

	const handleReviewPress = (review) => {
		if (me && review.mb_id == me.mb_id) {
			navigate('WriteReview1', { store, is_id: review.is_id });
		}
	}

	// image modal
	const dimensions = useWindowDimensions();
	const [ imageModalOpen, setImageModalOpen ] = useState(false);
	const imgRef = useRef();
	const handleImageClick = (file) => {
		imgRef.current = file;
		setImageModalOpen(true);
	}
	const imageModalMaxWidth = useMemo(() => {
		if (dimensions) return dimensions.width - 44;
	}, [ dimensions ]);
	// end: image modal

	
    const imageWidth = useMemo(() => {
        if (dimensions) return (dimensions.width - 45) / 3;
		else return 80;
    }, [ dimensions ]);
	
	return (<>
		{reviews ? <View>
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15 }}>
				<Text style={{fontSize: 18, fontWeight: 'bold'}}>사용자 리뷰 {reviews.length}개</Text>
				{canReview && <TouchableOpacity onPress={handleWriteReviewPress}>
					<Image source={require('../../images/deliverydetailwritereview.png')} style={{width: 101, height: 35}}></Image>
				</TouchableOpacity>}
			</View>

			{reviews.map(review => <TouchableWithoutFeedback key={review.is_id} onPress={() => { handleReviewPress(review) }}>
				<View style={{padding: 15, backgroundColor: 'white'}}>
					<View style={{ marginBottom: 4, flexDirection: 'row', alignItems: 'center'}}>
						<Text style={[{marginRight: 10}]}>{review.mb_nick}</Text>
						<Text style={{color: '#777777'}}>{review.is_time}</Text>
					</View>
					
					<Stars stars={review.is_score} />
					
					<View><Text style={[style.text2, {marginVertical: 10}]}>{review.is_content}</Text></View>
					
					<View style={{ flexDirection: 'row', marginRight: -15 }}>
						{review.files.map(file => 
							<TouchableWithoutFeedback key={file.id} onPress={() => { handleImageClick(file) }}>
								<Image source={{ uri: file.thumb_download_url || file.download_url }} style={{ width: imageWidth, height: imageWidth, marginRight: 5 }} />
							</TouchableWithoutFeedback>
						)}
					</View>

					{!!review.is_re && <View style={{ padding: 15, flexDirection: 'row', backgroundColor: '#F9F9F9', borderColor: '#E5E5E5', borderWidth: 1, borderRadius: 5, marginTop: 10, }}>
						<Image source={require('../../images/adminreviewicon.png')} style={{ width: 31, height: 30 }}></Image>
						<View style={{marginLeft: 15}}>
							<View style={{flexDirection: 'row'}}>
								<Text style={[styles.title, {marginRight: 10}]}>{store.sl_title}</Text>
								<Text style={{color: '#777777'}}>{review.is_re_date.substring(0,10)}</Text>
							</View>
							<Text style={style.text2}>{review.is_re}</Text>
						</View>
					</View>}

					<View style={{height: 20}}></View>
					<View style={{height: 1, backgroundColor: '#E5E5E5'}}></View>
				</View>
			</TouchableWithoutFeedback>)}
		</View> : <Loading />}

		<Modal
			transparent={true}
			visible={imageModalOpen}
			onRequestClose={() => {
				setImageModalOpen(false);
			}}
		>
			<TouchableWithoutFeedback onPress={() => { setImageModalOpen(false); }}>
				<View style={{ backgroundColor: 'rgba(0,0,0,0.7)', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					{imgRef.current && <Image source={{ uri: imgRef.current.download_url }} style={{ width: Math.min(+imgRef.current.width, imageModalMaxWidth), height: get_image_height(imgRef.current.width, imgRef.current.height, imageModalMaxWidth) }} />}
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	</>);
}


const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		padding: 15,
	  },
	  detailBox: {
		borderWidth: 0.5,
		borderColor: '#E5E5E5',
		height: 329,
		justifyContent: 'space-around',
		alignItems: 'center',
		padding: 15,
		backgroundColor: '#fff',
		shadowColor: '#000',
		shadowOffset: {width: 1, height: 1},
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 5,
	  },
	  callButton: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
		height: 45,
		alignItems: 'center',
	  },
	  couponeButton: {
		height: 50,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: '#FEEDEC',
		borderRadius: 6,
	  },
	  detailTitle: {fontSize: 24, fontWeight: 'bold'},
	  boldText: {fontSize: 16, fontWeight: 'bold'},
	  callBtnItem: {flexDirection: 'row', alignItems: 'center'},
	  footer:
		Platform.OS !== 'ios'
		  ? {
			  height: 50,
			  backgroundColor: '#E51A47',
			  borderTopLeftRadius: 15,
			  borderTopRightRadius: 15,
			  alignItems: 'center',
			  justifyContent: 'center',
			}
		  : {
			  height: 50,
			  backgroundColor: '#E51A47',
			  borderRadius: 15,
			  alignItems: 'center',
			  justifyContent: 'center',
			},
	  title: {marginRight: 20, marginBottom: 10, fontSize: 16, fontWeight: 'bold'},
	  contents: {marginBottom: 10, fontSize: 16},
});


export default ReviewTab;