import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Grid, Typography, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const API_URL = 'http://localhost:5000/users';

function ListaUsuarios() {
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false); // Controle do estado do diálogo de exclusão
  const [editingUser, setEditingUser] = useState(null); // Controle do estado do diálogo de edição

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get(API_URL)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Erro ao buscar usuários:', error));
  };

  const handleOpenEditDialog = (user) => {
    console.log('Abrindo diálogo de edição para o usuário:', user);
    setEditingUser(user); // Define o usuário para edição
  };

  const handleCloseEditDialog = () => {
    console.log('Fechando diálogo de edição');
    setEditingUser(null); // Reseta o estado de edição
  };

  const handleUpdateUser = () => {
    console.log('Atualizando usuário:', editingUser);
    axios
      .put(`${API_URL}/${editingUser.id}`, editingUser)
      .then(() => {
        fetchUsers(); // Atualiza a lista de usuários
        handleCloseEditDialog(); // Fecha o diálogo de edição
      })
      .catch((error) => {
        console.error('Erro ao atualizar o usuário:', error);
      });
  };

  const handleOpenDeleteDialog = (user) => {
    console.log('Abrindo diálogo de exclusão para o usuário:', user);
    setDialogOpen(true); // Abre o diálogo de exclusão
    setEditingUser(user); // Define o usuário para exclusão
  };

  const handleCloseDeleteDialog = () => {
    console.log('Fechando diálogo de exclusão');
    setDialogOpen(false); // Fecha o diálogo de exclusão
    setEditingUser(null); // Reseta o estado de exclusão
  };

  const handleDeleteUser = () => {
    console.log('Excluindo usuário:', editingUser);
    axios
      .delete(`${API_URL}/${editingUser.id}`)
      .then(() => {
        fetchUsers(); // Atualiza a lista de usuários
        handleCloseDeleteDialog(); // Fecha o diálogo de exclusão
      })
      .catch((error) => {
        console.error('Erro ao excluir o usuário:', error);
      });
  };

  return (
    <Container maxWidth="md" style={{ backgroundColor: '#d1e7dd', padding: '20px' }}>
      <Grid container direction="column" spacing={2} alignItems="center" style={{ backgroundColor: '#cff4fc', padding: '10px' }}>
        {users.map((user) => (
          <Grid
            item
            key={user.id}
            style={{
              backgroundColor: '#fefefe',
              padding: '10px',
              border: '1px solid #dee2e6',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Card
              style={{
                width: '300px',
                height: '300px',
                backgroundColor: '#f8f9fa',
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                position="absolute"
                top="10px"
                right="10px"
                style={{ backgroundColor: '#f1f3f5', borderRadius: '5px' }}
              >
                <IconButton edge="end" aria-label="editar" onClick={() => handleOpenEditDialog(user)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="deletar" onClick={() => handleOpenDeleteDialog(user)}>
                  <Delete />
                </IconButton>
              </Box>
              <CardContent
                style={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  padding: '10px',
                }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start" // Alinha os itens à esquerda
                  style={{
                    backgroundColor: '#e2e3e5',
                    borderRadius: '5px',
                    padding: '10px',
                    textAlign: 'left', // Alinha o texto à esquerda
                    width: '100%',
                  }}
                >
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography color="textSecondary">{user.email}</Typography>
                  <Typography color="textSecondary">Idade: {user.age}</Typography>
                  <Typography color="textSecondary">Endereço: {user.address}</Typography>
                </Box>
              </CardContent>
            </Card>

          </Grid>
        ))}
      </Grid>

      {/* Janela de Exclusão */}
      <Dialog open={dialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir o usuário "{editingUser?.name}"?</Typography>
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

      {/* Janela de Edição */}
      <Dialog open={Boolean(editingUser)} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={editingUser?.name || ''}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={editingUser?.email || ''}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
          />
          <TextField
            label="Idade"
            fullWidth
            margin="normal"
            value={editingUser?.age || ''}
            onChange={(e) => setEditingUser({ ...editingUser, age: e.target.value })}
          />
          <TextField
            label="Endereço"
            fullWidth
            margin="normal"
            value={editingUser?.address || ''}
            onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
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
