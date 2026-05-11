import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { Capacitor } from "@capacitor/core";

function getBaseURL(): string {
  const url = import.meta.env.VITE_API_URL || "http://localhost:8000/";
  if (Capacitor.isNativePlatform()) {
    return url.replace("localhost", "10.0.2.2");
  }
  return url;
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});
// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore()
        if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const authStore = useAuthStore()
            if(authStore.isAuthenticated){
                authStore.logout()
            }
        }
        return Promise.reject(error)
    }
)

export default api
