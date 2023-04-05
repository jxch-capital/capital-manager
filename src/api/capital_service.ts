import axios from 'axios'

const capital_service_api = axios.create({
    baseURL: 'jiangxicheng.xyz:15000',
    timeout: 3000
})

export const query_k_json = (params: Object) => capital_service_api.post(`/base/query_k_json`, {params})
export const query_breath_json = (params: Object) => capital_service_api.post(`/base/query_breath_json`, {params})


export const capital_service_apis = {
    query_k_json,
    query_breath_json
}


