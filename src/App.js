import './App.css';
import Pessoas from './components/Pessoas';
import Sobre from './components/Sobre';
import Login from './components/Login';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Link, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar expand="lg" className="bg-dark navbar-dark">
          <Container>
            <Navbar.Brand as={Link} to="/">Gerenciamento de Pessoas</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route path='/' element={<Pessoas />} />
          <Route path='/login' element={<Login />} />
          <Route path='/sobre' element={<Sobre />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
