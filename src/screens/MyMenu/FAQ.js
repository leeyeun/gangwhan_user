import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { Text, Image, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import API from '../../api';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import globals from '../../globals';
import colors from '../../appcolors';
import cstyles from '../../cstyles';
import { basicErrorHandler } from '../../http-error-handler';
import Nodata from '../../components/Nodata';


export default function FAQ({navigation}) {
    const [ faqs, setFaqs ] = useState();
    useState(() => {
        API.get('/faq/get_faqs.php')
        .then(data => {
            const copied = data.data.map(el => {
                el.opened = false;
                return el;
            });
            setFaqs(copied);
        })
        .catch(basicErrorHandler);
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                {faqs ? <>
                    {faqs.map((faq, index) => <Fragment key={faq.fa_id}>
                        <View style={{ borderColor: colors.borderColor, borderBottomWidth: 1 }}>
                            <TouchableOpacity onPress={() => {
                                setFaqs(faqs => {
                                    const result = [...faqs];
                                    result[index].opened = !faq.opened;
                                    return result;
                                });
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 20 }}>
                                    <Text style={{ fontSize: 16, color: colors.textPrimary }}>{faq.fa_subject}</Text>
                                    <Image source={faq.opend ? require('../../images/accordionicon1.png') : require('../../images/accordionicon2.png')} style={{ width: 30, height: 30 }} />
                                </View>
                            </TouchableOpacity>
                            {faq.opened && <View style={{ backgroundColor: '#f6f6f6', padding: 20 }}>
                                <Text style={{ fontSize: 16, color: '#333333' }}>{faq.fa_content}</Text>
                            </View>}
                        </View>
                    </Fragment>)}
                    {faqs.length == 0 && <Nodata style={{ marginLeft: 20 }} />}
                </> : <Loading />}
            </ScrollView>
        </View>
    );
}


