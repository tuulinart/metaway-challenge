import axios from "axios";
import { SAVE_TOKEN_STORAGE } from "../utils/utils.js";

const api = axios.create({
    baseURL: "https://demometaway.vps-kinghost.net:8485/api/"
});

api.interceptors.request.use((config) => {
    let authToken = JSON.parse(localStorage.getItem(SAVE_TOKEN_STORAGE));
    if (config.url != "auth/login") {
        config.headers['Authorization'] = `Bearer ${authToken.token}`;
    }
    return config;
})


export default api;