// src/components/SubscriptionPlanPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Avatar, CircularProgress, Alert } from '@mui/material';
import api from '../api/api.js';
import AuthContext from '../context/AuthContext';
import PricingTable from './PricingTable';

function SubscriptionPlanPage() {
    const { token } = useContext(AuthContext);
    const [pets, setPets] = useState([]);
    const [products, setProducts] = useState(null); // Para guardar los productos de cada categoría
    const [selectedPetIds, setSelectedPetIds] = useState(new Set());
    const [calculatedPrices, setCalculatedPrices] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    // 1. Obtener mascotas y productos al cargar la página
    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            try {
                // Obtenemos las mascotas
                const petsResponse = await api.get(`${API_URL}/api/pets`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPets(petsResponse.data);

                // Obtenemos los productos para cada categoría
                const [buenoRes, muyBuenoRes, premiumRes] = await Promise.all([
                    api.get(`${API_URL}/api/products?category=bueno`, { headers: { Authorization: `Bearer ${token}` } }),
                    api.get(`${API_URL}/api/products?category=muy bueno`, { headers: { Authorization: `Bearer ${token}` } }),
                    api.get(`${API_URL}/api/products?category=premium`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                // Asumimos que tomamos el primer producto de cada categoría
                setProducts({
                    bueno: buenoRes.data[0],
                    muyBueno: muyBuenoRes.data[0],
                    premium: premiumRes.data[0]
                });

            } catch (err) {
                setError('No se pudieron cargar los datos iniciales.');
            }
        };
        fetchData();
    }, [token]);

    // 2. Calcular precios cuando la selección de mascotas cambie
    useEffect(() => {
        const calculatePrices = useCallback(async () => {
        if (selectedPetIds.size === 0 || !products) {
            setCalculatedPrices(null);
            return;
        }
        setLoading(true); setError('');
        
        try {
            const costosBasePorMascota = {}; // Guardará { petId: { bueno: costo, muyBueno: costo, ... } }

            // ETAPA 1: Calcular el costo base para cada mascota seleccionada
            for (const petId of selectedPetIds) {
                const pet = pets.find(p => p.id === petId);
                if (!pet) continue;
                
                costosBasePorMascota[petId] = {};
                
                for (const category of ['bueno', 'muyBueno', 'premium']) {
                    const product = products[category];
                    if (!product) continue;
                    
                    const rer = 70 * Math.pow(pet.weight_kg, 0.75);
                    let derFactor = 1.6;
                    const der = rer * derFactor;
                    const dailyGrams = (der / product.kcal_per_kg) * 1000;
                    const monthlyKg = (dailyGrams * 30) / 1000;
                    
                    costosBasePorMascota[petId][category] = monthlyKg * product.price_per_kg;
                }
            }

            // ETAPA 2: Aplicar margen al más caro de cada categoría y sumar
            const totals = { bueno: { total: 0 }, muyBueno: { total: 0 }, premium: { total: 0 } };

            for (const category of ['bueno', 'muyBueno', 'premium']) {
                const costosDeCategoria = Object.values(costosBasePorMascota).map(costos => costos[category]);
                if (costosDeCategoria.length === 0) continue;

                const costoMasAlto = Math.max(...costosDeCategoria);
                let margenAplicado = false;
                let totalCategoria = 0;

                costosDeCategoria.forEach(costo => {
                    let subtotal = costo;
                    if (costo === costoMasAlto && !margenAplicado) {
                        subtotal = subtotal * (1 + (parseFloat(import.meta.env.VITE_PROFIT_MARGIN_PERCENTAGE) / 100));
                        margenAplicado = true;
                    }
                    const impuestos = subtotal * (parseFloat(import.meta.env.VITE_TAX_PERCENTAGE) / 100);
                    totalCategoria += subtotal + impuestos;
                });
                totals[category].total = totalCategoria;
            }

            setCalculatedPrices(totals);
        } catch (err) {
            setError('No se pudo calcular el precio.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedPetIds, pets, products, token]); // Añadimos token a las dependencias

    useEffect(() => {
        calculatePrices();
    }, [calculatePrices]);
        
    calculatePrices();
    }, [selectedPetIds, pets, products]);

    const handlePetSelect = (petId) => {
        const newSelection = new Set(selectedPetIds);
        newSelection.has(petId) ? newSelection.delete(petId) : newSelection.add(petId);
        setSelectedPetIds(newSelection);
    };

    // --- 3. NUEVA FUNCIÓN para manejar la selección del plan ---
    const handlePlanSelection = async (categoryKey) => {
        if (selectedPetIds.size === 0) {
            setError("Por favor, selecciona al menos una mascota.");
            return;
        }

        setLoading(true); setError('');

        try {
            // Construimos el array para el endpoint del "paquete"
            const subscriptions = Array.from(selectedPetIds).map(petId => ({
                pet_id: petId,
                product_id: products[categoryKey].id,
                frecuencia: (categoryKey === 'muyBueno') ? 'quincenal' : 'mensual' // Lógica de frecuencia
            }));

            const response = await api.post(`${API_URL}/api/payments/create-bundle-subscription`, 
                { subscriptions },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Redirigimos al usuario a Mercado Pago
            window.location.href = response.data.init_point;

        } catch (err) {
            setError("No se pudo crear el plan de suscripción. Inténtalo de nuevo.");
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 4 } }}>
            <header style={{ textAlign: 'center', marginBottom: '48px' }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#0A3832' }}>Elige el Plan Perfecto</Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>Suscripciones pensadas para su felicidad y tu tranquilidad.</Typography>
            </header>

            <section>
                <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#0A3832' }}>Calcula tu Plan</Typography>
                <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 4 }}>Selecciona una o más mascotas para ver el precio.</Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                    {pets.map(pet => (
                        <Box
                            key={pet.id}
                            onClick={() => handlePetSelect(pet.id)}
                            sx={{
                                textAlign: 'center', p: 1, border: '3px solid',
                                borderColor: selectedPetIds.has(pet.id) ? '#F2994A' : 'transparent',
                                borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                                transform: selectedPetIds.has(pet.id) ? 'scale(1.05)' : 'scale(1)',
                            }}
                        >
                            <Avatar src={pet.image_url} sx={{ width: 80, height: 80, mx: 'auto' }} />
                            <Typography sx={{ mt: 1, fontWeight: 'bold' }}>{pet.name}</Typography>
                        </Box>
                    ))}
                </Box>
                
                {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}
                {error && <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>}
                
                {calculatedPrices && !loading && <PricingTable prices={calculatedPrices} onPlanSelect={handlePlanSelection} />}
            </section>
        </Box>
    );
}

export default SubscriptionPlanPage;