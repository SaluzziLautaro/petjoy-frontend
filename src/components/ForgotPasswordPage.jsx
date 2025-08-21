// src/components/ForgotPasswordPage.jsx

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Stack, Link, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../api/api';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await api.post('/api/auth/forgot-password', { email });
            setSuccess(response.data.msg);
        } catch (err) {
            setError(err.response?.data?.msg || 'Ocurrió un error.');
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#FFFBEF' }}>
            <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, width: '100%', maxWidth: '440px', margin: 2, borderRadius: '12px', textAlign: 'center' }}>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: '#0A3832' }}>
                    Recuperar Contraseña
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                    Ingresa tu email y te enviaremos un enlace para restablecerla.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                {!success && (
                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
                            <Button type="submit" variant="contained" size="large" fullWidth sx={{ backgroundColor: '#16655B', '&:hover': { backgroundColor: '#0A3832' }, borderRadius: '50px', py: 1.5 }}>
                                Enviar Enlace
                            </Button>
                        </Stack>
                    </Box>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ pt: 3 }}>
                    <Link component={RouterLink} to="/login" underline="hover" sx={{ color: '#16655B', fontWeight: 'bold' }}>
                        Volver a Iniciar Sesión
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}

export default ForgotPasswordPage;