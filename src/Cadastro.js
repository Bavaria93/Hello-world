import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Box, Typography, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const API_URL = 'http://localhost:5000/users';

function Cadastro() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: '',
    addresses: [''],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleAddressChange = (index, value) => {
    const newAddresses = user.addresses.map((address, i) => (i === index ? value : address));
    setUser({ ...user, addresses: newAddresses });
  };

  const addAddressField = () => {
    setUser({ ...user, addresses: [...user.addresses, ''] });
  };

  const removeAddressField = (index) => {
    const newAddresses = user.addresses.filter((_, i) => i !== index);
    setUser({ ...user, addresses: newAddresses });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    axios
      .post(API_URL, user)
      .then(() => {
        setUser({ name: '', email: '', age: '', addresses: [''] });
      })
      .catch((error) => {
        console.error('Erro ao cadastrar usuário:', error);
      });
  };

  return (
    <Container maxWidth="sm" style={{ backgroundColor: '#f8f9fa', borderRadius: '5px', padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6" align="center" gutterBottom>
        Cadastro de Usuários
      </Typography>
      <Box
        component="form"
        onSubmit={handleAddUser}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        <TextField
          label="Nome"
          name="name"
          value={user.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={user.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Idade"
          name="age"
          value={user.age}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        {user.addresses.map((address, index) => (
          <Box key={index} display="flex" alignItems="center">
            <TextField
              label={`Endereço ${index + 1}`}
              value={address}
              onChange={(e) => handleAddressChange(index, e.target.value)}
              fullWidth
              margin="normal"
            />
            <IconButton onClick={() => removeAddressField(index)} aria-label="remover endereço">
              <Remove />
            </IconButton>
          </Box>
        ))}
        <Box display="flex" justifyContent="center" marginBottom="10px">
          <Button onClick={addAddressField} variant="outlined" color="primary" startIcon={<Add />}>
            Adicionar Endereço
          </Button>
        </Box>
        <Box display="flex" justifyContent="center" marginTop="10px">
          <Button type="submit" variant="contained" color="primary">
            Cadastrar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Cadastro;
