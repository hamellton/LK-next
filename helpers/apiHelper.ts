import { headerArr } from 'helpers/defaultHeaders';
import { APIMethods } from '@/types/apiTypes';
import { APIService } from '@lk/utils';

interface APIInstanceType {
    method?: APIMethods,
    url?: string,
    sessionToken?: string,
}

export const createAPIInstance = ({
    url = `${process.env.NEXT_PUBLIC_API_URL}`, 
    method = APIMethods.GET, 
    sessionToken
}: APIInstanceType) => {
    const api = new APIService(url);
    if(sessionToken) {
        api.sessionToken = sessionToken;
    }
    api.setHeaders(headerArr).setMethod(method);
    return api;
}

