import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, List, ListItem, ListItemText, IconButton, Typography, Box, Paper, Grid } from '@mui/material';
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get(API_URL)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleAddOrUpdateUser = () => {
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
  };

  return (
    <Container maxWidth="md" className="App">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>Cadastro de Usuários</Typography>
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Age"
                value={age}
                onChange={e => setAge(e.target.value)}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                margin="normal"
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddOrUpdateUser}
            style={{ marginTop: '10px' }}
          >
            {editingUser ? "Update" : "Add"}
          </Button>
        </Box>
        <Typography variant="h4" align="center" gutterBottom style={{ marginTop: '20px' }}>
          Lista de Usuários Cadastrados
        </Typography>
        <List>
          {users.map(user => (
            <ListItem key={user.id} style={{ borderBottom: '1px solid #ccc' }}>
              <ListItemText
                primary={user.name}
                secondary={`${user.email}, ${user.age}, ${user.address}`}
              />
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditUser(user)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteUser(user.id)}>
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default App;
