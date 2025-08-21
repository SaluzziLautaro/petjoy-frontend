// src/components/RegisterPage.jsx (Versión de Depuración)

import React, { useState } from 'react';
import axios from 'axios'; // Importamos axios directamente para la prueba
import { Box, Button, TextField, Typography, Paper, Stack, Link, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

function RegisterPage({ onSwitchToLogin }) {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [direccion, setDireccion] = useState('');
    const [celular, setCelular] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deliveryInstructions, setDeliveryInstructions] = useState(''); 
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        console.log("REGISTRO: Intentando enviar a http://localhost:3000/api/auth/register");
        try {
            await register({ nombre, email, password, direccion, celular });
        } catch (err) {
            setError(err.response?.data?.error || 'No se pudo completar el registro.');
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#FFFBEF' }}>
            <Paper elevation={6} sx={{ padding: { xs: 3, sm: 5 }, width: '100%', maxWidth: '440px', margin: 2, borderRadius: '12px', textAlign: 'center' }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#0A3832' }}>
                    Crea tu Cuenta en <Box component="span" sx={{ color: '#16655B' }}>PetJoy</Box>
                </Typography>
                
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                    El primer paso para consentir a tu mascota.
                </Typography>

                {error && <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>{error}</Alert>}

                <Box component="form" onSubmit={handleRegister} sx={{ mt: 4 }}>
                    <Stack spacing={2}>
                        <TextField label="Nombre Completo" variant="outlined" value={nombre} onChange={(e) => setNombre(e.target.value)} required fullWidth />
                        <TextField label="Correo electrónico" type="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
                        <TextField label="Contraseña" type="password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
                        {/* --- CORRECCIÓN AQUÍ: Añadimos 'required' --- */}
                        <TextField label="Dirección" variant="outlined" value={direccion} onChange={(e) => setDireccion(e.target.value)} required fullWidth />
                        <TextField label="Celular" variant="outlined" value={celular} onChange={(e) => setCelular(e.target.value)} required fullWidth />
                        <TextField label="Indicaciones de entrega (opcional)" variant="outlined" value={deliveryInstructions} onChange={(e) => setDeliveryInstructions(e.target.value)} fullWidth multiline rows={2}/>
                        <Button type="submit" variant="contained" size="large" fullWidth sx={{ backgroundColor: '#F2994A', '&:hover': { backgroundColor: '#e68a3e' }, borderRadius: '50px', py: 1.5, fontWeight: 'bold' }}>
                            Registrarme
                        </Button>
                        
                        <Button variant="outlined" size="large" fullWidth startIcon={<GoogleIcon />} sx={{ borderRadius: '50px', borderColor: 'grey.400', color: 'text.primary' }}>
                            Continuar con Google
                        </Button>

                        <Typography variant="body2" color="text.secondary" sx={{ pt: 2 }}>
                            ¿Ya tienes una cuenta?{' '}
                            <Link href="#" onClick={onSwitchToLogin} underline="hover" sx={{ color: '#16655B', fontWeight: 'bold', cursor: 'pointer' }}>
                                Inicia sesión aquí
                            </Link>
                        </Typography>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}

export default RegisterPage;