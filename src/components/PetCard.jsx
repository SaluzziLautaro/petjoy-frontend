// src/components/PetCard.jsx
import React, { useState } from 'react';
import { Card, CardMedia, Typography, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function PetCard({ pet, onEdit, onDelete }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        onEdit(pet);
        handleMenuClose();
    };

    const handleDelete = () => {
        onDelete(pet);
        handleMenuClose();
    };

    return (
        <Card sx={{ position: 'relative', borderRadius: '12px', aspectRatio: '1 / 1' }}>
            <CardMedia
                component="img"
                image={pet.image_url || `https://placehold.co/200x200/CCCCCC/FFFFFF?text=${pet.name.charAt(0)}`}
                alt={pet.name}
                sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 1.5,
                color: 'white'
            }}>
                <Box sx={{ alignSelf: 'flex-end' }}>
                    <IconButton onClick={handleMenuClick} sx={{ backgroundColor: 'rgba(255,255,255,0.8)', '&:hover': { backgroundColor: 'white' } }}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                        <MenuItem onClick={handleEdit}>Editar</MenuItem>
                        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Eliminar</MenuItem>
                    </Menu>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                    {pet.name}
                </Typography>
            </Box>
        </Card>
    );
}

export default PetCard;