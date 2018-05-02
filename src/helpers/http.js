import axios from 'axios'

export const HTTP = axios.create({
    baseURL: process.env.NODE_ENV == 'development' ? 'http://genuine.localhost/api/' : 'https://avangard.market/api/',
    params: {
        uid: null,
        sid: null,
    },
})