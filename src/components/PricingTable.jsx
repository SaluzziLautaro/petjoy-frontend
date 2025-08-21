// src/components/PricingTable.jsx

import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

// Ahora el componente recibe la función onPlanSelect
const PriceColumn = ({ title, price, features, highlighted = false, onSelect, categoryKey }) => (
    <Box sx={{ p: 3, textAlign: 'center', backgroundColor: highlighted ? '#FFFBEF' : 'transparent', borderLeft: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0A3832' }}>{title}</Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', my: 2 }}>
            ${Math.round(price)}
        </Typography>
        
        {/* Aquí mostramos las características de cada plan */}
        <Typography variant="body2" sx={{ my: 1, minHeight: '40px' }}>{features[0]}</Typography>
        <Typography variant="body2" sx={{ my: 1, minHeight: '40px' }}>{features[1]}</Typography>
        <Typography variant="body2" sx={{ my: 1, minHeight: '40px' }}>{features[2]}</Typography>
        <Box sx={{ my: 2, minHeight: '30px' }}>
            {features[3] === '✓' ? <CheckIcon color="success" sx={{ fontSize: 30 }}/> : <Typography variant="h6">—</Typography>}
        </Box>
        
        <Button 
            variant="contained" 
            fullWidth 
            onClick={() => onSelect(categoryKey)} // Llama a la función al hacer clic
            sx={{ 
                borderRadius: '50px', 
                backgroundColor: highlighted ? '#F2994A' : '#16655B',
                '&:hover': { backgroundColor: highlighted ? '#e68a3e' : '#0A3832' }
            }}
        >
            Elegir
        </Button>
    </Box>
);

function PricingTable({ prices, onPlanSelect }) { // Recibimos la prop aquí
    if (!prices) return null;

    // Guardamos los detalles de cada plan, incluyendo su frecuencia
    const plans = {
        bueno: { title: 'Bueno', features: ["Envío Mensual", "Soporte Email", "Juguetes: —", "Veterinario: —"], frecuencia: 'mensual' },
        muyBueno: { title: 'Muy Bueno', features: ["Envío Quincenal", "Soporte Prioritario", "1 Juguete Sorpresa", "Veterinario: —"], frecuencia: 'quincenal', highlighted: true },
        premium: { title: 'Premium', features: ["Envío Personalizable", "Soporte Prioritario", "2 Juguetes Premium", "✓"], frecuencia: 'mensual' } // Asumimos mensual como default
    };

    return (
        <Paper elevation={4} sx={{ mt: 4, maxWidth: '1100px', mx: 'auto', borderRadius: '12px', overflow: 'hidden' }}>
            <Grid container>
                <Grid item xs={12} md={3}>
                    <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Características</Typography>
                    </Box>
                </Grid>
                {Object.keys(plans).map(key => (
                    <Grid item xs={12} md={3} key={key}>
                        <PriceColumn 
                            title={plans[key].title} 
                            price={prices[key]?.total || 0} // Usamos ?. para seguridad
                            features={plans[key].features} 
                            highlighted={plans[key].highlighted}
                            onSelect={onPlanSelect} // Pasamos la función al componente hijo
                            categoryKey={key} // Pasamos la clave de la categoría
                        />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}

export default PricingTable;