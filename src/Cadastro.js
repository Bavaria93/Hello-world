import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Box, Typography, IconButton, MenuItem } from '@mui/material';
import { Remove } from '@mui/icons-material';

const API_URL = 'http://localhost:5000/users';

function Cadastro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [currentAddress, setCurrentAddress] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
  });
  const [addresses, setAddresses] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const formatCpf = (value) => {
    value = value.replace(/\D/g, '');
    value = value.substring(0, 11);
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{0,3})/, '$1.$2');
    }
    return value;
  };

  const formatPhone = (value) => {
    value = value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else {
      value = value.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatCep = (value) => {
    value = value.replace(/\D/g, '');
    value = value.substring(0, 8);
    if (value.length > 5) {
      value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    }
    return value;
  };

  const handleAddressChange = (field, value) => {
    setCurrentAddress({
      ...currentAddress,
      [field]: value,
    });
  };

  const handleAddAddress = () => {
    if (!validateAddressFields()) return;

    setAddresses([...addresses, currentAddress]);
    setCurrentAddress({
      cep: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
    });
  };

  const validateAddressFields = () => {
    let tempErrors = {};

    if (!currentAddress.cep.trim()) tempErrors.cep = 'O CEP é obrigatório.';
    if (!currentAddress.logradouro.trim()) tempErrors.logradouro = 'O logradouro é obrigatório.';
    if (!currentAddress.numero.trim()) tempErrors.numero = 'O número é obrigatório.';
    if (!currentAddress.bairro.trim()) tempErrors.bairro = 'O bairro é obrigatório.';
    if (!currentAddress.cidade.trim()) tempErrors.cidade = 'A cidade é obrigatória.';
    if (!currentAddress.estado.trim()) tempErrors.estado = 'O estado é obrigatório.';

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const validateUserFields = () => {
    let tempErrors = {};

    tempErrors.name = name
      ? (/^[A-Za-z\s]+$/.test(name) ? '' : 'Nome não pode incluir números')
      : 'Nome é obrigatório';

    tempErrors.email = email
      ? (/.+@.+\..+/.test(email) ? '' : 'Email inválido')
      : 'Email é obrigatório';

    tempErrors.cpf = cpf.length === 14 ? '' : 'CPF inválido';

    tempErrors.phone = phone.length >= 13 ? '' : 'Telefone inválido';

    tempErrors.age = age
      ? (/^\d+$/.test(age) ? '' : 'Idade deve incluir apenas números')
      : 'Idade é obrigatória';

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!validateUserFields()) return;

    axios
      .post(API_URL, { name, email, cpf, phone, age, addresses })
      .then(() => {
        setSuccessMessage('Usuário cadastrado com sucesso!');
        setErrorMessage('');
        clearForm();
      })
      .catch((error) => {
        setErrorMessage('Erro ao cadastrar o usuário.');
        setSuccessMessage('');
      });
  };

  const handleRemoveAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setCpf('');
    setPhone('');
    setAge('');
    setAddresses([]);
    setCurrentAddress({
      cep: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
    });
    setErrors({});
  };

  return (
    <Container maxWidth="sm" style={{ padding: '20px' }}>
      {successMessage && <Typography style={{ color: 'green' }}>{successMessage}</Typography>}
      {errorMessage && <Typography style={{ color: 'red' }}>{errorMessage}</Typography>}
  
      <Box component="form" onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Formulário de Usuário */}
        <Box style={{ padding: '20px', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom>Dados Pessoais</Typography>
          <TextField
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="CPF"
            value={cpf}
            onChange={(e) => setCpf(formatCpf(e.target.value))}
            fullWidth
            margin="normal"
            error={!!errors.cpf}
            helperText={errors.cpf}
          />
          <Box style={{ display: 'flex', gap: '15px' }}>
            <TextField
              label="Telefone"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              inputProps={{ maxLength: 15 }}
              fullWidth
              margin="normal"
              error={!!errors.phone}
              helperText={errors.phone}
            />
            <TextField
              label="Idade"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={{ width: '120px' }}
              margin="normal"
              error={!!errors.age}
              helperText={errors.age}
            />
          </Box>
        </Box>
  
        {/* Formulário de Endereço */}
        <Box style={{ padding: '20px', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom>Endereço</Typography>
          <TextField
            label="CEP"
            value={currentAddress.cep}
            onChange={(e) => handleAddressChange('cep', formatCep(e.target.value))}
            fullWidth
            margin="normal"
            error={!!errors.cep}
            helperText={errors.cep}
          />
          <Box style={{ display: 'flex', gap: '15px' }}>
            <TextField
              label="Logradouro"
              value={currentAddress.logradouro}
              onChange={(e) => handleAddressChange('logradouro', e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.logradouro}
              helperText={errors.logradouro}
            />
            <TextField
              label="Número"
              value={currentAddress.numero}
              onChange={(e) => handleAddressChange('numero', e.target.value)}
              style={{ width: '120px' }}
              margin="normal"
              error={!!errors.numero}
              helperText={errors.numero}
            />
          </Box>
          <TextField
            label="Bairro"
            value={currentAddress.bairro}
            onChange={(e) => handleAddressChange('bairro', e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.bairro}
            helperText={errors.bairro}
          />
          <Box style={{ display: 'flex', gap: '15px' }}>
            <TextField
              label="Cidade"
              value={currentAddress.cidade}
              onChange={(e) => handleAddressChange('cidade', e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.cidade}
              helperText={errors.cidade}
            />
            <TextField
              select
              label="Estado"
              value={currentAddress.estado}
              onChange={(e) => handleAddressChange('estado', e.target.value)}
              style={{ width: '120px' }}
              margin="normal"
              error={!!errors.estado}
              helperText={errors.estado}
            >
              <MenuItem value="AC">AC</MenuItem>
              <MenuItem value="AL">AL</MenuItem>
              <MenuItem value="AP">AP</MenuItem>
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="BA">BA</MenuItem>
              <MenuItem value="CE">CE</MenuItem>
              <MenuItem value="DF">DF</MenuItem>
              <MenuItem value="ES">ES</MenuItem>
              <MenuItem value="GO">GO</MenuItem>
              <MenuItem value="MA">MA</MenuItem>
              <MenuItem value="MT">MT</MenuItem>
              <MenuItem value="MS">MS</MenuItem>
              <MenuItem value="MG">MG</MenuItem>
              <MenuItem value="PA">PA</MenuItem>
              <MenuItem value="PB">PB</MenuItem>
              <MenuItem value="PR">PR</MenuItem>
              <MenuItem value="PE">PE</MenuItem>
              <MenuItem value="PI">PI</MenuItem>
              <MenuItem value="RJ">RJ</MenuItem>
              <MenuItem value="RN">RN</MenuItem>
              <MenuItem value="RS">RS</MenuItem>
              <MenuItem value="RO">RO</MenuItem>
              <MenuItem value="RR">RR</MenuItem>
              <MenuItem value="SC">SC</MenuItem>
              <MenuItem value="SP">SP</MenuItem>
              <MenuItem value="SE">SE</MenuItem>
              <MenuItem value="TO">TO</MenuItem>
            </TextField>
          </Box>
  
          <Box display="flex" justifyContent="center" marginTop="10px">
            <Button onClick={handleAddAddress} variant="contained" color="secondary">
              Salvar Endereço
            </Button>
          </Box>
        </Box>
  
        {/* Lista de Endereços Adicionados */}
        <Box style={{ marginTop: '20px', padding: '20px', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom>Lista de Endereços</Typography>
          {addresses.map((address, index) => (
            <Box
              key={index}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #ddd' }}
            >
              <Typography>{`${address.logradouro}, ${address.numero} - ${address.bairro}, ${address.cidade} - ${address.estado}, CEP: ${address.cep}`}</Typography>
              <IconButton onClick={() => handleRemoveAddress(index)} aria-label="Remover Endereço">
                <Remove />
              </IconButton>
            </Box>
          ))}
        </Box>
  
        {/* Botão de Cadastro */}
        <Box display="flex" justifyContent="center" marginTop="10px">
          <Button type="submit" variant="contained" color="primary">
            Cadastrar Usuário
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Cadastro;
