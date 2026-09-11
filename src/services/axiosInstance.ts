import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const authToken = import.meta.env.VITE_AUTH_TOKEN;

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
    },
});

export default axiosInstance;
