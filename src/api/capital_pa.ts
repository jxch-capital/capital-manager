import axios from 'axios'

const capital_pa_api = axios.create({
    baseURL: window.location.protocol === 'https:' ? 'https://jiangxicheng.site/capital_pa' : 'http://jiangxicheng.site:18088/',
    timeout: 90000,
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json;charset=utf-8'}
})

export const pa_analyze_default = (params: Object) => capital_pa_api.post(`/pa/analyzeDefault`, JSON.stringify(params))

export const capital_pa_apis = {
    pa_analyze_default,
}