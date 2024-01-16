import axios from "axios/index";

axios.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json'

        return config;
    },
    error => {
        return Promise.reject(error)
    }
)

export const {get, post, put, remove} = axios;