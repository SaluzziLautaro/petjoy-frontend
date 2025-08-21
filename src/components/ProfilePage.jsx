// src/components/ProfilePage.jsx

import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api/api.js';
import { Box, Typography, Paper, TextField, Button, Stack, Alert, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

function ProfilePage() {
    const { user, token } = useContext(AuthContext);
    
    // Estado para controlar si el formulario está en modo edición
    const [isEditing, setIsEditing] = useState(false);
    
    // Estado para guardar los datos del formulario
    const [formData, setFormData] = useState({
        direccion: '',
        celular: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Cuando el componente carga, llenamos el formulario con los datos del usuario
    useEffect(() => {
        if (user) {
            setFormData({
                direccion: user.direccion || '',
                celular: user.celular || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setError('');
        setSuccess('');
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
            // Creamos el payload solo con los datos que se pueden actualizar
            const updatedData = { 
                ...user, // Mantenemos los datos existentes como nombre y email
                ...formData // Sobreescribimos con los datos del formulario
            };
            
            await api.put(`${API_URL}/api/users/admin/${user.id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('¡Datos guardados con éxito!');
            setIsEditing(false);
            // Opcional: Refrescar el contexto del usuario para ver los cambios en toda la app
            // (Esto es una mejora más avanzada, por ahora un refresh de página serviría)

        } catch (err) {
            setError('No se pudieron guardar los cambios.');
            console.error(err);
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        setError('');
        setSuccess('');
    };

    if (!user) return <Typography>Cargando perfil...</Typography>;

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0A3832', mb: 3, textAlign: 'center' }}>
                Mis Datos Personales
            </Typography>
            <Paper elevation={6} sx={{
                maxWidth: '600px', mx: 'auto', p: 4, pt: 8, borderRadius: '16px', position: 'relative'
            }}>
                <Avatar sx={{
                    width: 80, height: 80, bgcolor: '#F2994A',
                    position: 'absolute', top: 0, left: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: 3
                }}>
                    <PersonIcon sx={{ fontSize: 40 }} />
                </Avatar>

                <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#0A3832' }}>
                    ¡Hola, {user.nombre}!
                </Typography>
                <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 4 }}>
                    Aquí están tus datos, ¡guau!
                </Typography>

                <Stack spacing={3}>
                    <TextField label="Nombre" value={user.nombre} disabled fullWidth />
                    <TextField label="Email" value={user.email} disabled fullWidth />
                    
                    <TextField 
                        name="direccion"
                        label="Dirección de entrega" 
                        value={formData.direccion}
                        onChange={handleChange}
                        disabled={!isEditing}
                        fullWidth 
                    />
                    <TextField
                        name="celular"
                        label="Celular de contacto" 
                        value={formData.celular}
                        onChange={handleChange}
                        disabled={!isEditing}
                        fullWidth 
                    />
                    
                    <TextField 
                       label="Indicaciones de entrega (opcional)" 
                       variant="outlined" 
                       value={deliveryInstructions} 
                       onChange={(e) => setDeliveryInstructions(e.target.value)} 
                       fullWidth 
                       multiline
                      rows={2}
                    />
                </Stack>

                <Box sx={{ pt: 4, textAlign: 'center' }}>
                    {!isEditing ? (
                        <Button onClick={toggleEdit} variant="contained" sx={{ borderRadius: '50px', px: 4, py: 1.5, bgcolor: '#16655B', '&:hover': { bgcolor: '#0A3832' } }}>
                            Editar mis datos
                        </Button>
                    ) : (
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button onClick={toggleEdit} variant="outlined" sx={{ borderRadius: '50px', px: 4, py: 1.5 }}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSave} variant="contained" sx={{ borderRadius: '50px', px: 4, py: 1.5, bgcolor: '#F2994A', '&:hover': { bgcolor: '#e68a3e' } }}>
                                ¡Guardar!
                            </Button>
                        </Stack>
                    )}
                </Box>
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </Paper>
        </Box>
    );
}

export default ProfilePage;