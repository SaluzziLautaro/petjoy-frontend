// src/components/DashboardPage.jsx

import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';
import UserCard from './UserCard';
import PetCarousel from './PetCarousel';
import AddEditPetModal from './AddEditPetModal'; // Solo necesitamos este

function DashboardPage() {
    // Estado para saber qué mascota editar y si el modal está abierto
    const [petToEdit, setPetToEdit] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Esta función se llama para AÑADIR (pasando null) o EDITAR (pasando la mascota)
    const handleOpenModal = (pet = null) => {
        setPetToEdit(pet);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPetToEdit(null);
    };

    // Esta función recargará la página para mostrar los datos actualizados
    const handleSave = () => {
        handleCloseModal();
        window.location.reload(); 
    };

    return (
        <Box>
            <Stack spacing={4} alignItems="center">
                <UserCard />
                <PetCarousel 
                    onAddPetClick={() => handleOpenModal()} // Al hacer clic en añadir, abre el modal sin mascota
                    onPetClick={handleOpenModal} // Al hacer clic en una mascota, abre el modal con esa mascota
                />
            </Stack>

            {/* El Modal unificado se renderiza aquí */}
            <AddEditPetModal
                petToEdit={petToEdit}
                open={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
            />
        </Box>
    );
}

export default DashboardPage;