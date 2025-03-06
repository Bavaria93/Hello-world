import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Cadastro from './Cadastro';
import ListaUsuarios from './ListaUsuarios';

function NavigationBar() {
  const location = useLocation(); // Obtém a rota atual

  return (
    <AppBar position="static" style={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Box display="flex" flexDirection="column" alignItems="center" width="100%">
          <Typography variant="h4" style={{ color: '#ffffff', fontWeight: 'bold' }}>
            Aplicação de Gerenciamento de Usuários
          </Typography>
          <Box display="flex" justifyContent="center" width="100%" position="relative">
            <Button
              component={Link}
              to="/usuarios"
              style={{
                color: location.pathname === '/usuarios' || location.pathname === '/' ? '#ffffff' : '#b0bec5',
                position: 'relative',
                margin: '0 10px',
              }}
            >
              Lista de Usuários
              {location.pathname === '/usuarios' || location.pathname === '/' ? (
                <Box
                  style={{
                    position: 'absolute',
                    bottom: -5,
                    left: 0,
                    width: '100%',
                    height: '3px',
                    backgroundColor: '#ffcc00',
                  }}
                />
              ) : null}
            </Button>
            <Button
              component={Link}
              to="/cadastro"
              style={{
                color: location.pathname === '/cadastro' ? '#ffffff' : '#b0bec5',
                position: 'relative',
                margin: '0 10px',
              }}
            >
              Cadastro de Usuários
              {location.pathname === '/cadastro' ? (
                <Box
                  style={{
                    position: 'absolute',
                    bottom: -5,
                    left: 0,
                    width: '100%',
                    height: '3px',
                    backgroundColor: '#ffcc00',
                  }}
                />
              ) : null}
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <Router>
      <Container maxWidth="md">
        <NavigationBar />
        <Routes>
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/usuarios" element={<ListaUsuarios />} />
          <Route path="/" element={<ListaUsuarios />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
