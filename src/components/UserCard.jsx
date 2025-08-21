// src/components/UserCard.jsx

import React, { useContext } from 'react';
import { Box, Typography, Paper, Avatar, Chip, Button, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AuthContext from '../context/AuthContext';

function UserCard() {
    const { user } = useContext(AuthContext);

    // Verificación más robusta: nos aseguramos de que 'user' y 'user.nombre' existan
    if (!user || !user.nombre) {
        return null; // O un componente de carga
    }

    const proximoEnvio = "21/12/2025";
    const proximoPago = "19/12/2025";
    const plan = "Premium";

    return (
        <Paper elevation={4} sx={{ width: '100%', maxWidth: '896px', borderRadius: '16px', p: { xs: 2, sm: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3, mb: 3 }}>
                <Avatar 
                    // Usamos el encadenamiento opcional por si acaso
                    src={`https://placehold.co/100x100/F2994A/FFFBEF?text=${user.name.charAt(0)}`}
                    alt="Foto de perfil"
                    sx={{ width: 96, height: 96, border: '4px solid #FFFBEF', boxShadow: 2 }}
                />
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0A3832' }}>Hola, {user.name}</Typography>
                    <Chip 
                        icon={<CheckCircleIcon />}
                        label={`Plan ${plan}`}
                        color="success"
                        sx={{ mt: 1, backgroundColor: '#16655B', color: 'white', fontWeight: 'bold' }}
                    />
                </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, color: 'text.secondary' }}>
                    <Typography variant="body2"><Box component="span" sx={{ fontWeight: 'bold', color: '#0A3832' }}>Próximo envío:</Box> {proximoEnvio}</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}><Box component="span" sx={{ fontWeight: 'bold', color: '#0A3832' }}>Próximo pago:</Box> {proximoPago}</Typography>
                </Box>
                
                <Button 
                    component={RouterLink}
                    to="/nuevo-plan"
                    variant="contained" 
                    sx={{ backgroundColor: '#F2994A', '&:hover': { backgroundColor: '#e68a3e' }, borderRadius: '50px', fontWeight: 'bold', px: 4, py: 1.5, width: { xs: '100%', sm: 'auto' } }}
                >
                    Ver Planes
                </Button>
            </Box>
        </Paper>
    );
}

export default UserCard;