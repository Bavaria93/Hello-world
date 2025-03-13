import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Box, Typography, IconButton } from '@mui/material';
import { Remove } from '@mui/icons-material';

const API_URL = 'http://localhost:5000/users';

function Cadastro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
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

  // Função para formatar o CPF enquanto o usuário digita
  const formatCpf = (value) => {
    // Remove caracteres não numéricos
    value = value.replace(/\D/g, '');

    // Limita o número de caracteres a 11 (formato CPF sem pontuação)
    value = value.substring(0, 11);

    // Aplica a máscara do CPF: xxx.xxx.xxx-xx
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{0,3})/, '$1.$2');
    }

    return value;
  };

  // Função para formatar o CEP enquanto o usuário digita
  const formatCep = (value) => {
    // Remove caracteres não numéricos
    value = value.replace(/\D/g, '');

    // Limita o número de caracteres a 8 (formato CEP sem pontuação)
    value = value.substring(0, 8);

    // Aplica a máscara do CEP: xxxxx-xxx
    if (value.length > 5) {
      value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    }

    return value;
  };

  const validateUserFields = () => {
    let tempErrors = {};

    // Validação do Nome
    tempErrors.name = name
      ? (/^[A-Za-z\s]+$/.test(name) ? '' : 'Nome não pode incluir números')
      : 'Nome é obrigatório';

    // Validação do Email
    tempErrors.email = email
      ? (/.+@.+\..+/.test(email) ? '' : 'Email inválido')
      : 'Email é obrigatório';

    // Validação do CPF
    tempErrors.cpf = cpf
      ? (/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf) ? '' : 'CPF inválido. Use o formato xxx.xxx.xxx-xx')
      : 'CPF é obrigatório';

    // Validação da Idade
    tempErrors.age = age
      ? (/^\d+$/.test(age) ? '' : 'Idade deve incluir apenas números')
      : 'Idade é obrigatória';

    // Validação Condicional de Endereços
    if (addresses.length === 0) {
      tempErrors.addresses = 'É necessário adicionar pelo menos um endereço.';
    }

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const validateAddressFields = () => {
    let tempErrors = {};

    // Validação dos Campos de Endereço
    if (!currentAddress.cep.trim()) tempErrors.cep = 'O CEP é obrigatório.';
    if (!currentAddress.logradouro.trim()) tempErrors.logradouro = 'O logradouro é obrigatório.';
    if (!currentAddress.numero.trim()) tempErrors.numero = 'O número é obrigatório.';
    if (!currentAddress.bairro.trim()) tempErrors.bairro = 'O bairro é obrigatório.';
    if (!currentAddress.cidade.trim()) tempErrors.cidade = 'A cidade é obrigatória.';
    if (!currentAddress.estado.trim()) tempErrors.estado = 'O estado é obrigatório.';

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!validateUserFields()) return;

    axios
      .post(API_URL, { name, email, cpf, age, addresses })
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

  // Função para capturar mudanças nos campos do endereço (atualiza dinamicamente o estado `currentAddress`)
  const handleAddressChange = (field, value) => {
    setCurrentAddress({
      ...currentAddress, // Mantém os outros valores existentes
      [field]: value,    // Atualiza apenas o campo correspondente
    });
  };

  // Função para adicionar o endereço à lista de endereços (estado `addresses`)
  const handleAddAddress = () => {
    if (!validateAddressFields()) return;

    setAddresses([...addresses, currentAddress]); // Adiciona o endereço ao array
    setCurrentAddress({
      cep: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
    }); // Reseta os campos após adicionar
  };
  
  const handleRemoveAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setCpf('');
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
          <TextField
            label="Idade"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.age}
            helperText={errors.age}
          />
        </Box>

        {/* Formulário de Endereço */}
        <Box style={{ backgroundColor: '#e0f7fa', padding: '20px', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom>Adicionar Endereço</Typography>
          <TextField
            label="CEP"
            value={currentAddress.cep}
            onChange={(e) => setCurrentAddress({ ...currentAddress, cep: formatCep(e.target.value) })}
            fullWidth
            margin="normal"
            error={!!errors.cep}
            helperText={errors.cep}
          />
          <TextField
            label="Logradouro"
            value={currentAddress.logradouro}
            onChange={(e) => setCurrentAddress({ ...currentAddress, logradouro: e.target.value })}
            fullWidth
            margin="normal"
            error={!!errors.logradouro}
            helperText={errors.logradouro}
          />
          <TextField
            label="Número"
            value={currentAddress.numero}
            onChange={(e) => setCurrentAddress({ ...currentAddress, numero: e.target.value })}
            fullWidth
            margin="normal"
            error={!!errors.numero}
            helperText={errors.numero}
          />
          <TextField
            label="Bairro"
            value={currentAddress.bairro}
            onChange={(e) => setCurrentAddress({ ...currentAddress, bairro: e.target.value })}
            fullWidth
            margin="normal"
            error={!!errors.bairro}
            helperText={errors.bairro}
          />
          <TextField
            label="Cidade"
            value={currentAddress.cidade}
            onChange={(e) => setCurrentAddress({ ...currentAddress, cidade: e.target.value })}
            fullWidth
            margin="normal"
            error={!!errors.cidade}
            helperText={errors.cidade}
          />
          <TextField
            label="Estado"
            value={currentAddress.estado}
            onChange={(e) => setCurrentAddress({ ...currentAddress, estado: e.target.value })}
            fullWidth
            margin="normal"
            error={!!errors.estado}
            helperText={errors.estado}
          />
          <Box display="flex" justifyContent="center" marginTop="10px">
            <Button onClick={handleAddAddress} variant="contained" color="secondary">
              Salvar Endereço
            </Button>
          </Box>
        </Box>

        {/* Lista de Endereços */}
        <Box style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom>Lista de Endereços</Typography>
          {addresses.map((address, index) => (
            <Box
              key={index}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}
            >
              <Typography>
                {address.cep}, {address.logradouro}, {address.numero}, {address.bairro}, {address.cidade}, {address.estado}
              </Typography>
              <IconButton onClick={() => handleRemoveAddress(index)} aria-label="remover endereço">
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
