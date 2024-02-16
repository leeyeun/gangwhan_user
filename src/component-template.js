import React, { useState, useContext, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ScrollView, FlatList, Alert, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { Formik } from 'formik';
import * as Yup from 'yup';

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


const _component = ({ navigation, route }) => {
	const { me } = useContext(AuthContext);

	return (
		<View style={{ flex: 1 }}>
			
		</View>
	);
}


const styles = StyleSheet.create({
});

export default _component;