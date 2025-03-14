import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { Edit, Delete, Add, Remove } from '@mui/icons-material';

const API_URL = 'http://localhost:5000/users';

function ListaUsuarios() {
  const [users, setUsers] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Dados do usuário selecionado

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const formatCpf = (value) => {
    value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
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
    value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (value.length > 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else {
      value = value.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatCep = (value) => {
    value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (value.length > 5) {
      value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    }
    return value;
  };

  const handleOpenEditDialog = (user) => {
    setSelectedUser(user); // Define o usuário para edição
    setEditDialogOpen(true); // Abre a janela de edição
  };

  const handleCloseEditDialog = () => {
    setSelectedUser(null); // Reseta o usuário selecionado
    setEditDialogOpen(false); // Fecha a janela de edição
  };

  const handleUpdateUser = async () => {
    if (selectedUser) {
      try {
        await axios.put(`${API_URL}/${selectedUser.id}`, selectedUser);
        fetchUsers(); // Atualiza a lista de usuários
        handleCloseEditDialog(); // Fecha o diálogo de edição
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
      }
    }
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user); // Define o usuário para exclusão
    setDeleteDialogOpen(true); // Abre a janela de exclusão
  };

  const handleCloseDeleteDialog = () => {
    setSelectedUser(null); // Reseta o usuário selecionado
    setDeleteDialogOpen(false); // Fecha a janela de exclusão
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await axios.delete(`${API_URL}/${selectedUser.id}`);
        fetchUsers(); // Atualiza a lista de usuários
        handleCloseDeleteDialog(); // Fecha o diálogo
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
      }
    }
  };

  const handleAddAddress = () => {
    setSelectedUser({
      ...selectedUser,
      addresses: [...selectedUser.addresses, { cep: '', logradouro: '', numero: '', bairro: '', cidade: '', estado: '' }]
    });
  };

  const handleRemoveAddress = (index) => {
    const updatedAddresses = selectedUser.addresses.filter((_, i) => i !== index);
    setSelectedUser({ ...selectedUser, addresses: updatedAddresses });
  };

  return (
    <Container maxWidth="md" style={{ padding: '20px' }}>
      <Grid container spacing={3} justifyContent="center">
        {users.map((user) => (
          <Grid item key={user.id} xs={12} sm={6} md={4}>
            <Card
              style={{
                width: '100%',
                maxWidth: '300px',
                height: '300px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #dee2e6',
                borderRadius: '10px',
              }}
            >
              <Box
                position="absolute"
                top="10px"
                right="10px"
                display="flex"
                gap="10px"
              >
                {/* Botão de Edição */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditDialog(user);
                  }}
                  style={{
                    borderRadius: '50%',
                  }}
                >
                  <Edit />
                </IconButton>
                {/* Botão de Exclusão */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDeleteDialog(user);
                  }}
                  style={{
                    borderRadius: '50%',
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
              <CardContent
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  padding: '10px',
                  borderRadius: '5px',
                  width: '100%',
                  height: '200',
                }}
              >
                <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  {user.name}
                </Typography>
                <Typography variant="body1" color="textSecondary" style={{ marginBottom: '5px' }}>
                  Email: {user.email}
                </Typography>
                <Typography variant="body1" color="textSecondary" style={{ marginBottom: '5px' }}>
                  CPF: {user.cpf}
                </Typography>
                <Typography variant="body1" color="textSecondary" style={{ marginBottom: '5px' }}>
                  Telefone: {user.phone}
                </Typography>
                <Typography variant="body1" color="textSecondary" style={{ marginBottom: '5px' }}>
                  Idade: {user.age}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Endereço:
                  {user.addresses && user.addresses.length > 0
                    ? `${user.addresses[0].logradouro}, ${user.addresses[0].numero} - ${user.addresses[0].bairro}, ${user.addresses[0].cidade}, ${user.addresses[0].estado} (CEP: ${user.addresses[0].cep})`
                    : 'Nenhum endereço disponível'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo de Exclusão */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza de que deseja excluir o usuário <strong>{selectedUser?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteUser} color="secondary">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Edição */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
  <DialogTitle>Editar Usuário</DialogTitle>
  <DialogContent>
    <Box
      component="form"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        padding: '20px',
        borderRadius: '8px',
      }}
    >
      {/* Informações do Usuário */}
      <Typography variant="h6" gutterBottom>
        Informações do Usuário
      </Typography>
      <TextField
        label="Nome"
        value={selectedUser?.name || ''}
        onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        value={selectedUser?.email || ''}
        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="CPF"
        value={selectedUser?.cpf || ''}
        onChange={(e) => setSelectedUser({ ...selectedUser, cpf: formatCpf(e.target.value) })}
        fullWidth
        margin="normal"
        inputProps={{ maxLength: 14 }}
      />
      <Box style={{ display: 'flex', gap: '15px' }}>
        <TextField
          label="Telefone"
          value={selectedUser?.phone || ''}
          onChange={(e) => setSelectedUser({ ...selectedUser, phone: formatPhone(e.target.value) })}
          style={{ width: '120px' }} // Largura igual à do campo de número e estado
          margin="normal"
          inputProps={{ maxLength: 15 }}
        />
        <TextField
          label="Idade"
          type="number"
          value={selectedUser?.age || ''}
          onChange={(e) => setSelectedUser({ ...selectedUser, age: e.target.value })}
          style={{ width: '120px' }} // Largura igual à do campo de número e estado
          margin="normal"
        />
      </Box>

      {/* Endereços do Usuário */}
      <Typography variant="h6" gutterBottom>
        Endereços
      </Typography>
      {selectedUser?.addresses.map((address, index) => (
        <Box key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <TextField
            label="CEP"
            value={address.cep || ''}
            onChange={(e) => {
              const updatedAddresses = [...selectedUser.addresses];
              updatedAddresses[index].cep = formatCep(e.target.value);
              setSelectedUser({ ...selectedUser, addresses: updatedAddresses });
            }}
            fullWidth
            margin="normal"
            inputProps={{ maxLength: 9 }}
          />
          <Box style={{ display: 'flex', gap: '15px' }}>
            <TextField
              label="Logradouro"
              value={address.logradouro || ''}
              onChange={(e) => {
                const updatedAddresses = [...selectedUser.addresses];
                updatedAddresses[index].logradouro = e.target.value;
                setSelectedUser({ ...selectedUser, addresses: updatedAddresses });
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Número"
              value={address.numero || ''}
              onChange={(e) => {
                const updatedAddresses = [...selectedUser.addresses];
                updatedAddresses[index].numero = e.target.value;
                setSelectedUser({ ...selectedUser, addresses: updatedAddresses });
              }}
              style={{ width: '120px' }}
              margin="normal"
            />
          </Box>
          <TextField
            label="Bairro"
            value={address.bairro || ''}
            onChange={(e) => {
              const updatedAddresses = [...selectedUser.addresses];
              updatedAddresses[index].bairro = e.target.value;
              setSelectedUser({ ...selectedUser, addresses: updatedAddresses });
            }}
            fullWidth
            margin="normal"
          />
          <Box style={{ display: 'flex', gap: '15px' }}>
            <TextField
              label="Cidade"
              value={address.cidade || ''}
              onChange={(e) => {
                const updatedAddresses = [...selectedUser.addresses];
                updatedAddresses[index].cidade = e.target.value;
                setSelectedUser({ ...selectedUser, addresses: updatedAddresses });
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Estado"
              value={address.estado || ''}
              onChange={(e) => {
                const updatedAddresses = [...selectedUser.addresses];
                updatedAddresses[index].estado = e.target.value;
                setSelectedUser({ ...selectedUser, addresses: updatedAddresses });
              }}
              style={{ width: '120px' }}
              margin="normal"
            />
          </Box>
          <Box display="flex" justifyContent="center" marginTop="10px">
            <Button
              onClick={() => handleRemoveAddress(index)}
              variant="outlined"
              color="secondary"
              startIcon={<Remove />}
            >
              Remover Endereço
            </Button>
          </Box>
        </Box>
      ))}
      <Button onClick={handleAddAddress} variant="contained" color="primary" startIcon={<Add />}>
        Adicionar Endereço
      </Button>
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseEditDialog} color="primary">
      Cancelar
    </Button>
    <Button onClick={handleUpdateUser} color="primary">
      Salvar
    </Button>
  </DialogActions>
</Dialog>
    </Container>
  );
}

export default ListaUsuarios;
