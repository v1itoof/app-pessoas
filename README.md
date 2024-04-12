# Aplicativo de Gerenciamento de Pessoas

O aplicativo de Gerenciamento de Pessoas é uma aplicação web desenvolvida em React.js para gerenciamento de informações sobre pessoas. Ele permite a visualização, inserção, atualização e exclusão de registros de pessoas e seus endereços, além de fornecer funcionalidades de autenticação de usuários.

## Funcionalidades

- **Autenticação de Usuários**: Permite que usuários façam login e acessem as funcionalidades do aplicativo.
- **Gerenciamento de Pessoas**: Visualização, inserção, atualização e exclusão de registros de pessoas.
- **Adição de Endereço**: Adicione um novo endereço à lista de endereços de uma pessoa, fornecendo informações como endereço, número, complemento, bairro, cidade, estado e CEP.
- **Atualização de Endereço**: Atualize as informações de um endereço existente, incluindo endereço, número, complemento, bairro, cidade, estado e CEP.
- **Remoção de Endereço**: Remova um endereço da lista de endereços de uma pessoa, excluindo permanentemente suas informações.
- **Paginação e Busca**: Paginação da lista de pessoas e busca por pessoas através de termos de pesquisa.
- **Feedback ao Usuário**: Exibição de mensagens de sucesso ou erro após operações de CRUD.

## Componentes Utilizados

- **React.js**: Biblioteca JavaScript para a construção de interfaces de usuário.
- **react-bootstrap**: Implementação de componentes do Bootstrap para React.
- **react-router-dom**: Pacote para roteamento de páginas em aplicações React.
- **Mensagem**: Componente personalizado para exibição de mensagens de sucesso ou erro.
- **Button, Form, Modal, Table, Container**: Componentes do React Bootstrap utilizados na interface.

## Funcionamento

- O aplicativo se conecta a uma API backend através de requisições HTTP para realizar operações CRUD sobre os registros de pessoas.
- Os usuários precisam autenticar-se para acessar as funcionalidades do aplicativo.
- As funcionalidades de gerenciamento de pessoas são acessadas através de rotas da aplicação.
- As operações de inserção, atualização e exclusão de registros são realizadas em modais, fornecendo feedback ao usuário sobre o resultado da operação.
- A busca automática de informações de endereço por CEP é realizada assincronamente, fornecendo feedback instantâneo ao usuário.

## Utilização

1. Certifique-se de que todos os pacotes necessários estão instalados no ambiente de desenvolvimento. Você pode instalar as dependências executando o comando `npm install` no diretório do projeto.

2. Configure corretamente as variáveis de ambiente para conectar o aplicativo à API backend.

3. Execute o aplicativo React utilizando o comando `npm start` e acesse-o em um navegador para interagir com as funcionalidades de gerenciamento de pessoas.
