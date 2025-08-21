// src/components/LandingPage.jsx
import React from 'react';
import { Box, Button, Typography, Container, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function LandingPage() {
    return (
        <Box>
            {/* Sección Principal (Hero) */}
            <Box sx={{ bgcolor: '#0A3832', color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <Container>
                    <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold' }}>
                        La felicidad de tu mascota, entregada en tu puerta.
                    </Typography>
                    <Typography variant="h6" sx={{ my: 3, maxWidth: '600px', mx: 'auto' }}>
                        Con PetJoy, recibe el alimento perfecto para tu mejor amigo, calculado a su medida y con entrega programada. Olvídate de las corridas.
                    </Typography>
                    <Button component={RouterLink} to="/register" variant="contained" size="large" sx={{ 
                        backgroundColor: '#F2994A', '&:hover': { backgroundColor: '#e68a3e' },
                        borderRadius: '50px', px: 5, py: 1.5, fontWeight: 'bold'
                    }}>
                        Crear Cuenta Gratis
                    </Button>
                </Container>
            </Box>

            {/* Sección "Cómo Funciona" */}
            <Container sx={{ py: 8 }}>
                <Typography variant="h4" component="h2" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}>¿Cómo Funciona?</Typography>
                <Grid container spacing={4} textAlign="center">
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: 'transparent' }}>
                            <Typography variant="h1" sx={{ color: '#F2994A' }}>1.</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', my: 1 }}>Registra a tu Mascota</Typography>
                            <Typography>Crea un perfil único para cada una de tus mascotas con sus datos específicos (raza, peso, edad).</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: 'transparent' }}>
                            <Typography variant="h1" sx={{ color: '#F2994A' }}>2.</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', my: 1 }}>Calculamos su Plan</Typography>
                            <Typography>Nuestra calculadora inteligente determina la porción y el plan ideal para su nutrición.</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: 'transparent' }}>
                            <Typography variant="h1" sx={{ color: '#F2994A' }}>3.</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', my: 1 }}>Recíbelo en Casa</Typography>
                            <Typography>Elige la frecuencia y nosotros nos encargamos de que nunca te quedes sin su alimento.</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default LandingPage;