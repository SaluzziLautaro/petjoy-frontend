// src/components/LoginPage.jsx

import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Box, Button, TextField, Typography, Paper, Stack, Link, Checkbox, FormControlLabel, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

function LoginPage({ onSwitchToRegister }) {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            // La redirección al Dashboard la manejará App.jsx automáticamente
        } catch (err) {
            setError(err.response?.data?.error || 'No se pudo iniciar sesión. Verifica tus datos.');
        }
    };

    return (
        <Box 
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#FFFBEF',
                fontFamily: 'Roboto, sans-serif'
            }}
        >
            <Paper 
                elevation={6}
                sx={{
                    padding: { xs: 3, sm: 5 },
                    width: '100%',
                    maxWidth: '440px',
                    margin: 2,
                    borderRadius: '12px',
                    textAlign: 'center'
                }}
            >
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#0A3832' }}>
                    Inicia Sesión en <Box component="span" sx={{ color: '#16655B' }}>PetJoy</Box>
                </Typography>
                
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                    ¡Tu mascota te espera!
                </Typography>

                {error && <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>{error}</Alert>}

                <Box component="form" onSubmit={handleLogin} sx={{ mt: 4 }}>
                    <Stack spacing={2}>
                        <TextField 
                            label="Correo electrónico" 
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField 
                            label="Contraseña" 
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                        />
                        
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ fontSize: '0.875rem' }}>
                           <FormControlLabel control={<Checkbox defaultChecked sx={{color: '#16655B', '&.Mui-checked': {color: '#16655B'}}} />} label="Recordarme" />
                           <Link href="#" underline="hover" sx={{ color: '#16655B', fontWeight: 'medium' }}>
                                Recuperar contraseña
                           </Link>
                        </Stack>
                        
                        <Button type="submit" variant="contained" size="large" fullWidth sx={{
                            backgroundColor: '#F2994A',
                            '&:hover': { backgroundColor: '#e68a3e' },
                            borderRadius: '50px',
                            py: 1.5,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '1rem'
                        }}>
                            Ingresar
                        </Button>
                        
                        <Button variant="outlined" size="large" fullWidth startIcon={<GoogleIcon />} sx={{
                            borderRadius: '50px',
                            borderColor: 'grey.400',
                            color: 'text.primary',
                            textTransform: 'none',
                            fontSize: '1rem'
                        }}>
                            Continuar con Google
                        </Button>

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