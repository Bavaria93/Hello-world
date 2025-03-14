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
import { Edit, Delete } from '@mui/icons-material';

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
                backgroundColor: '#f8f9fa',
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
                    backgroundColor: '#4caf50',
                    color: '#fff',
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
                    backgroundColor: '#f44336',
                    color: '#fff',
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
                  backgroundColor: '#e2e3e5',
                  borderRadius: '5px',
                  width: '100%',
                  height: 'auto',
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
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogContent>
          {/* Campos de Informações do Usuário */}
          <TextField
            margin="normal"
            label="Nome"
            fullWidth
            value={selectedUser?.name || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
          />
          <TextField
            margin="normal"
            label="Email"
            fullWidth
            value={selectedUser?.email || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
          />
          <TextField
            margin="normal"
            label="CPF"
            fullWidth
            value={selectedUser?.cpf || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, cpf: e.target.value })}
          />
          <TextField
            margin="normal"
            label="Telefone"
            fullWidth
            value={selectedUser?.phone || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
          />
          <TextField
            margin="normal"
            label="Idade"
            fullWidth
            value={selectedUser?.age || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, age: e.target.value })}
          />

          {/* Campos de Endereços do Usuário */}
          <Typography variant="h6" gutterBottom>
            Endereços
          </Typography>
          {selectedUser?.addresses.map((address, index) => (
            <Box key={index} style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
              <TextField
                margin="normal"
                label="CEP"
                fullWidth
                value={address.cep || ''}
                onChange={(e) => {
                  const updatedAddresses = [...selectedUser.addresses];
                  updatedAddresses[index].cep = e.target.value;
                  setSelectedUser({ ...selectedUser, addresses: updatedAddresses });
                }}
              />
              <TextField
                margin="normal"
                label="Logradouro"
                fullWidth
                value={address.logradouro || ''}
                onChange={(e) => {
                  const updatedAddresses = [...selectedUser.addresses];
                  updatedAddresses[index].logradouro = e.target.value;
                  setSelectedUser({ ...selectedUser, addresses: updatedAddresses });
                }}
              />
              <TextField
                margin="normal"
                label="Número"
                fullWidth
                value={address.numero || ''}
                onChange={(e) => {
                  const updatedAddresses = [...selectedUser.addresses];
                  updatedAddresses[index].numero = e.target.value;
                  setSelectedUser({ ...selectedUser, addresses: updatedAddresses });
                }}
              />
              <TextField
                margin="normal"
                label="Bairro"
                fullWidth
                value={address.bairro || ''}
                onChange={(e) => {
                  const updatedAddresses = [...selectedUser.addresses];
                  updatedAddresses[index].bairro = e.target.value;
                  setSelectedUser({ ...selectedUser, addresses: updatedAddresses });
                }}
              />
              <TextField
                margin="normal"
                label="Cidade"
                fullWidth
                value={address.cidade || ''}
                onChange={(e) => {
                  const updatedAddresses = [...selectedUser.addresses];
                  updatedAddresses[index].cidade = e.target.value;
                  setSelectedUser({ ...selectedUser, addresses: updatedAddresses });
                }}
              />
              <TextField
                margin="normal"
                label="Estado"
                fullWidth
                value={address.estado || ''}
                onChange={(e) => {
                  const updatedAddresses = [...selectedUser.addresses];
                  updatedAddresses[index].estado = e.target.value;
                  setSelectedUser({ ...selectedUser, addresses: updatedAddresses });
                }}
              />
            </Box>
          ))}
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
