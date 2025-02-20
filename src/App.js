import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #282c34;
`;

const Title = styled.h1`
  font-size: 4rem;
  color: #61dafb;
  text-shadow: 2px 2px #000;
  font-family: 'Arial', sans-serif;
`;

function App() {
  return (
    <Container>
      <Title>Hello world</Title>
    </Container>
  );
}

export default App;
