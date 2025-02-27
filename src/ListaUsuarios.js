import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, CardActions, Grid, Typography, IconButton, Paper } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const API_URL = 'http://localhost:5000/users';

function ListaUsuarios() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get(API_URL)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleEditUser = (user) => {
    // Função de editar usuário (a ser implementada)
  };

  const handleDeleteUser = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => fetchUsers());
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>Lista de Usuários Cadastrados</Typography>
        <Grid container direction="column" spacing={2}>
          {users.map(user => (
            <Grid item xs={12} key={user.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography color="textSecondary">{user.email}</Typography>
                  <Typography color="textSecondary">Idade: {user.age}</Typography>
                  <Typography color="textSecondary">Endereço: {user.address}</Typography>
                </CardContent>
                <CardActions>
                  <IconButton edge="start" aria-label="editar" onClick={() => handleEditUser(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="deletar" onClick={() => handleDeleteUser(user.id)}>
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}

export default ListaUsuarios;
