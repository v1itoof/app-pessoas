import React, { Component } from 'react';
import Mensagem from './Mensagem';
import { Button, Form, Modal, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      novonome: '',
      novoemail: '',
      novasenha: '',
      error: null,
      successMessage: ''
    };

    this.autenticacao = this.autenticacao.bind(this);
    this.cadastro = this.cadastro.bind(this);
    this.abrirModalInserir = this.abrirModalInserir.bind(this);
    this.fecharModal = this.fecharModal.bind(this);
  }

  autenticacao() {
    const pessoa = {
      email: this.state.email,
      password: this.state.password
    };

    fetch('http://localhost:3003/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pessoa)
    }).then((resposta) => {
      if (resposta.ok) {
        resposta.json().then(data => {
            // Armazenar o token na sessão
            sessionStorage.setItem('token', data.token);
            // Limpar o formulário
            this.setState({ email: '', password: '', error: null, successMessage: 'Login bem-sucedido!' });
        });
      } else {
        this.setState({ email: '', password: '', error: null});
        resposta.json().then(data => {
            if (data.errors && data.errors.length > 0) {
                const errorMessage = data.errors.join(', ');
                this.setState({ error: errorMessage, successMessage: '' });
            } else {
                this.setState({ error: 'Erro ao fazer login. Por favor, verifique suas credenciais.', successMessage: '' });
            }
        }).catch(error => {
            console.error('Erro ao processar a resposta:', error);
            this.setState({ error: 'Erro ao fazer login. Por favor, tente novamente mais tarde.', successMessage: '' });
        });
      }
    }).catch(error => {
        this.setState({ email: '', password: '', error: null});
      console.error('Erro ao fazer login:', error);
      this.setState({ error: 'Erro ao fazer login. Por favor, tente novamente mais tarde.', successMessage: '' });
    });
  }

  cadastro() {
    const pessoa = {
      nome: this.state.novonome,
      email: this.state.novoemail,
      password: this.state.novasenha
    };

    fetch('http://localhost:3003/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pessoa)
    }).then((resposta) => {
      if (resposta.ok) {
        resposta.json().then(data => {
            // Limpar o formulário
            this.setState({ novonome: '', novasenha: '', novoemail: '', error: null, successMessage: 'Cadastro bem-sucedido!' });
        });
      } else {
        this.setState({ novonome: '', novasenha: '', novoemail: '', error: null});
        resposta.json().then(data => {
            if (data.errors && data.errors.length > 0) {
                const errorMessage = data.errors.join(', ');
                this.setState({ error: errorMessage, successMessage: '' });
            } else {
                this.setState({ error: 'Erro ao fazer cadastro. Por favor, verifique suas credenciais.', successMessage: '' });
            }
        }).catch(error => {
            console.error('Erro ao processar a resposta:', error);
            this.setState({ error: 'Erro ao fazer cadastro. Por favor, tente novamente mais tarde.', successMessage: '' });
        });
      }
    }).catch(error => {
        this.setState({ novonome: '', novasenha: '', novoemail: '', error: null});
      console.error('Erro ao fazer cadastro:', error);
      this.setState({ error: 'Erro ao fazer cadastro. Por favor, tente novamente mais tarde.', successMessage: '' });
    });
  }

  atualizapassword = (e) => {
    this.setState({
        password: e.target.value
    });
  }

  atualizaEmail = (e) => {
    this.setState({
      email: e.target.value
    });
  }
  
  atualizaSenhaNova = (e) => {
    this.setState({
        novasenha: e.target.value
    });
  }
  
  atualizaEmailNovo = (e) => {
    this.setState({
        novoemail: e.target.value
    });
  }
  
  atualizaNomeNovo = (e) => {
    this.setState({
        novonome: e.target.value
    });
  }

  autenticacaoForm = (e) => {
    e.preventDefault();
    this.autenticacao();
  }

  abrirModalInserir() {
    this.setState({
      modalAberta: true
    })
  }

  fecharModal() {
    this.setState({
      id: 0,
      nome: "",
      sexo: "",
      data_nascimento: "",
      estado_civil: "",
      modalAberta: false
    })
  }

  novoUsuario = (e) => {
    e.preventDefault();
    this.cadastro();
  }


  renderModal() {
    return (
      <Modal show={this.state.modalAberta} onHide={this.fecharModal}>
        <Modal.Header closeButton>
          <Modal.Title>Novo Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="modalForm" onSubmit={this.novoUsuario}>
            <Form.Group className='mb-3'>
              <Form.Label>Nome:</Form.Label>
              <Form.Control type='text' placeholder='Nome do usuário...' value={this.state.novonome} onChange={this.atualizaNomeNovo} />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Email:</Form.Label>
              <Form.Control type='email' placeholder='Email do usuário...' value={this.state.novoemail} onChange={this.atualizaEmailNovo} />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Senha:</Form.Label>
              <Form.Control type='password' value={this.state.novasenha} onChange={this.atualizaSenhaNova} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.fecharModal}>
            Cancelar
          </Button>
          <Button variant="primary" form="modalForm" type="submit">
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    return (
        <Container>
            <div className='py-5'>
                <div className="d-flex justify-content-center align-items-center">
                    <h1>Autenticação</h1>
                </div>
                {this.state.error && (
                    // Exibir o componente Mensagem para exibir a mensagem de erro
                    <Mensagem sucesso={false} mensagem={this.state.error} onClose={() => this.setState({ error: null })} />
                )}
                {this.state.successMessage && (
                    // Exibir o componente Mensagem para exibir a mensagem de sucesso
                    <Mensagem sucesso={true} mensagem={this.state.successMessage} onClose={() => this.setState({ successMessage: '' })} />
                )}
                <Form onSubmit={this.autenticacaoForm}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control type='email' value={this.state.email} onChange={this.atualizaEmail} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Senha:</Form.Label>
                        <Form.Control type='password' value={this.state.password} onChange={this.atualizapassword} />
                    </Form.Group>
                    <div className="d-flex justify-content-between align-items-center">
                        <Button variant="primary" type='submit'>Entrar</Button>
                        <Button variant="secondary" className="button-novo" onClick={this.abrirModalInserir}>Cadastrar-se</Button>
                    </div>
                </Form>
            </div>
            {this.renderModal()}
        </Container>
    );
  }
}

export default Login;
