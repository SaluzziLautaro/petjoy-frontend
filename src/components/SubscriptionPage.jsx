// src/components/SubscriptionPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardActions, Avatar, Alert, Chip, CircularProgress } from '@mui/material';
import api from '../api/api.js';
import AuthContext from '../context/AuthContext';

function SubscriptionPage() {
    const { token } = useContext(AuthContext);
    const [subscriptions, setSubscriptions] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchSubscriptions = async () => {
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
            const response = await api.get(`${API_URL}/api/subscriptions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubscriptions(response.data);
        } catch (error) {
            setError("No se pudieron cargar las suscripciones.");
            console.error("Error al obtener las suscripciones:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchSubscriptions();
        }
    }, [token]);

    const handleCancel = async (subId) => {
        if (window.confirm("¿Estás seguro de que quieres cancelar esta suscripción?")) {
            try {
                const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
                await api.delete(`${API_URL}/api/subscriptions/${subId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Refrescamos la lista para ver el cambio de estado
                fetchSubscriptions(); 
            } catch (err) {
                setError("No se pudo cancelar la suscripción.");
                console.error("Error al cancelar:", err);
            }
        }
    };
    
    // Helper para dar color al estado
    const statusChip = (status) => {
        if (status === 'cancelled') return <Chip label="Cancelada" color="error" />;
        if (status === 'active') return <Chip label="Activa" color="success" />;
        return <Chip label={status} />;
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0A3832', mb: 3 }}>
                Mis Suscripciones
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            {loading ? <CircularProgress /> : (
                <Grid container spacing={3}>
                    {subscriptions.length > 0 ? subscriptions.map(sub => (
                        <Grid item xs={12} md={6} lg={4} key={sub.id}>
                            <Card sx={{ borderRadius: '12px', boxShadow: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar src={sub.product_image} sx={{ width: 56, height: 56, mr: 2 }} />
                                        <Box>
                                            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                                {sub.product_name}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Para: {sub.pet_name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    {statusChip(sub.estado)}
                                    <Typography variant="h5" sx={{ my: 2, fontWeight: 'bold', color: '#16655B' }}>
                                        ${sub.precio_total} / {sub.frecuencia}
                                    </Typography>
                                    <Typography variant="body2">
                                        Próxima entrega: {new Date(sub.proxima_fecha_entrega).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    {sub.estado === 'active' && (
                                        <Button size="small" color="error" onClick={() => handleCancel(sub.id)}>
                                            Cancelar Suscripción
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    )) : (
                        <Typography sx={{ ml: 2 }}>Aún no tienes ninguna suscripción activa.</Typography>
                    )}
                </Grid>
            )}
        </Box>
    );
}

export default SubscriptionPage;