// src/App.jsx
import React, { useContext, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';

import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import PetsPage from './components/PetsPage';
import MainLayout from './components/MainLayout';
import PetDetailPage from './components/PetDetailPage';
import SubscriptionPlanPage from './components/SubscriptionPlanPage';
import SubscriptionPage from './components/SubscriptionPage'; 
import ProfilePage from './components/ProfilePage';
import ProductAdminPage from './components/admin/ProductAdminPage';
import UserAdminPage from './components/admin/UserAdminPage';
import ForgotPasswordPage from './components/ForgotPasswordPage'; 
import ResetPasswordPage from './components/ResetPasswordPage';
import LandingPage from './components/LandingPage';

import { Box, CircularProgress } from '@mui/material';

// Componente para las rutas protegidas que requieren login
function ProtectedRoutes() {
    return (
        <MainLayout>
            <Routes>
                <Route path="/dashboard/" element={<DashboardPage />} />
                <Route path="/dashboard/mascotas" element={<PetsPage />} />
                <Route path="/mascotas/:id" element={<PetDetailPage />} />
                <Route path="/suscripciones" element={<SubscriptionPage />} />
                <Route path="/nuevo-plan" element={<SubscriptionPlanPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
            </Routes>
        </MainLayout>
    );
}
function AdminRoutes() {
    return (
        <MainLayout>
            <Routes>
                <Route path="/products" element={<ProductAdminPage />} />
                <Route path="/users" element={<UserAdminPage />} />
                <Route path="/*" element={<Navigate to="/admin/products" />} />
            </Routes>
        </MainLayout>
    );
}
function AuthScreens() {
    const [isLoginPage, setIsLoginPage] = useState(true);
    const showLogin = (e) => { e.preventDefault(); setIsLoginPage(true); };
    const showRegister = (e) => { e.preventDefault(); setIsLoginPage(false); };

    return isLoginPage 
        ? <LoginPage onSwitchToRegister={showRegister} /> 
        : <RegisterPage onSwitchToLogin={showLogin} />;
}

function App() {
    const { token, user, loading } = useContext(AuthContext);

    if (loading) {
        return ( <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box> );
    }

    return (
        <Routes>
            {/* Rutas Públicas (cuando NO hay token) */}
            <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/login" />} />
            <Route path="/forgot-password" element={!token ? <ForgotPasswordPage /> : <Navigate to="/" />} />
            <Route path="/reset-password/:token" element={!token ? <ResetPasswordPage /> : <Navigate to="/" />} />

            {/* Rutas Privadas (cuando SÍ hay token) */}
            <Route 
                path="/dashboard/*" 
                element={
                    token ? (
                        user?.isAdmin ? <AdminRoutes /> : <ProtectedRoutes />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            {/* Si un usuario logueado intenta ir a una ruta pública, lo mandamos al dashboard */}
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/"} />} />
        </Routes>
    );
}

export default App;