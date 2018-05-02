import axios from 'axios'

export const HTTP = axios.create({
    baseURL: 'http://genuine.localhost/api/',
    params: {
        uid: null,
        sid: null,
    },
})