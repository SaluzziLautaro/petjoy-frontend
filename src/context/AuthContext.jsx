// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api'; // Usamos nuestra instancia central de axios
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUserSession = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    // Hacemos la llamada al backend para verificar el token
                    const response = await api.get('/api/users/me');
                    // Si el backend responde OK, el token es válido y guardamos los datos del usuario
                    setUser(response.data);
                    setToken(storedToken);
                } catch (error) {
                    // Si el backend rechaza el token, limpiamos la sesión
                    console.error("La sesión ha expirado o el token es inválido. Cerrando sesión.");
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        verifyUserSession();
    }, []); // Este efecto se ejecuta solo una vez, al cargar la app

    const login = async (email, password) => {
        const response = await api.post('/api/auth/login', { email, password });
        const { token } = response.data;
        console.log("PASO 1 (LOGIN): Token recibido del backend:", token);
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        setUser(decodedToken.user); // Guardamos el usuario decodificado inmediatamente
        setToken(token);
    };

    const register = async (userData) => {
        const response = await api.post('/api/auth/register', userData);
        const { token } = response.data;
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        setUser(decodedToken.user);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };
    const googleLogin = async (googleToken) => {
        // Le enviamos el token de Google a nuestro backend
        const response = await api.post('/api/auth/google-login', { token: googleToken });
        const { token } = response.data; // Recibimos nuestro propio token de sesión
        
        // El resto es igual que un login normal
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        setUser(decodedToken.user);
        setToken(token);
    };
    
    return (
        <AuthContext.Provider value={{ token, user, loading, login, register, logout, googleLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;