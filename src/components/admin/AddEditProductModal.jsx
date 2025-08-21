// src/components/admin/AddEditProductModal.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, TextField, Typography, Modal, Paper, Stack, Alert, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const style = { /* ... (mismo estilo que el otro modal) ... */ };

const initialState = {
    name: '',
    descripcion: '',
    price_per_kg: '',
    kcal_per_kg: '',
    stock: '',
    categoria_id: ''
};

function AddEditProductModal({ open, onClose, onSave, productToEdit }) {
    const { token } = useContext(AuthContext);
    const [formState, setFormState] = useState(initialState);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');

    // Obtener las categorías para el menú desplegable
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
                const response = await axios.get(`${API_URL}/api/categories`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategories(response.data);
            } catch (err) {
                console.error("Error al cargar categorías", err);
            }
        };
        if (token) fetchCategories();
    }, [token]);

    // Rellenar el formulario si estamos editando
    useEffect(() => {
        if (productToEdit) {
            setFormState({ ...productToEdit });
        } else {
            setFormState(initialState);
        }
        setError('');
    }, [productToEdit, open]);

    const handleChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const headers = { Authorization: `Bearer ${token}` };

        try {
            if (productToEdit) { // Editando
                await axios.put(`${API_URL}/api/products/${productToEdit.id}`, formState, { headers });
            } else { // Creando
                await axios.post(`${API_URL}/api/products`, formState, { headers });
            }
            onSave(); // Llama a la función para refrescar y cerrar
        } catch (err) {
            setError(err.response?.data?.message || 'Ocurrió un error.');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Paper sx={style}>
                <Typography variant="h6">{productToEdit ? 'Editar Producto' : 'Añadir Nuevo Producto'}</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, maxHeight: '70vh', overflowY: 'auto', pr: 2 }}>
                    <Stack spacing={2}>
                        <TextField name="name" label="Nombre del Producto" value={formState.name} onChange={handleChange} required fullWidth />
                        <TextField name="descripcion" label="Descripción" value={formState.descripcion} onChange={handleChange} multiline rows={3} fullWidth />
                        <TextField name="price_per_kg" label="Precio por Kilo (Costo)" type="number" value={formState.price_per_kg} onChange={handleChange} required fullWidth />
                        <TextField name="kcal_per_kg" label="Kcal por Kilo" type="number" value={formState.kcal_per_kg} onChange={handleChange} required fullWidth />
                        <TextField name="stock" label="Stock (en kg)" type="number" value={formState.stock} onChange={handleChange} required fullWidth />
                        
                        <FormControl fullWidth required>
                            <InputLabel>Categoría</InputLabel>
                            <Select name="categoria_id" label="Categoría" value={formState.categoria_id} onChange={handleChange}>
                                {categories.map(cat => (
                                    <MenuItem key={cat.id} value={cat.id}>{cat.nombre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {error && <Alert severity="error">{error}</Alert>}
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2 }}>
                            <Button onClick={onClose}>Cancelar</Button>
                            <Button type="submit" variant="contained">Guardar</Button>
                        </Box>
                    </Stack>
                </Box>
            </Paper>
        </Modal>
    );
}

export default AddEditProductModal;