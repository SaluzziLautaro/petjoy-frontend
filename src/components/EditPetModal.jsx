// src/components/EditPetModal.jsx

import React, { useState, useContext } from 'react';
import api from '../api/api.js';
import AuthContext from '../context/AuthContext';
import { Box, Button, TextField, Typography, Modal, Paper, Stack, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Estilo para el modal
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

function EditPetModal({ pet, open, onClose, onUpdate }) {
    const { token } = useContext(AuthContext);

    // Estado para el archivo de imagen seleccionado
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            setError('Por favor, selecciona un archivo de imagen.');
            return;
        }
        setError('');
        setSuccess('');

        // Usamos FormData para enviar archivos
        const formData = new FormData();
        formData.append('petImage', imageFile);

        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
            const response = await api.post(`${API_URL}/api/pets/${pet.id}/upload-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            
            setSuccess('¡Foto actualizada con éxito!');
            onUpdate(); // Llama a la función para refrescar y cerrar
        } catch (err) {
            setError(err.response?.data?.error || 'No se pudo subir la imagen.');
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="edit-pet-modal-title"
        >
            <Paper sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography id="edit-pet-modal-title" variant="h6" component="h2">
                        Editar a {pet?.name}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                
                {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ my: 2 }}>{success}</Alert>}

                <Stack spacing={2} sx={{ mt: 2 }}>
                    <Typography variant="body1">Actualizar foto de perfil:</Typography>
                    <TextField 
                        type="file"
                        onChange={handleFileChange}
                        fullWidth
                        size="small"
                    />
                    <Button 
                        onClick={handleImageUpload} 
                        variant="contained"
                        disabled={!imageFile}
                    >
                        Subir Foto
                    </Button>
                </Stack>

                {/* Aquí podrías agregar más campos para editar otros datos como el peso, etc. */}
            </Paper>
        </Modal>
    );
}

export default EditPetModal;