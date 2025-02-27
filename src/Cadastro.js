import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Grid, Typography, Box, Paper } from '@mui/material';

const API_URL = 'http://localhost:5000/users';

function Cadastro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = name ? (/^[A-Za-z\s]+$/.test(name) ? "" : "Nome não pode incluir números") : "Nome é obrigatório";
    tempErrors.email = email ? (/.+@.+\..+/.test(email) ? "" : "Email inválido") : "Email é obrigatório";
    tempErrors.age = age ? (/^\d+$/.test(age) ? "" : "Idade deve incluir apenas números") : "Idade é obrigatória";
    tempErrors.address = address ? "" : "Endereço é obrigatório";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleAddUser = () => {
    if (!validate()) return;

    axios.post(API_URL, { name, email, age, address })
      .then(() => {
        clearForm();
      });
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setAge('');
    setAddress('');
    setErrors({});
  };

  return (
    <Container maxWidth="md">
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
            onClick={handleAddUser}
            style={{ marginTop: '10px' }}
          >
            Adicionar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Cadastro;
