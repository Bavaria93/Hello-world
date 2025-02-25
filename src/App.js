import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Card, CardContent, CardActions, Grid, Typography, IconButton, Box, Paper } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import './App.css';

const API_URL = 'http://localhost:5000/users';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get(API_URL)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = name ? (/^[A-Za-z\s]+$/.test(name) ? "" : "Nome não pode incluir números") : "Nome é obrigatório";
    tempErrors.email = email ? (/.+@.+\..+/.test(email) ? "" : "Email inválido") : "Email é obrigatório";
    tempErrors.age = age ? (/^\d+$/.test(age) ? "" : "Idade deve incluir apenas números") : "Idade é obrigatória";
    tempErrors.address = address ? "" : "Endereço é obrigatório";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleAddOrUpdateUser = () => {
    if (!validate()) return;

    if (editingUser) {
      axios.put(`${API_URL}/${editingUser.id}`, { name, email, age, address })
        .then(() => {
          fetchUsers();
          setEditingUser(null);
          clearForm();
        });
    } else {
      axios.post(API_URL, { name, email, age, address })
        .then(() => {
          fetchUsers();
          clearForm();
        });
    }
  };

  const handleEditUser = (user) => {
    setName(user.name);
    setEmail(user.email);
    setAge(user.age);
    setAddress(user.address);
    setEditingUser(user);
  };

  const handleDeleteUser = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => fetchUsers());
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setAge('');
    setAddress('');
    setErrors({});
  };

  return (
    <Container maxWidth="md" className="App">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>Cadastro de Usuários</Typography>
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Nome"
                value={name}
                onChange={e => setName(e.target.value)}
                margin="normal"
                fullWidth
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                margin="normal"
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Idade"
                value={age}
                onChange={e => setAge(e.target.value)}
                margin="normal"
                fullWidth
                error={!!errors.age}
                helperText={errors.age}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Endereço"
                value={address}
                onChange={e => setAddress(e.target.value)}
                margin="normal"
                fullWidth
                error={!!errors.address}
                helperText={errors.address}
                required
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddOrUpdateUser}
            style={{ marginTop: '10px' }}
          >
            {editingUser ? "Atualizar" : "Adicionar"}
          </Button>
        </Box>
        <Typography variant="h4" align="center" gutterBottom style={{ marginTop: '20px' }}>
          Lista de Usuários Cadastrados
        </Typography>
        <Grid container direction="column" spacing={2}>
          {users.map(user => (
            <Grid item xs={12} key={user.id}>
              <Box width="100%">
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
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}

export default App;
