// src/components/admin/AssignPlanModal.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Modal, Paper, Stack, Alert, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import api from '../../api/api';
import AuthContext from '../../context/AuthContext';

const style = { /* ... (mismo estilo que los otros modales) ... */ };

function AssignPlanModal({ open, onClose, onSave, user }) {
    const { token } = useContext(AuthContext);
    const [pets, setPets] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedPet, setSelectedPet] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [frequency, setFrequency] = useState('mensual');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (open && user) {
                try {
                    // Obtenemos las mascotas del usuario seleccionado
                    const petsRes = await api.get(`/api/pets/admin/user/${user.id}`);
                    setPets(petsRes.data);
                    
                    // Obtenemos todos los productos disponibles
                    const productsRes = await api.get('/api/products');
                    setProducts(productsRes.data);
                } catch (err) {
                    setError("No se pudieron cargar los datos para la asignación.");
                }
            }
        };
        fetchData();
    }, [open, user, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Usamos el endpoint de crear suscripción que ya teníamos
            await api.post('/api/subscriptions', {
                pet_id: selectedPet,
                product_id: selectedProduct,
                frecuencia: frequency,
            });
            onSave();
        } catch (err) {
            setError(err.response?.data?.error || "No se pudo asignar el plan.");
        }
    };

    if (!user) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Paper sx={style}>
                <Typography variant="h6">Asignar Plan Manualmente a {user.name}</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Stack spacing={3}>
                        {error && <Alert severity="error">{error}</Alert>}
                        
                        <FormControl fullWidth required>
                            <InputLabel>Mascota</InputLabel>
                            <Select value={selectedPet} label="Mascota" onChange={e => setSelectedPet(e.target.value)}>
                                {pets.length > 0 ? pets.map(p => (
                                    <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                                )) : <MenuItem disabled>Este usuario no tiene mascotas</MenuItem>}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required>
                            <InputLabel>Producto</InputLabel>
                            <Select value={selectedProduct} label="Producto" onChange={e => setSelectedProduct(e.target.value)}>
                                {products.map(p => (
                                    <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required>
                            <InputLabel>Frecuencia</InputLabel>
                            <Select value={frequency} label="Frecuencia" onChange={e => setFrequency(e.target.value)}>
                                <MenuItem value="semanal">Semanal</MenuItem>
                                <MenuItem value="quincenal">Quincenal</MenuItem>
                                <MenuItem value="mensual">Mensual</MenuItem>
                            </Select>
                        </FormControl>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2 }}>
                            <Button onClick={onClose}>Cancelar</Button>
                            <Button type="submit" variant="contained">Asignar Plan</Button>
                        </Box>
                    </Stack>
                </Box>
            </Paper>
        </Modal>
    );
}

export default AssignPlanModal;

