import React from 'react';
import { ActivityIndicator as RNIndicator } from 'react-native';
const colors = require('../appcolors');


const ActivityIndicator = (props) => <RNIndicator size="small" color={colors.secondary} style={{ marginRight: 4 }} {...props} />

export default ActivityIndicator;