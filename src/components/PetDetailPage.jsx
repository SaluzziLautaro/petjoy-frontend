// src/components/PetDetailPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import AuthContext from '../context/AuthContext';
import { Box, Typography, Paper, CircularProgress, Alert, Button, Divider, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function PetDetailPage() {
    // useParams() nos da los parámetros de la URL, en este caso el :id
    const { id } = useParams(); 
    const { token } = useContext(AuthContext);
    const navigate = useNavigate(); // Hook para la navegación

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPet = async () => {
            if (token && id) {
                try {
                    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
                    // We need a backend endpoint to get a single pet by ID.
                    // Let's assume it's GET /api/pets/:id
                    const response = await api.get(`${API_URL}/api/pets/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setPet(response.data);
                } catch (err) {
                    setError('No se pudo cargar la información de la mascota.');
                    console.error("Error fetching pet data:", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchPet();
    }, [id, token]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
    }

    if (!pet) {
        return <Typography sx={{ m: 2 }}>Mascota no encontrada.</Typography>;
    }

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/mascotas')} sx={{ mb: 2 }}>
                Volver a Mis Mascotas
            </Button>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                    <Box
                        component="img"
                        src={pet.image_url || `https://placehold.co/300x300/CCCCCC/FFFFFF?text=${pet.name.charAt(0)}`}
                        alt={pet.name}
                        sx={{
                            width: '100%',
                            maxWidth: '300px',
                            height: 'auto',
                            aspectRatio: '1 / 1',
                            borderRadius: '16px',
                            objectFit: 'cover'
                        }}
                    />
                    <Box>
                        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>{pet.name}</Typography>
                        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>{pet.breed}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body1">**Tipo:** {pet.pet_type}</Typography>
                        <Typography variant="body1">**Peso:** {pet.weight_kg} kg</Typography>
                        <Typography variant="body1">**Nacimiento:** {new Date(pet.birth_date).toLocaleDateString()}</Typography>
                        <Typography variant="body1">**Actividad:** {pet.activity_level}</Typography>
                        <Typography variant="body1">**Esterilizado:** {pet.sterilized ? 'Sí' : 'No'}</Typography>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}

export default PetDetailPage;