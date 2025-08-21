// src/components/admin/ProductAdminPage.jsx

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/api'; // <-- Usa la nueva instancia 'api'
import AuthContext from '../../context/AuthContext';
import AddEditProductModal from './AddEditProductModal';

function ProductAdminPage() {
    const { token, user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    const fetchProducts = useCallback(async () => {
        if (!token || !user?.es_admin) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            // CORRECCIÓN: Usamos 'api' y solo el endpoint
            const response = await api.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        } finally {
            setLoading(false);
        }
    }, [token, user]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (productId) => {
        if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
            try {
                // CORRECCIÓN: Usamos 'api' y solo el endpoint
                await api.delete(`/api/products/${productId}`);
                fetchProducts();
            } catch (error) {
                console.error("Error al eliminar producto:", error);
            }
        }
    };
    
    // ... (el resto de las funciones de modal no cambian)
    const handleOpenModal = (product = null) => { setProductToEdit(product); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setProductToEdit(null); };
    const handleSave = () => { handleCloseModal(); fetchProducts(); };

    return (
        <Box>
            {/* ... (El JSX de la tabla y los botones no cambia) ... */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Gestión de Productos</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
                    Añadir Producto
                </Button>
            </Box>
            {loading ? <CircularProgress /> : (
                <Paper sx={{ boxShadow: 3, borderRadius: '12px' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Precio/kg</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id} hover>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.categoria_nombre}</TableCell>
                                        <TableCell>${product.price_per_kg}</TableCell>
                                        <TableCell>{product.stock} kg</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpenModal(product)} color="primary"><EditIcon /></IconButton>
                                            <IconButton onClick={() => handleDelete(product.id)} color="error"><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
            <AddEditProductModal open={isModalOpen} onClose={handleCloseModal} onSave={handleSave} productToEdit={productToEdit} />
        </Box>
    );
}

export default ProductAdminPage;