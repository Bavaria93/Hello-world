import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const addUser = () => {
    axios.post('http://localhost:5000/users', { name, email, age, address })
      .then(response => {
        setUsers([...users, response.data]);
        setName('');
        setEmail('');
        setAge('');
        setAddress('');
      })
      .catch(error => console.error('Error adding user:', error));
  };

  const updateUser = (id) => {
    axios.put(`http://localhost:5000/users/${id}`, { name, email, age, address })
      .then(response => {
        setUsers(users.map(user => (user.id === id ? response.data : user)));
        setEditingUser(null);
        setName('');
        setEmail('');
        setAge('');
        setAddress('');
      })
      .catch(error => console.error('Error updating user:', error));
  };

  const deleteUser = (id) => {
    axios.delete(`http://localhost:5000/users/${id}`)
      .then(response => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id);
    } else {
      addUser();
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setAge(user.age);
    setAddress(user.address);
  };

  return (
    <div className="App">
      <h1>CRUD de Usuários</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Idade"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Endereço"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <button type="submit">{editingUser ? 'Atualizar' : 'Adicionar'}</button>
      </form>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email}), Idade: {user.age}, Endereço: {user.address}
            <button onClick={() => handleEdit(user)}>Editar</button>
            <button onClick={() => deleteUser(user.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
