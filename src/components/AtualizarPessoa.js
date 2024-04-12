import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Mensagem from './Mensagem';

const AtualizarPessoa = () => {
    const { id } = useParams();
    const [pessoa, setPessoa] = useState(null);
    const [enderecos, setEnderecos] = useState([]);
    const [formData, setFormData] = useState({
        nome: '',
        sexo: '',
        data_nascimento: '',
        estado_civil: '',
    });
    const [mensagens, setMensagens] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3003/pessoas/${id}`)
            .then(response => response.json())
            .then(data => setPessoa(data))
            .catch(error => console.error('Erro ao buscar pessoa:', error));

        fetch(`http://localhost:3003/enderecos/${id}`)
            .then(response => response.json())
            .then(data => setEnderecos(data))
            .catch(error => console.error('Erro ao buscar endereços:', error));
    }, [id]);


    useEffect(() => {
        if (pessoa) {
            setFormData({
                nome: pessoa.nome,
                sexo: pessoa.sexo,
                data_nascimento: pessoa.data_nascimento,
                estado_civil: pessoa.estado_civil,
            });
        }
    }, [pessoa]);

    const inputChangePessoa = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const inputChangeEndereco = async (e, index) => {
        const { name, value } = e.target;
        const updatedEnderecos = [...enderecos];
        const cleanValue = value.replace('-', '');
        updatedEnderecos[index][name.split("-")[0]] = value;

        let cep = 'cep-' + index;

        console.log(cep);
        if (name === cep && cleanValue.length === 8) {
            const addressDetails = await fetchAddressDetails(value);
            if (addressDetails) {
                updatedEnderecos[index] = {
                    ...updatedEnderecos[index],
                    endereco: addressDetails.logradouro || '',
                    bairro: addressDetails.bairro || '',
                    cidade: addressDetails.localidade || '',
                    estado: addressDetails.uf || '',
                    complemento: addressDetails.complemento || '',
                };
            }
        }
        setEnderecos(updatedEnderecos);
    };

    const fetchAddressDetails = async (cep) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) {
                throw new Error('Erro ao buscar endereço');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            return null;
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Atualizar a pessoa no banco de dados
            const pessoaResponse = await fetch(`http://localhost:3003/pessoas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!pessoaResponse.ok) {
                throw new Error('Erro ao atualizar pessoa');
            }

            // Atualizar os endereços relacionados à pessoa no banco de dados
            await Promise.all(enderecos.map(async (endereco) => {
                if (endereco.id) {
                    // Se o endereço já possui um ID, é um endereço existente, então atualize-o
                    await fetch(`http://localhost:3003/enderecos/${endereco.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ ...endereco, pessoa_id: id })
                    });
                } else {
                    // Se o endereço não possui um ID, é um novo endereço, então crie-o
                    await fetch(`http://localhost:3003/enderecos`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ ...endereco, pessoa_id: id })
                    });
                }
            }));

            setMensagens([{ sucesso: true, texto: 'Pessoa atualizada com sucesso!' }]);
        } catch (error) {
            console.error('Erro ao atualizar pessoa:', error);
            setMensagens([{ sucesso: false, texto: 'Erro ao atualizar pessoa.' }]);
        }
    };



    const handleAddEndereco = () => {
        setEnderecos([...enderecos, { endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '' }]);
    };

    const handleRemoveEndereco = async (enderecoId, index) => {
        try {
            const newEnderecos = [...enderecos];
            newEnderecos.splice(index, 1);
            setEnderecos(newEnderecos);

            await fetch(`http://localhost:3003/enderecos/${enderecoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            const updatedEnderecos = [...enderecos];
            updatedEnderecos.splice(index, 1);
            setEnderecos(updatedEnderecos);
            setMensagens([{ sucesso: true, texto: 'Endereço removido com sucesso!' }]);
        } catch (error) {
            console.error('Erro ao remover endereço:', error);
            setMensagens([{ sucesso: false, texto: 'Erro ao remover endereço.' }]);
        }
    };

    return (
        <Container>
            {pessoa && (
                <div className='py-5'>
                    <div className="d-flex align-items-center justify-content-between">
                        <h2>Atualizar Pessoa</h2>
                        <Button variant="primary" className='mb-4' onClick={handleAddEndereco}>Adicionar Endereço</Button>
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col>
                                <Form.Group controlId="formNome" className="mb-4">
                                    <Form.Label>Nome:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={inputChangePessoa}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formSexo" className="mb-4">
                                    <Form.Label>Sexo:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="sexo"
                                        value={formData.sexo}
                                        onChange={inputChangePessoa}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="formDataNascimento" className="mb-4">
                                    <Form.Label>Data de Nascimento:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="data_nascimento"
                                        value={formData.data_nascimento}
                                        onChange={inputChangePessoa}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formEstadoCivil" className="mb-4">
                                    <Form.Label>Estado Civil:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="estado_civil"
                                        value={formData.estado_civil}
                                        onChange={inputChangePessoa}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {enderecos && (
                            <>
                                {enderecos.map((endereco, index) => (
                                    <div key={index} className="mb-4">
                                        <h4>Endereço {index + 1}</h4>
                                        <Row>
                                            <Col>
                                                <Form.Group controlId={`formEndereco-${index}`} className="mb-4">
                                                    <Form.Label>CEP:</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        name={`cep-${index}`}
                                                        value={endereco.cep}
                                                        onChange={(e) => inputChangeEndereco(e, index)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group controlId={`formEndereco-${index}`} className="mb-4">
                                                    <Form.Label>Endereço:</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name={`endereco-${index}`}
                                                        value={endereco.endereco}
                                                        onChange={(e) => inputChangeEndereco(e, index)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form.Group controlId={`formEndereco-${index}`} className="mb-4">
                                                    <Form.Label>Complemento:</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name={`complemento-${index}`}
                                                        value={endereco.complemento}
                                                        onChange={(e) => inputChangeEndereco(e, index)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group controlId={`formEndereco-${index}`} className="mb-4">
                                                    <Form.Label>Bairro:</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name={`bairro-${index}`}
                                                        value={endereco.bairro}
                                                        onChange={(e) => inputChangeEndereco(e, index)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form.Group controlId={`formNumero-${index}`} className="mb-4">
                                                    <Form.Label>Número:</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name={`numero-${index}`}
                                                        value={endereco.numero}
                                                        onChange={(e) => inputChangeEndereco(e, index)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group controlId={`formNumero-${index}`} className="mb-4">
                                                    <Form.Label>Cidade:</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name={`cidade-${index}`}
                                                        value={endereco.cidade}
                                                        onChange={(e) => inputChangeEndereco(e, index)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group controlId={`formNumero-${index}`} className="mb-4">
                                                    <Form.Label>Estado:</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name={`estado-${index}`}
                                                        value={endereco.estado}
                                                        onChange={(e) => inputChangeEndereco(e, index)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Button variant="danger" onClick={() => handleRemoveEndereco(endereco.id, index)}>Remover Endereço</Button>
                                    </div>
                                ))}
                            </>
                        )}
                        <Button variant="primary" type="submit">
                            Atualizar
                        </Button>
                        {mensagens.map((mensagem, index) => (
                            <Mensagem key={index} sucesso={mensagem.sucesso} mensagem={mensagem.texto} />
                        ))}
                    </Form>
                </div>
            )}
        </Container>
    );
};

export default AtualizarPessoa;
