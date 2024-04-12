import React, { Component } from 'react';
import Mensagem from './Mensagem';
import { Button, Form, Modal, Table, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export class Pessoas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 0,
      nome: '',
      sexo: '',
      estado_civil: '',
      data_nascimento: '',
      pessoas: [],
      modalAberta: false,
      searchTerm: '',
      currentPage: 1,
      recordsPerPage: 5,
      error: null,
      successMessage: null,
      loggedIn: false 
    };

    this.buscarPessoas = this.buscarPessoas.bind(this);
    this.buscarPessoa = this.buscarPessoa.bind(this);
    this.inserirPessoa = this.inserirPessoa.bind(this);
    this.atualizarPessoa = this.atualizarPessoa.bind(this);
    this.excluirPessoa = this.excluirPessoa.bind(this);
    this.renderTabela = this.renderTabela.bind(this);
    this.abrirModalInserir = this.abrirModalInserir.bind(this);
    this.fecharModal = this.fecharModal.bind(this);
    this.atualizaNome = this.atualizaNome.bind(this);
    this.atualizaData = this.atualizaData.bind(this);
    this.atualizaSexo = this.atualizaSexo.bind(this);
    this.atualizaEstadoCivil = this.atualizaEstadoCivil.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  componentDidMount() {
    this.buscarPessoas();

    const token = sessionStorage.getItem('token');
    if (token) {
      this.setState({ loggedIn: true });
    }
  }

  // GET (todos pessoas)
  buscarPessoas() {
    fetch('http://localhost:3003/pessoas')
      .then(response => response.json())
      .then(data => this.setState({ pessoas: data }));
  }
  
  //GET (pessoa com determinado id)
  buscarPessoa(id) {
    fetch('http://localhost:3003/pessoas/' + id)
      .then(response => response.json())
      .then(data => this.setState(
        {
          id: data.id,
          nome: data.nome,
          sexo: data.sexo,
          data_nascimento: data.data_nascimento,
          estado_civil: data.estado_civil,
        }));
  }

  inserirPessoa(pessoa) {
    fetch('http://localhost:3003/pessoas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    },
      body: JSON.stringify(pessoa)
    }).then((resposta) => {
      if (resposta.ok) {
        resposta.json().then(data => {
            this.setState({ successMessage: 'Cadastro bem-sucedido!' });
            this.buscarPessoas();
            this.fecharModal();
        });
    } else {
        this.fecharModal();
        this.setState({ successMessage: null });
        resposta.json().then(data => {
            if (data.errors && data.errors.length > 0) {
                // Concatena todas as mensagens de erro em uma única string
                const errorMessage = data.errors.join(', ');
                this.setState({ error: errorMessage });
            } else {
                // Se não houver mensagens de erro específicas, exibe a mensagem de erro padrão
                this.setState({ error: 'Ocorreu um erro ao inserir a pessoa.' });
            }
        }).catch(error => {
            console.error('Erro ao processar a resposta:', error);
            this.setState({ error: 'Ocorreu um erro ao processar a resposta. Por favor, tente novamente mais tarde.' });
        });
    }
    }).catch(error => {
        this.fecharModal();
        console.error('Erro ao inserir pessoa:', error);
        this.setState({ error: 'Ocorreu um erro ao inserir a pessoa. Por favor, tente novamente mais tarde.' });
    });
  }
  
  atualizarPessoa(pessoa) {
    fetch('http://localhost:3003/pessoas/' + pessoa.id, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    },
      body: JSON.stringify(pessoa)
    }).then((resposta) => {
      if (resposta.ok) {
        this.setState({ successMessage: 'Pessoa atualizada com sucesso!' });
        this.buscarPessoas();
        this.fecharModal();
        this.setState({ error: null });
      } else {
        resposta.json().then(data => {
            if (data.errors && data.errors.length > 0) {
                const errorMessage = data.errors.join(', ');
                this.setState({ error: errorMessage });
            } else {
                this.setState({ error: 'Ocorreu um erro ao atualizar a pessoa.' });
            }
        }).catch(error => {
            console.error('Erro ao processar a resposta:', error);
            this.setState({ error: 'Ocorreu um erro ao processar a resposta. Por favor, tente novamente mais tarde.' });
        });
      }
    }).catch(error => {
        console.error('Erro ao atualizar pessoa:', error);
        this.setState({ error: 'Ocorreu um erro ao atualizar a pessoa. Por favor, tente novamente mais tarde.' });
    });
  }

  excluirPessoa(id) {
    fetch('http://localhost:3003/pessoas/' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    }
    }).then((resposta) => {
      if (resposta.ok) {
        this.setState({ successMessage: 'Pessoa excluida com sucesso!' });
        this.buscarPessoas();
        this.fecharModal();
      } else {
        resposta.json().then(data => {
            this.setState({ successMessage: null });
            if (data.errors && data.errors.length > 0) {
                const errorMessage = data.errors.join(', ');
                this.setState({ error: errorMessage });
            } else {
                this.setState({ error: 'Ocorreu um erro ao excluir a pessoa.' });
            }
        }).catch(error => {
            console.error('Erro ao processar a resposta:', error);
            this.setState({ error: 'Ocorreu um erro ao processar a resposta. Por favor, tente novamente mais tarde.' });
        });
      }
    }).catch(error => {
        console.error('Erro ao excluir pessoa:', error);
        this.setState({ error: 'Ocorreu um erro ao excluir a pessoa. Por favor, tente novamente mais tarde.' });
    });
  }

  atualizaNome(e) {
    this.setState({
      nome: e.target.value
    });
  }

  atualizaData(e) {
    this.setState({
      data_nascimento: e.target.value
    });
  }

  atualizaSexo(e) {
    this.setState({
      sexo: e.target.value
    });
  }

  atualizaEstadoCivil(e) {
    this.setState({
      estado_civil: e.target.value
    });
  }

  abrirModalInserir() {
    if (!this.state.loggedIn) {
        this.setState({ error: "Você precisa estar logado para adicionar uma pessoa." });
        return;
    }
    this.setState({
      modalAberta: true
    })
  }

  abrirModalAtualizar(id) {
    this.setState({
      id: id,
      modalAberta: true
    });

    this.buscarPessoa(id);
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

  submit = (event) => {
    event.preventDefault();
    const pessoa = {
      id: this.state.id,
      nome: this.state.nome,
      sexo: this.state.sexo,
      estado_civil: this.state.estado_civil,
      data_nascimento: this.state.data_nascimento
    };

    if (this.state.id === 0) {
      this.inserirPessoa(pessoa);
    } else {
      this.atualizarPessoa(pessoa);
    }
  }

  handleSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handlePageChange(pageNumber) {
    this.setState({ currentPage: pageNumber });
  }

  prevPage() {
    const { currentPage } = this.state;
    if (currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });
    }
  }

  nextPage() {
    const { currentPage, pessoas, recordsPerPage } = this.state;
    if (currentPage < Math.ceil(pessoas.length / recordsPerPage)) {
      this.setState({ currentPage: currentPage + 1 });
    }
  }

  renderModal() {
    return (
      <Modal show={this.state.modalAberta} onHide={this.fecharModal}>
        <Modal.Header closeButton>
          <Modal.Title>Preencha os dados da pessoa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form id="modalForm" onSubmit={(event) => this.submit(event)}>
            <Form.Group className='mb-3'>
              <Form.Label>Nome:</Form.Label>
              <Form.Control type='text' placeholder='Nome da pessoa' value={this.state.nome} onChange={this.atualizaNome} />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Data de nascimento:</Form.Label>
              <Form.Control type='date' value={this.state.data_nascimento} onChange={this.atualizaData} />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Sexo:</Form.Label>
              <Form.Control as="select" value={this.state.sexo} onChange={this.atualizaSexo}>
                <option value="">Selecione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Estado Civil:</Form.Label>
              <Form.Control as="select" value={this.state.estado_civil} onChange={this.atualizaEstadoCivil}>
                <option value="">Selecione...</option>
                <option value="Solteiro(a)">Solteiro(a)</option>
                <option value="Casado(a)">Casado(a)</option>
                <option value="Divorciado(a)">Divorciado(a)</option>
                <option value="Viúvo(a)">Viúvo(a)</option>
              </Form.Control>
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

  renderTabela() {
    const { searchTerm, currentPage, pessoas, recordsPerPage } = this.state;

    // Filtragem dos dados com base no termo de busca
    const filteredData = pessoas.filter(user => {
      return (
        user.id.toString().includes(searchTerm) ||
        user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.estado_civil.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.sexo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    // Cálculo dos índices de início e fim dos registros da página atual
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    
    // Seleção dos registros da página atual
    const records = filteredData.slice(firstIndex, lastIndex);

    // Cálculo do número total de páginas
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    // Array de números de página
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={this.handleSearchChange}
        />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Sexo</th>
              <th>Data de Nascimento</th>
              <th>Estado Civil</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {records.map((pessoa) => (
              <tr key={pessoa.id}>
                <td>{pessoa.id}</td>
                <td>{pessoa.nome}</td>
                <td>{pessoa.sexo}</td>
                <td>{pessoa.data_nascimento}</td>
                <td>{pessoa.estado_civil}</td>
                <td>
                  <div>
                    <Button variant="link" onClick={() => this.abrirModalAtualizar(pessoa.id)}>Atualizar</Button>
                    <Button variant="link" onClick={() => this.excluirPessoa(pessoa.id)}>Excluir</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <nav>
          <ul className='pagination'>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <a href="#" className='page-link' onClick={this.prevPage}>Anterior</a>
            </li>
            {pageNumbers.map(number => (
              <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                <a href="#" className='page-link' onClick={() => this.handlePageChange(number)}>{number}</a>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <a href="#" className='page-link' onClick={this.nextPage}>Próximo</a>
            </li>
          </ul>
        </nav>
      </>
    );
  }

  removerErro() {
    this.setState({ error: null });
  }

  render() {
    return (
        <Container>
            <div className='py-5'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Lista Pessoas</h1>
                    <Button variant="primary" className="button-novo" onClick={this.abrirModalInserir}>Adicionar pessoa</Button>
                </div>
                {this.state.successMessage && (
                  <Mensagem sucesso={true} mensagem={this.state.successMessage} onClose={() => this.setState({ successMessage: null })} />
                )}
                {this.state.error && (
                  <Mensagem sucesso={false} mensagem={this.state.error} onClose={() => this.removerErro()} />
                )}
                {this.renderTabela()}
                {this.renderModal()}
            </div>
        </Container>
    );
  }
}

export default Pessoas;
