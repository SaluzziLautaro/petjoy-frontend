// src/components/ResetPasswordPage.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Stack, Alert } from '@mui/material';
import api from '../api/api';

function ResetPasswordPage() {
    const { token } = useParams(); // Obtiene el token de la URL (ej. /reset-password/este-es-el-token)
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        setError('');
        setSuccess('');

        try {
            const response = await api.post(`/api/auth/reset-password/${token}`, { newPassword: password });
            setSuccess(response.data.msg + " Serás redirigido en 3 segundos...");
            setTimeout(() => navigate('/login'), 3000); // Redirige al login después de 3 segundos
        } catch (err) {
            setError(err.response?.data?.msg || 'Ocurrió un error.');
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#FFFBEF' }}>
            <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, width: '100%', maxWidth: '440px', margin: 2, borderRadius: '12px', textAlign: 'center' }}>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: '#0A3832' }}>
                    Restablecer Contraseña
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                    Ingresa tu nueva contraseña.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                {!success && (
                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField label="Nueva Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
                            <TextField label="Confirmar Nueva Contraseña" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required fullWidth />
                            <Button type="submit" variant="contained" size="large" fullWidth sx={{ backgroundColor: '#16655B', '&:hover': { backgroundColor: '#0A3832' }, borderRadius: '50px', py: 1.5 }}>
                                Guardar Contraseña
                            </Button>
                        </Stack>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}

export default ResetPasswordPage;