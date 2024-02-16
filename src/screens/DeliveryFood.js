import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { Text, Image, View, ScrollView, useWindowDimensions, TouchableWithoutFeedback } from 'react-native';

import Loading from '../components/Loading';
import API from '../api';
import colors from '../appcolors';
import { basicErrorHandler } from '../http-error-handler';


export default function DeliveryFoodScreen({route, navigation}) {
    const [ categories, setCategories ] = useState();
    useEffect(() => {
        API.post('/category_list.php', { ca_id: route.params.category.ca_id })
        .then(data => setCategories(data.rowdata))
        .catch(basicErrorHandler);
    }, [ route.params])

    const handleCategoryClick = (category) => {
        navigation.navigate('DeliveryList', { category, categories, title: route.params.category.ca_name });
    }

    const dimensions = useWindowDimensions();
    const categoryItemWidth = useMemo(() => {
        return (dimensions.width - 30) / 4;
    }, [ dimensions ]);

    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            <View style={{backgroundColor: 'white'}}>
                <View style={{margin: 15}}>
                    <View>
                        {/* 카테고리 */}
                        {categories ? <View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {categories.map(category => <Fragment key={category.ca_id}>
                            <TouchableWithoutFeedback onPress={() => { handleCategoryClick(category) }}>
                                <View style={{ width: categoryItemWidth, alignItems: 'center', paddingVertical: 20, borderColor: colors.borderColor, borderBottomWidth: 1 }}>
                                    <Image style={{ width: 70, height: 70 }} source={{ uri: category.cate_img }} />
                                    <Text style={{ marginTop: 10, fontSize: 16 }}>{category.ca_name}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            </Fragment>)}
                        </View>
                        </View> : <Loading />}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
