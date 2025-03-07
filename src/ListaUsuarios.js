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
                backgroundColor: '#f8f9fa', // Cor de fundo para o card
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
                    backgroundColor: '#4caf50', // Fundo verde para o botão de edição
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
                    backgroundColor: '#f44336', // Fundo vermelho para o botão de exclusão
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
                  alignItems: 'flex-start', // Alinha os itens à esquerda
                  textAlign: 'left', // Garante alinhamento à esquerda
                  padding: '10px', // Padding geral para todo o conteúdo
                  backgroundColor: '#e2e3e5', // Fundo cinza claro
                  borderRadius: '5px',
                  width: '100%',
                  height: 'auto',
                }}
              >
                {/* Dados do Usuário */}
                <Typography
                  variant="h5"
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    color: '#212529',
                    paddingInline: '20px', // Padding horizontal para o nome
                  }}
                >
                  {user.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  style={{
                    marginBottom: '5px',
                    color: '#495057',
                    paddingInline: '20px', // Padding horizontal para o email
                  }}
                >
                  {user.email}
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  style={{
                    marginBottom: '5px',
                    color: '#495057',
                    paddingInline: '20px', // Padding horizontal para a idade
                  }}
                >
                  Idade: {user.age}
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  style={{
                    color: '#495057',
                    paddingInline: '20px', // Padding horizontal para o endereço
                  }}
                >
                  Endereço: {user.address}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Diálogo de Exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza de que deseja excluir o usuário{' '}
            <strong>{selectedUser?.name}</strong>?
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
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        aria-labelledby="edit-dialog-title"
      >
        <DialogTitle id="edit-dialog-title">Editar Usuário</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Nome"
            fullWidth
            value={selectedUser?.name || ''}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, name: e.target.value })
            }
          />
          <TextField
            margin="normal"
            label="Email"
            fullWidth
            value={selectedUser?.email || ''}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, email: e.target.value })
            }
          />
          <TextField
            margin="normal"
            label="Idade"
            fullWidth
            value={selectedUser?.age || ''}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, age: e.target.value })
            }
          />
          <TextField
            margin="normal"
            label="Endereço"
            fullWidth
            value={selectedUser?.address || ''}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, address: e.target.value })
            }
          />
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
