import axios from 'axios';

// Prefer explicit backend origin to ensure cookies/session auth work.
// Set VITE_API_URL in .env (e.g., http://localhost:8000/api in dev).
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Attach CSRF token for session-authenticated POST/PUT/PATCH/DELETE
        const csrf = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
        if (csrf) {
            (config.headers as any)['X-CSRF-TOKEN'] = csrf;
            (config.headers as any)['X-Requested-With'] = 'XMLHttpRequest';
        }
        const bearer = localStorage.getItem('token');
        if (bearer) {
            config.headers.Authorization = `Bearer ${bearer}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Don't redirect automatically, let components handle it
        }
        return Promise.reject(error);
    }
);
