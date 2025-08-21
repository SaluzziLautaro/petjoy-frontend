// src/api/api.js

import axios from 'axios';

// 1. Creamos una instancia de Axios con la configuración base
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
});

// 2. Creamos el "Interceptor" que añade el token a CADA petición
api.interceptors.request.use(
    (config) => {
        console.log(`PASO 2 (INTERCEPTOR): Adjuntando token a la petición para: ${config.url}`, token);
        // Obtenemos el token de localStorage en el momento del envío
        const token = localStorage.getItem('token');
        if (token) {
            // Si el token existe, lo añadimos a la cabecera
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;