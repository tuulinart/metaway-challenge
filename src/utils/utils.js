import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export const SAVE_DATA_PROFILE = "saveData";
export const SAVE_TOKEN_STORAGE = "saveToken";
export const USER_INFO_STORAGE = "userINFO";

export function showToast(type, message) {
    return new Promise((resolve) => {
        if (type == "warning") {
            toast.warning(message, {
                autoClose: 1500,
                position: "top-center",
            });
        } else if (type == "error") {
            toast.error(message, {
                autoClose: 1500,
                position: "top-center",
            });
        } else {
            toast.success(message, {
                autoClose: 1500,
                position: "top-center",
            });
        }
        setTimeout(() => {
            resolve(true);
        }, 2100);
    });
}

export const isTokenExpired = (token) => Date.now() >= (JSON.parse(atob(token.split('.')[1]))).exp * 1000;