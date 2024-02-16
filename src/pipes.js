import moment from 'moment';
import globals from './globals';
import constants from './constants';


exports.address_pipe = (address) => {
    if (!address) return '';
    return address.road_address || address.legal_address;
}

exports.fulladdress_pipe = (address) => {
    if (!address) return '';
    return `${address.road_address || address.legal_address} ${address.address_detail}`;
}

exports.order_fulladdress_pipe = (order, division) => {
    if (order.od_delv_flag === 'P') return '';  // 포장

    let address = '';
    let addressDetail = '';
    if (order.version == 2) {
        if (division === 'user') {
            address = order.user_address.road_address || order.user_address.legal_address;
            addressDetail = order.user_address.address_detail;
        }
        else if (division === 'start') {
            address = order.start_address.road_address || order.start_address.legal_address;
            addressDetail = order.start_address.address_detail;
        }
        else if (division === 'end') {
            address = order.end_address.road_address || order.end_address.legal_address;
            addressDetail = order.end_address.address_detail;
        }
    }
    else {
        if (order.od_type === 'Q') {
            if (division === 'start') {
                address = order.od_addr1;
                addressDetail = order.od_addr2;
            }
            else if (division === 'end') {
                address = order.od_b_addr1;
                addressDetail = order.od_b_addr2;
            }
        }
        else {
            address = order.od_addr1;
            addressDetail = order.od_addr2;
        }
    }
    return `${address} ${addressDetail}`;
}

exports.order_address_pipe = (order, division) => {
    if (order.od_delv_flag === 'P') return '';  // 포장

    if (order.version == 2) {
        if (division === 'user') {
            return order.user_address.road_address || order.user_address.legal_address;
        }
        else if (division === 'start') {
            return order.start_address.road_address || order.start_address.legal_address;
        }
        else if (division === 'end') {
            return order.end_address.road_address || order.end_address.legal_address;
        }
    }
    else {
        if (order.od_type === 'Q') {
            if (division === 'start') {
                return order.od_addr1;
            }
            else if (division === 'end') {
                return order.od_b_addr1;
            }
        }
        else {
            return order.od_addr1;
        }
    }
}

exports.order_address_detail_pipe = (order, division) => {
    if (order.od_delv_flag === 'P') return '';  // 포장
    
    if (order.version == 2) {
        if (division === 'user') {
            return order.user_address.address_detail;
        }
        else if (division === 'start') {
            return order.start_address.address_detail;
        }
        else if (division === 'end') {
            return order.end_address.address_detail;
        }
    }
    else {
        if (order.od_type === 'Q') {
            if (division === 'start') {
                return order.od_addr2;
            }
            else if (division === 'end') {
                return order.od_b_addr2;
            }
        }
        else {
            return order.od_addr2;
        }
    }
}

exports.order_contact_pipe = (order, division) => {
    let contact = '';
    if (order.version == 2) {
        if (division === 'user') contact = order.user_address.contact;
        else if (division === 'start') contact = order.start_address.contact;
        else if (division === 'end') contact = order.end_address.contact;
    }
    else {
        if (order.od_type === 'Q') {
            if (division === 'user') contact = order.od_q_hp || order.od_hp;
            if (division === 'start') contact = order.od_hp;
            else if (division === 'end') contact = order.od_b_hp;
        }
        else contact = order.od_hp;
    }
    return exports.mobile_pipe(contact);
}

exports.order_username_pipe = (order, division) => {
    if (order.version == 2) {
        if (division === 'user') return order.user_address.name;
        else if (division === 'start') return order.start_address.name;
        else if (division === 'end') return order.end_address.name;
    }
    else {
        if (order.od_type === 'Q') {
            if (division === 'user') return order.od_q_name || order.od_name;
            else return '-';
        }
        else return order.od_name;
    }
}





exports.store_address_pipe = (store) => {
    const address = store.sl_addr1 || store.sl_addr3;
    return address + ' ' + store.sl_addr2;
}

// 주문 메뉴 개수
exports.order_menu_length_pipe = (order) => {
    // const tip = order.od_item.find(item => item.it_id == 0);
    // let menuLength = order.od_item.length;
    // if(tip) menuLength = menuLength - 1;
    // return menuLength;
    return order.od_cart_count;
}

// 장바구니 메뉴 요약
exports.cart_items_summary = (cart_items) => {
    if (cart_items.length > 1) {
        return `${cart_items[0].it_name} 외 ${cart_items.length - 1} 건`;
    }
    else if (cart_items.length == 1) {
        return cart_items[0].it_name;
    }
    else {
        return '-';
    }
}

// 온라인 여부
exports.order_online_pipe = (order) => {
    return order.online_offline == 'O';
}

// 배달 / 포장
exports.order_delivery_wrap_pipe = (order) => {
    if (order.od_delv_flag == 'D') return '배달';
    if (order.od_delv_flag == 'P') return '포장';
    else return '-';
}

// 결제 방법
exports.order_pay_method_pipe = (order) => {
    switch(order.od_settle_case) {
        case 'card': return '카드';
        case 'dbank': return '계좌이체';
        case 'vbank': return '가상계좌';
        default: return '-';
    }
}

// 결제금액 
exports.order_pay_price_pipe = (order) => {
    if (order.od_type == 'P') {
        return +order.od_cart_price + +order.od_send_cost - +order.od_coupon_price;
    }
    else {
        return +order.od_cart_price + +order.od_send_cost - +order.od_coupon_price;
    }
}

// 주문상태
exports.order_state_pipe = (order) => {
    if (order.od_type == 'P') {
        if (order.od_delv_flag == 'D') {    // 배달
            switch(order.od_state) {
                case 'waiting': return '주문완료';
                case 'accepted': return '접수완료';
                case 'taken': return '라이더지정됨';
                case 'ondelivery': return '배달중'; 
                case 'canceled': return '취소됨'; 
                case 'delivered': return '배달완료';
                default: return '-';
            }
        }
        else {  // 포장
            switch(order.od_state) {
                case 'waiting': return '주문완료';
                case 'accepted': return '접수완료';
                case 'canceled': return '취소됨'; 
                case 'delivered': return '구매완료';
                default: return '-';
            }
        }
    }
    else { // 퀵배달
        switch(order.od_state) {
            case 'accepted': return '라이더요청중';
            case 'taken': return '라이더지정됨';
            case 'ondelivery': return '배달중'; 
            case 'canceled': return '취소됨'; 
            case 'delivered': return '배달완료';
            default: return '-';
        }
    }
}

// 시간
exports.time_pipe = (datetime) => {
    if (!datetime) return '-';
    const now = moment();
    const time = moment(datetime);
    const duration = moment.duration(now.diff(time));
    const minutes = Math.ceil(duration.asMinutes());
    if (minutes < 1) {
        return '방금전';
    }
    if (minutes < 60) {
        return minutes + '분 전';
    }
    if (minutes < 1440) {
        return duration.hours() + '시간 ' + duration.minutes() + '분 전';
    }
    return datetime;
}

// 쿠폰 배달/포장 구분
exports.coupon_method_pipe = (coupon) => {
    const method  = coupon.cp_method2;
    return method == '0' ? '배달/포장' : method == '1' ? '배달' : '포장';
}

exports.number_format_pipe = (x) => {
    if (!x) return x;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

exports.mobile_pipe = (number) => {
    if (number?.length !== 11) return number;
    return `${number.substring(0,3)}-${number.substring(3,7)}-${number.substring(7,11)}`;
}

exports.store_distance_pipe = (store) => {
    if (!store.distance || store.distance.length < 3 || store.distance == '1000000km') return '-';
    const distance = store.distance.slice(0,-2);
    return Math.round(distance * 10) / 10 + 'km';
}

exports.is_menu_represent_pipe = (menu) => {
    return menu.mnu_represent && menu.mnu_represent == 'Y';
}

exports.is_menu_adult_pipe = (menu) => {
    return menu.adult_flag && menu.adult_flag == 'Y';
}

exports.store_worktime_timeonly_pipe = (store) => {
    if (!store.worktime || store.worktime.length == 0) return '-';
    const info = store.worktime[0];
    let text = `${info.start_time} ~ ${info.end_time}`;
    return text;
}

exports.store_holiday_pipe = (store) => {
    if (!store.holiday || store.holiday.length == 0) return '-';
    let text = '';
    store.holiday.forEach(item => {
        text += `${item.week_name} ${item.yoil}, `;
    });
    if (text.length > 2) return text.slice(0, -2);
    else return text;
}

exports.store_worktime_pipe = (store) => {
    return store.worktimes.map(times => {
        // 고객이 요일은 노출시키지 말라고함
        // const dayList = times.days.split(',').map(day => constants.DAYS.find(item => item.key == day).name);
        // const daySpan = dayList.length > 6 ? '매일' : dayList.join(',');    
        return `${times.start_time.substring(0,5)} ~ ${times.end_time.substring(0,5)}`;
    });
}

exports.store_breaktime_pipe = (store) => {
    return store.breaktimes.map(times => {
        return `${times.start_time.substring(0,5)} ~ ${times.end_time.substring(0,5)}`;
    });
}

exports.store_restdays_pipe = (store) => {
    if (!store || store.restdays.length == 0) return '-';

    // 주단위로 정렬
    const nths = [];
    for (let i=1; i<6; i++) {
        const nth = store.restdays.filter(item => item.nth == i);
        if (nth.length > 0) nths.push(nth);
    }

    // 매주설정인지 판별
    if (isEveryWeek(nths)) {
        const days = nths[0];
        let postfixList = [];
        for (let day of days) {
            postfixList.push(constants.DAYS.find(item => item.key === day.day).name);
        }

        return '매주 ' + postfixList.join(',') + '요일'
    }
    else {
        let nthList = store.restdays.map(item => item.nth);
        nthList = Array.from(new Set(nthList));  // make unique
        nthList.sort();
        const prefix = nthList.join(',') + ' 째주';
        const postfix = constants.DAYS.find(item => item.key == store.restdays[0].day).name + '요일';
        return prefix + ' ' + postfix;
    }

    // 복잡해서 그냥 예외 생각하지 않고 간단히 만듬
    function isEveryWeek(nths) {
        if (nths.length < 5) return false;
        const first = nths[0];
        for (let days of nths) {
            if (days.length === 0) return false;
            if (first.length !== days.length) return false;
        }
        return true;
    }
}

exports.coupon_method_pipe = (coupon) => {
    switch(coupon.cp_method2) {
        case '0': return '배달/포장';
        case '1': return '배달';
        case '2': return '포장';
        default: return '-';
    }
}

exports.menu_price_pipe = (item) => {
    let additional = 0;
    item.items.forEach(el => {
        additional = additional + +el.oit_price
    });
    return (+item.mnu_price + additional) * + item.it_qty;
}

exports.single_menu_price_pipe = (menu) => {
    let additional = 0;
    menu.items.forEach(el => {
        additional = additional + +el.oit_price
    });
    return +menu.mnu_price + additional;
}

// 결제 유무와 상관없이 결제금액
exports.od_receipt_price_pipe = (order) => {
    return +order.od_cart_price + +order.od_send_cost - +order.od_coupon_price;
}

// 성인체크
// 출력: need_login(로그인 필요), need_authenticate (본인확인필요), no_adult(성인아님), adult(성인)
exports.check_adult_pipe = (me) => {
    if (!me) return 'need_login';
    if (!me.mb_birth || isNaN(me.mb_birth) || me.mb_birth < 1900 || me.mb_birth > 2050) return 'need_authenticate';
    const currentYear = new Date().getFullYear();
    const age = currentYear - me.mb_birth + 1;
    if (age < 20) return 'no_adult';
    return 'adult';
}


exports.http_url_pipe = (url) => {
    if (!url) return url;
    if (url.startsWith('http')) return url;
    else return globals.baseURL + url;
}

exports.get_image_height = (width, height, maxWidth) => {
    const rWidth = Math.min(+width, maxWidth);
    return Math.round(rWidth / +width * +height);
}