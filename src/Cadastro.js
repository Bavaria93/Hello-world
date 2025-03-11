import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Box, Typography, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const API_URL = 'http://localhost:5000/users';

function Cadastro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [addresses, setAddresses] = useState([{ logradouro: '', bairro: '', cidade: '', estado: '' }]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    let tempErrors = {};

    // Validação do Nome
    tempErrors.name = name
      ? (/^[A-Za-z\s]+$/.test(name) ? '' : 'Nome não pode incluir números')
      : 'Nome é obrigatório';

    // Validação do Email
    tempErrors.email = email
      ? (/.+@.+\..+/.test(email) ? '' : 'Email inválido')
      : 'Email é obrigatório';

    // Validação da Idade
    tempErrors.age = age
      ? (/^\d+$/.test(age) ? '' : 'Idade deve incluir apenas números')
      : 'Idade é obrigatória';

    // Validação dos Endereços
    addresses.forEach((address, index) => {
      if (!address.logradouro.trim()) tempErrors[`logradouro_${index}`] = 'O logradouro é obrigatório.';
      if (!address.bairro.trim()) tempErrors[`bairro_${index}`] = 'O bairro é obrigatório.';
      if (!address.cidade.trim()) tempErrors[`cidade_${index}`] = 'A cidade é obrigatória.';
      if (!address.estado.trim()) tempErrors[`estado_${index}`] = 'O estado é obrigatório.';
    });

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!validate()) return;

    axios
      .post(API_URL, { name, email, age, addresses })
      .then(() => {
        setSuccessMessage('Usuário cadastrado com sucesso!');
        setErrorMessage('');
        clearForm();
      })
      .catch((error) => {
        const errorMsg = error.response ? error.response.data.message : 'Erro ao cadastrar o usuário. Por favor, tente novamente.';
        setErrorMessage(errorMsg);
        setSuccessMessage('');
        console.error('Detalhes do erro:', error);
      });
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setAge('');
    setAddresses([{ logradouro: '', bairro: '', cidade: '', estado: '' }]);
    setErrors({});
  };

  const handleAddressChange = (index, key, value) => {
    const updatedAddresses = addresses.map((address, i) =>
      i === index ? { ...address, [key]: value } : address
    );
    setAddresses(updatedAddresses);
  };

  const addAddressField = () => {
    setAddresses([...addresses, { logradouro: '', bairro: '', cidade: '', estado: '' }]);
  };

  const removeAddressField = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };

  return (
    <Container maxWidth="sm" style={{ padding: '20px', backgroundColor: '#f0f4f8' }}>
      {successMessage && (
        <Typography style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</Typography>
      )}
      {errorMessage && (
        <Typography style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</Typography>
      )}
      <Box component="form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={handleAddUser}>
        <Box style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom>Informações do Usuário</Typography>
          <TextField
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            required
          />
          <TextField
            label="Idade"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.age}
            helperText={errors.age}
            required
          />
        </Box>
        <Box style={{ backgroundColor: '#e0f7fa', padding: '20px', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom>Endereços</Typography>
          {addresses.map((address, index) => (
            <React.Fragment key={index}>
              <TextField
                label="Logradouro"
                value={address.logradouro}
                onChange={(e) => handleAddressChange(index, 'logradouro', e.target.value)}
                fullWidth
                margin="normal"
                error={!!errors[`logradouro_${index}`]}
                helperText={errors[`logradouro_${index}`]}
                required
              />
              <TextField
                label="Bairro"
                value={address.bairro}
                onChange={(e) => handleAddressChange(index, 'bairro', e.target.value)}
                fullWidth
                margin="normal"
                error={!!errors[`bairro_${index}`]}
                helperText={errors[`bairro_${index}`]}
                required
              />
              <TextField
                label="Cidade"
                value={address.cidade}
                onChange={(e) => handleAddressChange(index, 'cidade', e.target.value)}
                fullWidth
                margin="normal"
                error={!!errors[`cidade_${index}`]}
                helperText={errors[`cidade_${index}`]}
                required
              />
              <TextField
                label="Estado"
                value={address.estado}
                onChange={(e) => handleAddressChange(index, 'estado', e.target.value)}
                fullWidth
                margin="normal"
                error={!!errors[`estado_${index}`]}
                helperText={errors[`estado_${index}`]}
                required
              />
              <IconButton onClick={() => removeAddressField(index)} aria-label="remover endereço">
                <Remove />
              </IconButton>
            </React.Fragment>
          ))}
          <Box display="flex" justifyContent="center" marginBottom="10px">
            <Button onClick={addAddressField} variant="outlined" color="primary" startIcon={<Add />}>
              Adicionar Endereço
            </Button>
          </Box>
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
