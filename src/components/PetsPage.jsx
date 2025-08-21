// src/components/PetsPage.jsx

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardActions, Avatar, Alert, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api/api.js';
import AuthContext from '../context/AuthContext';
import AddEditPetModal from './AddEditPetModal'; // Asegúrate que este modal también esté correcto

function PetsPage() {
    const { token } = useContext(AuthContext);
    const [pets, setPets] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    
    // --- ESTADOS PARA MANEJAR EL MODAL ---
    const [selectedPet, setSelectedPet] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // <-- ESTA ERA LA LÍNEA QUE FALTABA

    const fetchPets = useCallback(async () => {
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
            const response = await api.get(`${API_URL}/api/pets`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPets(response.data);
        } catch (error) {
            setError("No se pudieron cargar las mascotas.");
            console.error("Error al obtener las mascotas:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchPets();
        }
    }, [token, fetchPets]);

    const handleDelete = async (petId) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta mascota?")) {
            try {
                const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
                await api.delete(`${API_URL}/api/pets/${petId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchPets();
            } catch (err) {
                setError("No se pudo eliminar la mascota.");
                console.error("Error al eliminar la mascota:", err);
            }
        }
    };
    
    // Funciones que usan el estado del modal
    const handleOpenModal = (pet = null) => {
        setSelectedPet(pet);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPet(null);
    };

    const handleSave = () => {
        handleCloseModal();
        fetchPets();
    };
    
    const calculateAge = (birthDate) => {
        if (!birthDate) return 'N/A';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age < 1 ? `${m + 12} meses` : `${age} años`;
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Gestiona tus Mascotas</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
                    Añadir Mascota
                </Button>
            </Box>
            
            {error && <Alert severity="error">{error}</Alert>}

            <Grid container spacing={3}>
                {pets.length > 0 ? pets.map(pet => (
                    <Grid item xs={12} sm={6} md={4} key={pet.id}>
                        <Card sx={{ borderRadius: '12px', boxShadow: 3 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Avatar
                                    src={pet.image_url || `https://placehold.co/120x120/F2994A/FFFBEF?text=${pet.name?.charAt(0) || '?'}`}
                                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2, border: '3px solid #F2994A' }}
                                />
                                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                                    {pet.name}
                                </Typography>
                                <Typography color="text.secondary">
                                    {pet.breed}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {calculateAge(pet.birth_date)} - {pet.weight_kg} kg
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                <Button size="small" startIcon={<EditIcon />} onClick={() => handleOpenModal(pet)}>Editar</Button>
                                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(pet.id)}>Eliminar</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )) : (
                    !error && <Typography sx={{m: 3}}>No tienes mascotas registradas todavía. ¡Haz clic en "Añadir Mascota" para empezar!</Typography>
                )}
            </Grid>
            
            {/* El modal ahora usa la variable de estado 'isModalOpen' que sí existe */}
            <AddEditPetModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                petToEdit={selectedPet}
            />
        </Box>
    );
}

export default PetsPage;