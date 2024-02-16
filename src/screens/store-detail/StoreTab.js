import React, { useState, useRef, useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback, Dimensions, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import CreateModal from '../../components/CreateModal';
import globals from '../../globals';
import colors from '../../appcolors';
import { mobile_pipe, store_worktime_pipe, store_breaktime_pipe, store_restdays_pipe } from '../../pipes';


const windowWidth = Dimensions.get('window').width;

const StoreTab = ({ store }) => {

	const storeImages = useMemo(() => {
		const result = [];
		if (store?.pic1) result.push(store.pic1);
		if (store?.pic2) result.push(store.pic2);
		if (store?.pic3) result.push(store.pic3);
		if (store?.pic4) result.push(store.pic4);
		return result;
	}, [ store ]);

	const webviewAddress = useMemo(() => {
        if (store.sl_lat && store.sl_lon) {
            return `${globals.baseURL}/jax/map_addres2.php?latlon=${store.sl_lat},${store.sl_lon}`;
        }
    }, [ store ]);

	// 상점 이미지
	const imageRef = useRef();
	const [ imageModalOpen, setImageModalOpen ] = useState(false);
	// end: 상점 이미지

	// 이미지 길이
	const dimensions = useWindowDimensions();
	const imageWidth = useMemo(() => {
		return (dimensions.width - 45) / 2;
	}, [ dimensions ]);

	// worktimes & holidays
    const worktimes_memos = useMemo(() => {
        if (store) {
            return store_worktime_pipe(store);
        }
    }, [ store ]);

    const breaktimes_memos = useMemo(() => {
        if (store) {
            return store_breaktime_pipe(store);
        }
    }, [ store ]);

    const restday_memo = useMemo(() => {
        return store_restdays_pipe(store);
    }, [ store ]);
    // end: worktimes & holidays

	return (<>
		{store && <View style={{backgroundColor: 'white'}}>
			<View style={{backgroundColor: 'white'}}>
				<View style={{ height: 50, justifyContent: 'center', backgroundColor: '#F9F9F9', borderBottomColor: '#E5E5E5', borderBottomWidth: 0.5, width: '100%', paddingHorizontal: 15 }}>
					<Text style={{fontSize: 18}}>가게소개</Text>
				</View>

				{/* images */}
				<View style={{ marginTop: 5, flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15 }}>
					{storeImages.map((item, index) => <View key={index} style={{ flexGrow: 1, marginTop: 10 }}>
						<TouchableWithoutFeedback onPress={() => {
							imageRef.current = item;
							setImageModalOpen(true);
						}}>
							<Image id={index} source={{ uri: item }} style={[ {width: imageWidth, height: imageWidth, borderRadius: 5 } ]} />
						</TouchableWithoutFeedback>
					</View>)}
				</View>
						
				{/* 소개글 */}
				<View style={{padding: 15}}><Text style={{fontSize: 16}}>{store.sl_soge}</Text></View>
				
				<View style={{width: '100%', paddingHorizontal: 15}}>
					{/* <Image source={require('../../images/map.png')} style={{resizeMode: 'cover', width: '100%'}}></Image> */}
					{webviewAddress && <WebView source={{ uri: webviewAddress }} style={{ height: 200, minHeight: 1, opacity: 0.99 }}	/>}
				</View>
				
				<View style={{ marginTop: 10 }}>
					<View style={{ height: 50, justifyContent: 'center', backgroundColor: '#F9F9F9', borderBottomColor: '#E5E5E5', borderBottomWidth: 0.5, width: '100%', paddingHorizontal: 15, }}>
						<Text style={{fontSize: 18}}>영업정보</Text>
					</View>
					<View style={{ paddingHorizontal: 15, paddingVertical: 20 }}>
						<View style={{flexDirection: 'row' }}>
							<Text style={styles.boldText}>영업시간</Text>
							<View style={{ flex: 1 }}>
								{worktimes_memos.length > 0 ? worktimes_memos.map((time, index) => <Text key={index} style={{ fontSize: 16, color: colors.textPrimary }}>{time}</Text>) : <Text style={{ fontSize: 16, color: colors.textPrimary }}>-</Text>}
							</View>
						</View>
						<View style={{height: 8}}></View>

						<View style={{flexDirection: 'row' }}>
							<Text style={styles.boldText}>휴식시간</Text>
							<View style={{ flex: 1 }}>
								{breaktimes_memos.length > 0 ? breaktimes_memos.map((time, index) => <Text key={index} style={{ fontSize: 16, color: colors.textPrimary }}>{time}</Text>) : <Text style={{ fontSize: 16, color: colors.textPrimary }}>-</Text>}
							</View>
						</View>
						<View style={{height: 8}}></View>

						<View style={{flexDirection: 'row' }}>
							<Text style={styles.boldText}>정기휴일</Text>
							<Text style={{ fontSize: 16, color: colors.textPrimary }}>{restday_memo}</Text>
						</View>
						<View style={{height: 8}}></View>

						<View style={{flexDirection: 'row' }}>
							<Text style={styles.boldText}>전화번호</Text>
							<Text style={{ fontSize: 16, color: colors.textPrimary }}>{mobile_pipe(store.sl_biztel || store.sl_hp)}</Text>
						</View>
						<View style={{height: 8}}></View>

						<View style={{flexDirection: 'row' }}>
							<Text style={styles.boldText}>편의시설</Text>
							<Text style={{ fontSize: 16, color: colors.textPrimary, flex: 1 }}>{store.sl_memo4}</Text>
						</View>
					</View>
				</View>
				<View>
					<View style={{ height: 50, justifyContent: 'center', backgroundColor: '#F9F9F9', borderBottomColor: '#E5E5E5', borderBottomWidth: 0.5, width: '100%', paddingHorizontal: 15, }}>
						<Text style={{fontSize: 18}}>안내 및 혜택</Text>
					</View>
					<View>
						<View style={{ padding: 15, backgroundColor: 'white', flexDirection: 'row' }}>
						<View style={{}}>
							<Text style={styles.contents}>{store.sl_memo3}</Text>
						</View>
						</View>
					</View>
				</View>
			</View>
		</View>}

		<CreateModal
			modalVisible={imageModalOpen}
			setModalVisible={setImageModalOpen}
			body={<Image source={{ uri: imageRef.current }} style={{ width: windowWidth * 0.8, height: 200, resizeMode: 'contain' }}></Image>}
		/>
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
	  boldText: {fontSize: 16, fontWeight: 'bold', width: 100},
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

export default StoreTab;