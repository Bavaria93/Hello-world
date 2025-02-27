import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import Cadastro from './Cadastro';
import ListaUsuarios from './ListaUsuarios';

function App() {
  return (
    <Router>
      <Container maxWidth="md">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Aplicação CRUD
            </Typography>
            <Button color="inherit" component={Link} to="/cadastro">
              Cadastro de Usuários
            </Button>
            <Button color="inherit" component={Link} to="/usuarios">
              Lista de Usuários
            </Button>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/usuarios" element={<ListaUsuarios />} />
          <Route path="/" element={<Cadastro />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
