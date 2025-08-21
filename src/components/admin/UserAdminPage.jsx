// src/components/admin/UserAdminPage.jsx

import React from 'react';
import { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Switch, Alert, CircularProgress } from '@mui/material';
import api from '../../api/api';
import AuthContext from '../../context/AuthContext';

function UserAdminPage() {
    const { token, user: currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        if (!token || !currentUser?.es_admin) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await api.get('/api/users/admin');
            setUsers(response.data);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            setError("No se pudieron cargar los usuarios.");
        } finally {
            setLoading(false);
        }
    }, [token, currentUser]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userToUpdate) => {
        const newAdminState = !userToUpdate.es_admin;
        if (userToUpdate.id === currentUser.id) {
            alert("No puedes cambiar tu propio rol.");
            return;
        }

        try {
            const updatedData = { ...userToUpdate, es_admin: newAdminState };
            await api.put(`/api/users/admin/${userToUpdate.id}`, updatedData);
            fetchUsers();
        } catch (err) {
            console.error("Error al actualizar el rol:", err);
            setError("No se pudo cambiar el rol del usuario.");
        }
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Gestión de Usuarios</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {loading ? <CircularProgress /> : (
                <Paper sx={{ boxShadow: 3, borderRadius: '12px' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>¿Es Admin?</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.nombre}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={!!user.es_admin}
                                                onChange={() => handleRoleChange(user)}
                                                disabled={user.id === currentUser.id}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </Box>
    );
}

export default UserAdminPage;