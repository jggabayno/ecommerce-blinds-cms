import axios from "axios"

export default function makeRequest(API_URL) {

    const headers = {
        Authorization: `Bearer ${sessionStorage.getItem('SESSION')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }

    const login = (endpoint, data) => axios.post(API_URL + endpoint, data);
    const get = (endpoint, isPrivate = true) => axios.get(API_URL + endpoint, isPrivate ? { headers } : undefined)
    const post = (endpoint, data, isPrivate = true) => axios.post(API_URL + endpoint, data, isPrivate ? { headers } : undefined)
    const update = (endpoint, data, isPrivate = true) => axios.put(API_URL + endpoint, data, isPrivate ? { headers } : undefined)
    const drop = (endpoint) => axios.delete(API_URL + endpoint, { headers })

    return { login, get, post, update, drop }
}