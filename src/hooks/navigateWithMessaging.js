import { navigationRef } from '../navigation/RootNavigation';

const navigateWithMessaging = (data, withDelay) => {
    if (!data) return;

    const od_id = data.od_id;
    if (od_id && navigationRef.current) {
        if (withDelay) {
            setTimeout(() => {
                navigationRef.current.navigate('MyOrderDetail', { od_id });
            }, 1500);
        }
        else {
            navigationRef.current.navigate('MyOrderDetail', { od_id });
        }
    }
}

export default navigateWithMessaging;