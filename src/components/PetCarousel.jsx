// src/components/PetCarousel.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Se importa el Link para la navegación
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import api from '../api/api.js';
import AuthContext from '../context/AuthContext';

function PetCarousel({ onAddPetClick }) {
    const [pets, setPets] = useState([]);
    const { token } = useContext(AuthContext);

    // Este useEffect se mantiene igual para obtener las mascotas
    useEffect(() => {
        const fetchPets = async () => {
            if (token) {
                try {
                    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
                    const response = await api.get(`${API_URL}/api/pets`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setPets(response.data);
                } catch (error) {
                    console.error("Error al obtener las mascotas:", error);
                }
            }
        };
        fetchPets();
    }, [token]);

    return (
        <Box sx={{ width: '100%', maxWidth: '896px' }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#0A3832', mb: 2, px: 1 }}>
                Mis Mascotas
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
                    
                    {/* Tarjetas de Mascotas con Link */}
                    {pets.map(pet => (
                        // CADA TARJETA ES AHORA UN LINK A SU PÁGINA DE DETALLE
                        <RouterLink to={`/mascotas/${pet.id}`} key={pet.id} style={{ textDecoration: 'none' }}>
                            <Box sx={{ textAlign: 'center', flexShrink: 0, width: '112px', cursor: 'pointer' }}>
                                <Avatar
                                    sx={{ width: 96, height: 96, mx: 'auto', border: '2px solid white', boxShadow: 3, bgcolor: '#F2994A' }}
                                    src={pet.image_url || `https://placehold.co/120x120/F2994A/FFFBEF?text=${pet.name?.charAt(0) || '?'}`}
                                />
                                <Typography sx={{ mt: 1, fontWeight: 'semibold', color: 'text.secondary', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    {pet.name || 'Sin Nombre'}
                                </Typography>
                            </Box>
                        </RouterLink>
                    ))}

                    {/* Botón para añadir mascota (no es un link) */}
                    <Box 
                        sx={{ textAlign: 'center', flexShrink: 0, width: '112px', cursor: 'pointer' }} 
                        onClick={onAddPetClick}
                    >
                        <Avatar sx={{ width: 96, height: 96, mx: 'auto', bgcolor: 'grey.200', border: '2px dashed grey.400' }}>
                            <AddCircleOutlineIcon sx={{ fontSize: 40, color: 'grey.500' }} />
                        </Avatar>
                        <Typography sx={{ mt: 1, fontWeight: 'semibold', color: 'text.secondary' }}>
                            Añadir
                        </Typography>
                    </Box>
                </Box>
                
                {/* Botón de Flecha con Link a la página de todas las mascotas */}
                <Paper 
                    component={RouterLink} 
                    to="/mascotas" // <-- LLEVA A LA PÁGINA DE "MIS MASCOTAS"
                    elevation={3} 
                    sx={{ flexShrink: 0, width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                >
                    <ArrowForwardIosIcon sx={{ color: '#16655B' }} />
                </Paper>
            </Box>
        </Box>
    );
}

export default PetCarousel;