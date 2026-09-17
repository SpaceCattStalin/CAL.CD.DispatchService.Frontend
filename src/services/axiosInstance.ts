import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const authUrl = import.meta.env.VITE_AUTH_BASE_URL;

const getAuthToken = () => {
    const identity = localStorage.getItem("identity");
    return identity ? JSON.parse(identity).accessToken : null;
};

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(config => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = 'Bearer ' + token;
    }

    return config;
});

export const authInstance = axios.create({
    baseURL: authUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosInstance;
