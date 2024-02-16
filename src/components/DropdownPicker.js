import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import cstyles from '../cstyles';
import colors from '../appcolors';


const DropdownPicker = ({ open, setOpen, items, value, setValue, placeholder}) => {
    return (
        <DropDownPicker
            placeholder={placeholder || '선택하세요.'}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            style={{ ...cstyles.borderRounded }}
            labelStyle={{ fontSize: 16, color: colors.textPrimary }}
            textStyle={{ fontSize: 16, color: colors.textPrimary }}
            placeholderStyle={{ fontSize: 16, color: colors.textSecondary }}
        />
    );
}

export default DropdownPicker;