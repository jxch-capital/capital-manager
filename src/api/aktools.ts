import axios from 'axios';
import axiosRetry from 'axios-retry';

const aktools_api = axios.create({
    baseURL: 'http://8.142.100.222:18088/',
    timeout: 90000,
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json;charset=utf-8'}
});

axiosRetry(aktools_api, {
    retries: 3,  // 设置重试次数
    retryDelay: (retryCount) => {
        return retryCount * 1000;  // 设置重试间隔为1秒
    },
    shouldResetTimeout: true  // 为每次重试设置新的超时时间
});

export const api_public = (item_id: String, params: Object) => aktools_api.get(`/api/public/${item_id}`, { params: params });

export const aktools_apis = {
    api_public
};
