// src/components/LoginPage.jsx

import React, { useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Stack, Link, Checkbox, FormControlLabel, Alert, CircularProgress } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import AuthContext from '../context/AuthContext';

function LoginPage({ onSwitchToRegister }) {
    const { login, googleLogin } = useContext(AuthContext); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login(email, password);
            // La redirección al Dashboard la maneja App.jsx automáticamente
        } catch (err) {
            setError(err.response?.data?.error || 'No se pudo iniciar sesión. Verifica tus datos.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSuccess = (credentialResponse) => {
        const googleToken = credentialResponse.credential;
        setIsSubmitting(true);
        googleLogin(googleToken).catch(() => {
            setError("No se pudo iniciar sesión con Google.");
            setIsSubmitting(false);
        });
    };

    const handleGoogleError = () => {
        setError("Falló el inicio de sesión con Google.");
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#FFFBEF' }}>
            <Paper elevation={6} sx={{ padding: { xs: 3, sm: 5 }, width: '100%', maxWidth: '440px', margin: 2, borderRadius: '12px', textAlign: 'center' }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#0A3832' }}>
                    Inicia Sesión en <Box component="span" sx={{ color: '#16655B' }}>PetJoy</Box>
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>¡Tu mascota te espera!</Typography>
                
                {error && <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>{error}</Alert>}

                <Box component="form" onSubmit={handleLogin} sx={{ mt: 4 }}>
                    <Stack spacing={2}>
                        <TextField label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
                        <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                           <FormControlLabel control={<Checkbox defaultChecked sx={{color: '#16655B', '&.Mui-checked': {color: '#16655B'}}} />} label="Recordarme" />
                           <Link component={RouterLink} to="/forgot-password" underline="hover" sx={{ color: '#16655B', fontWeight: 'medium' }}>
                                Recuperar contraseña
                           </Link>
                        </Stack>
                        
                        <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting} sx={{ backgroundColor: '#F2994A', '&:hover': { backgroundColor: '#e68a3e' }, borderRadius: '50px', py: 1.5, fontWeight: 'bold' }}>
                            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
                        </Button>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ pt: 2 }}>
                            ¿Eres nuevo?{' '}
                            <Link href="#" onClick={onSwitchToRegister} underline="hover" sx={{ color: '#16655B', fontWeight: 'bold', cursor: 'pointer' }}>
                                Crea una cuenta
                            </Link>
                        </Typography>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}

export default LoginPage;