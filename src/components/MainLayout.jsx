// src/components/MainLayout.jsx

import React, { useState, useContext } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Button, AppBar, IconButton, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AuthContext from '../context/AuthContext';
import PeopleIcon from '@mui/icons-material/People';

const drawerWidth = 240;

function MainLayout({ children }) {
    const { user, logout } = useContext(AuthContext);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const handleSidebarOpen = () => setSidebarOpen(true);
    const handleSidebarClose = () => setSidebarOpen(false);

    // Definimos los items base de navegación
    const navItems = [
        { text: 'Dashboard', icon: <HomeIcon />, path: '/' },
        { text: 'Mis Mascotas', icon: <PetsIcon />, path: '/mascotas' },
        { text: 'Suscripciones', icon: <SubscriptionsIcon />, path: '/suscripciones' },
        { text: 'Mi Perfil', icon: <AccountCircleIcon />, path: '/perfil' },
    ];

    // Si el usuario es admin, añadimos el link al panel
    if (user && user.es_admin) {
    navItems.push(
        { text: 'Admin: Productos', icon: <AdminPanelSettingsIcon />, path: '/admin/products' },
        { text: 'Admin: Usuarios', icon: <PeopleIcon />, path: '/admin/users' }
    );
    } 
    const drawerContent = (
        <div>
            <Toolbar sx={{ backgroundColor: '#0A3832', display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h6" noWrap component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
                    PetJoy
                </Typography>
            </Toolbar>
            <Divider />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)' }}>
                <List sx={{ flexGrow: 1 }}>
                    {navItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton component={RouterLink} to={item.path} onClick={handleSidebarClose}>
                                <ListItemIcon sx={{ color: 'white' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Box>
                    <Divider />
                    <ListItem disablePadding>
                        <ListItemButton onClick={logout}>
                            <ListItemIcon sx={{ color: '#F2994A' }}><LogoutIcon /></ListItemIcon>
                            <ListItemText primary="Cerrar Sesión" />
                        </ListItemButton>
                    </ListItem>
                </Box>
            </Box>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'white', boxShadow: '0 2px 4px -1px rgba(0,0,0,0.06)' }}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleSidebarOpen} sx={{ mr: 2, color: '#0A3832' }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ color: '#0A3832' }}>
                        ¡Hola, {user ? user.nombre : ''}!
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box onMouseEnter={handleSidebarOpen} sx={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '20px', zIndex: 1200 }}/>

            <Drawer variant="temporary" open={isSidebarOpen} onClose={handleSidebarClose} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#16655B', color: 'white' }}}>
                {drawerContent}
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#FFFBEF', minHeight: '100vh' }}>
                <Toolbar />

                {location.pathname !== '/' && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}> 
                        <Button component={RouterLink} to="/" variant="text" startIcon={<HomeIcon />} sx={{ color: 'text.secondary' }}>
                            Volver al Inicio
                        </Button>
                    </Box>
                )}
                
                {children}
            </Box>
        </Box>
    );
}

export default MainLayout;