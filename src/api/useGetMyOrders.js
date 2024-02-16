import { useState, useEffect, useContext } from 'react';
import messaging from '@react-native-firebase/messaging';
import API from '../api';
import { AuthContext } from '../contexts/auth-context';
import { basicErrorHandler } from '../http-error-handler';


const useGetMyOrders = (page, setPage, trigger) => {
    const [ loading, setLoading ] = useState(false);
    const [ fetched, setFetched ] = useState(false);
    const [ rows, setRows ] = useState();
    const [ mayMore, setMayMore ] = useState(true);

    const { me } = useContext(AuthContext);

    useEffect(() => {
        setRows([]);
        setFetched(false);
        setMayMore(true);
        setPage(1);
    }, [ trigger ]);
    
    useEffect(() => {
        if (!mayMore) return;
        
        setLoading(true);

        messaging().getToken()
        .then((token) => {
            const params = { token, page };
            if (me) params['mb_id'] = me.mb_id;
            
            return API.get('/order/get_my_orders.php', { params });
        })
        .then(data => {
            setRows(rows => {
                const result = rows.concat(data.data);
                return result;
            });
            setMayMore(data.data.length === 10);
            setFetched(true);
        })
        .catch(basicErrorHandler)
        .finally(() => { setLoading(false); });
    }, [ page, mayMore, trigger ]);

    return { loading, fetched, rows };
}

export default useGetMyOrders;