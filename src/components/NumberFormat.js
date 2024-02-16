import React from 'react';
import RNNumberFormat from 'react-number-format';

const NumberFormat = ({value, render}) => {
    return (
        <RNNumberFormat
            value={value}
            displayType={'text'}
            thousandSeparator={true}							
            renderText={render}
        />
    );
}

export default NumberFormat;