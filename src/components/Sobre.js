import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Sobre() {
  // Definir o estado para armazenar os dados da API
  const [pessoas, setPessoas] = useState([]);

  useEffect(() => {
    // Função assíncrona para buscar os dados da API local
    async function fetchData() {
      try {
        // Fazer a solicitação à API local
        const response = await axios.get('http://localhost:3003/pessoas/');
        // Definir os dados recebidos no estado 'pessoas'
        setPessoas(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    }

    fetchData(); // Chamar a função para buscar os dados da API local
  }, []); // Usar um array vazio como segundo argumento para que a chamada ocorra apenas uma vez, ao montar o componente

  return (
    <div>
      <h1>Pessoas</h1>
      <ul>
        {/* Mapear os dados das pessoas e exibi-los em uma lista */}
        {pessoas.map((pessoa, index) => (
          <li key={index}>{pessoa.nome}</li>
        ))}
      </ul>
    </div>
  );
}

export default Sobre;
