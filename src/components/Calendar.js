import React, { useMemo } from 'react';

import { Calendar as CalendarRN, LocaleConfig } from 'react-native-calendars';


const Calendar = ({ current, selected, handleDatePress }) => {
    const cur = useMemo(() => {
        if (current) return current.format('YYYY-MM-01');
    }, [ current ]); 

    const markedDates = useMemo(() => {
        if (selected) {
            const result = {};
            selected.forEach(item => {
                result[item] = {selected: true, selectedColor: 'green'}
            });
            return result;
        }
    }, [ selected ]);
    

    LocaleConfig.locales['kr'] = {
        monthNames: [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ],
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    };
    LocaleConfig.defaultLocale = 'kr';

    return (
        <>
            <CalendarRN
                current={cur}
                onDayPress={handleDatePress}
                markedDates={markedDates}
                theme={{
                    todayTextColor: 'green',
                    textDisabledColor: '#ffffff',
                    selectedDayBackgroundColor: 'green',
                    textDayFontWeight: 'normal',
                    "stylesheet.calendar.header": {
                        dayTextAtIndex0: { color: 'red' },
                        dayTextAtIndex6: { color: 'blue' }
                    }
                }}
            />
        </>
    );
}

export default Calendar;