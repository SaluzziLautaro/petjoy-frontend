// src/components/AddEditPetModal.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api.js';
import AuthContext from '../context/AuthContext';
import { Box, Button, TextField, Typography, Modal, Paper, Stack, Alert, Avatar, Select, MenuItem, InputLabel, FormControl, RadioGroup, FormControlLabel, Radio, FormLabel } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
};

const initialState = {
    name: '', pet_type: 'perro', breed: '', birth_date: '',
    weight_kg: '', activity_level: 'medio', sterilized: '1'
};

function AddEditPetModal({ open, onClose, onSave, petToEdit }) {
    const { token } = useContext(AuthContext);
    const [formState, setFormState] = useState(initialState);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('https://placehold.co/100x100/CCCCCC/FFFFFF?text=Pet');
    const [error, setError] = useState('');

    useEffect(() => {
        if (petToEdit) {
            const formattedDate = petToEdit.birth_date ? new Date(petToEdit.birth_date).toISOString().split('T')[0] : '';
            setFormState({ ...petToEdit, birth_date: formattedDate });
            setPreview(petToEdit.image_url || 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=Pet');
        } else {
            setFormState(initialState);
            setPreview('https://placehold.co/100x100/CCCCCC/FFFFFF?text=Pet');
        }
        setImageFile(null);
        setError('');
    }, [petToEdit, open]);

    const handleChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const headers = { Authorization: `Bearer ${token}` };

        try {
            let petId;
            if (petToEdit) {
                await api.put(`${API_URL}/api/pets/${petToEdit.id}`, formState, { headers });
                petId = petToEdit.id;
            } else {
                const response = await api.post(`${API_URL}/api/pets`, formState, { headers });
                petId = response.data.petId;
            }

            if (imageFile) {
                const formData = new FormData();
                formData.append('petImage', imageFile);
                await api.post(`${API_URL}/api/pets/${petId}/upload-image`, formData, { headers });
            }
            onSave();
        } catch (err) {
            setError(err.response?.data?.msg || 'Ocurrió un error al guardar la mascota.');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Paper sx={style}>
                <Typography variant="h6" component="h2">{petToEdit ? 'Editar Mascota' : 'Añadir Nueva Mascota'}</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, maxHeight: '70vh', overflowY: 'auto', pr: 2 }}>
                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                           <Avatar src={preview} sx={{ width: 64, height: 64 }} />
                           <Button variant="outlined" component="label">
                               Cambiar Foto
                               <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                           </Button>
                        </Box>
                        <TextField name="name" label="Nombre" value={formState.name} onChange={handleChange} required fullWidth />
                        <FormControl fullWidth>
                            <InputLabel>Tipo</InputLabel>
                            <Select name="pet_type" label="Tipo" value={formState.pet_type} onChange={handleChange}>
                                <MenuItem value="perro">Perro</MenuItem>
                                <MenuItem value="gato">Gato</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField name="breed" label="Raza" value={formState.breed} onChange={handleChange} required fullWidth />
                        <TextField name="birth_date" label="Fecha de Nacimiento" type="date" value={formState.birth_date} onChange={handleChange} required fullWidth InputLabelProps={{ shrink: true }} />
                        <TextField name="weight_kg" label="Peso (en kg)" type="number" value={formState.weight_kg} onChange={handleChange} required fullWidth inputProps={{ step: "0.1" }}/>
                        <FormControl fullWidth>
                            <InputLabel>Nivel de Actividad</InputLabel>
                            <Select name="activity_level" label="Nivel de Actividad" value={formState.activity_level} onChange={handleChange}>
                                <MenuItem value="bajo">Bajo</MenuItem>
                                <MenuItem value="medio">Medio</MenuItem>
                                <MenuItem value="alto">Alto</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>¿Está esterilizado?</FormLabel>
                            <RadioGroup row name="sterilized" value={String(formState.sterilized)} onChange={handleChange}>
                                <FormControlLabel value="1" control={<Radio />} label="Sí" />
                                <FormControlLabel value="0" control={<Radio />} label="No" />
                            </RadioGroup>
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

export default AddEditPetModal;