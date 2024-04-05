import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { format, addDays  } from 'date-fns'; // Importando a função format do date-fns

function Home() {
    const [searchTerm, setSearchTerm] = useState(''); // State para armazenar o termo de busca
    const [currentPage, setCurrentPage] = useState(1); // State para armazenar a página atual
    const [userData, setUserData] = useState([]); // State para armazenar os dados dos usuários
    const recordsPerPage = 10; // Número de registros por página

    useEffect(() => {
        // Função assíncrona para buscar os dados da API local ao montar o componente
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost:3003/pessoas/');
                setUserData(response.data); // Atualiza o state com os dados da API
            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
            }
        }

        fetchData(); // Chamando a função para buscar os dados da API local
    }, []); // Usando um array vazio como segundo argumento para que a chamada ocorra apenas uma vez, ao montar o componente

    // Função para filtrar os dados com base no termo de busca
    const filteredData = userData.filter(user => {
        return user.id.toString().includes(searchTerm) ||
               user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.sexo.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Calcula o índice do último registro na página atual
    const lastIndex = currentPage * recordsPerPage;
    // Calcula o índice do primeiro registro na página atual
    const firstIndex = lastIndex - recordsPerPage;
    // Seleciona os registros da página atual com base nos índices
    const records = filteredData.slice(firstIndex, lastIndex);
    // Calcula o número total de páginas
    const npage = Math.ceil(filteredData.length / recordsPerPage);
    // Gera uma lista de números de páginas
    const numbers = [...Array(npage + 1).keys()].slice(1);

    // Função para ir para a página anterior
    function prePage() {
        if(currentPage !== 1){
            setCurrentPage(currentPage - 1)
        }
    }
    
    // Função para mudar para uma página específica
    function changeCpage(id) {
        setCurrentPage(id);
    }
    
    // Função para ir para a próxima página
    function nextPage() {
        if(currentPage !== npage){
            setCurrentPage(currentPage + 1)
        }
    }

    // Função para formatar a data para o formato brasileiro
    const formatarDataBrasileira = (data) => {
        const dataFormatada = addDays(new Date(data), 1); // Adiciona um dia para corrigir o fuso horário
        return format(dataFormatada, 'dd/MM/yyyy');
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    {/* Campo de busca */}
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="table-responsive">
                        {/* Tabela para exibir os registros */}
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Sexo</th>
                                    <th>Data de Nascimento</th>
                                    <th>Estado Civil</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((d, i) => (
                                    <tr key={i}>
                                        <td>{d.id}</td>
                                        <td>{d.nome}</td>
                                        <td>{d.sexo}</td>
                                        <td>{formatarDataBrasileira(d.data_nascimento)}</td> {/* Formata a data para o formato brasileiro */}
                                        <td>{d.estado_civil}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer">
                    {/* Paginação */}
                    <nav>
                        <ul className='pagination'>
                            <li className='page-item'>
                                <a href="#" className='page-link' onClick={prePage}>Prev</a>
                            </li>
                            {
                                numbers.map((n, i) => (
                                    <li className={`page-item ${currentPage === n ? 'active':''}`} key={i}>
                                        <a href="#" className='page-link' onClick={() => changeCpage(n)}>{n}</a>
                                    </li>
                                ))
                            }
                            <li className='page-item'>
                                <a href="#" className='page-link' onClick={nextPage}>Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default Home;
