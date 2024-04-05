import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Importando Axios

function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [userData, setUserData] = useState([]); // State para armazenar os dados dos usuários
    const recordsPerPage = 10;

    useEffect(() => {
        // Função assíncrona para buscar os dados da API local
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost:3000/users');
                setUserData(response.data);
            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
            }
        }

        fetchData(); // Chamando a função para buscar os dados da API local
    }, []); // Usando um array vazio como segundo argumento para que a chamada ocorra apenas uma vez, ao montar o componente

    const filteredData = userData.filter(user => {
        return user.id.toString().includes(searchTerm) ||
               user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = filteredData.slice(firstIndex, lastIndex);
    const npage = Math.ceil(filteredData.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);

    function prePage() {
        if(currentPage !== 1){
            setCurrentPage(currentPage - 1)
        }
    }
    
    function changeCpage(id) {
        setCurrentPage(id);
    }
    
    function nextPage() {
        if(currentPage !== npage){
            setCurrentPage(currentPage + 1)
        }
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((d, i) => (
                                    <tr key={i}>
                                        <td>{d.id}</td>
                                        <td>{d.name}</td>
                                        <td>{d.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer">
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
