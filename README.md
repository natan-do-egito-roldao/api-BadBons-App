Aqui está o arquivo `README.md` atualizado com as modificações feitas no backend até agora:

```markdown
# Badminton App - Backend

Este repositório contém o backend de uma aplicação para gestão e controle de atletas de badminton. O sistema foi desenvolvido utilizando Node.js, Express e MongoDB com o Mongoose para interação com o banco de dados.

## Funcionalidades

- **Cadastro de Atletas**: A aplicação permite o cadastro de atletas com dados como nome, idade, email, telefone, sexo, nível e filial.
- **CRUD de Atletas**: O sistema permite a criação, leitura, atualização e exclusão (CRUD) de atletas.
- **Validação de Dados**: Utiliza o Mongoose para garantir que os dados dos atletas sejam válidos, como verificar o tipo de dado, o formato do email, e a enumeração do nível.
- **Paginação e Filtros**: Implementação de paginação e filtros para consultas de atletas, permitindo a busca de atletas por critérios específicos e com controle de quantidade de dados retornados por página.
- **Autenticação e Autorização**: Sistema de autenticação via JWT (JSON Web Tokens), permitindo controle de acesso para admins e usuários comuns.
- **Criptografia de Senha**: As senhas dos atletas são criptografadas utilizando a biblioteca `bcrypt` antes de serem armazenadas no banco de dados.
- **Conexão com MongoDB Atlas**: A aplicação está conectada ao MongoDB Atlas, oferecendo uma solução de banco de dados escalável e segura na nuvem.
- **Tratamento de Erros**: A aplicação possui tratamento de erros adequado, respondendo com mensagens claras para facilitar a depuração.
- **API RESTful**: A API segue o padrão RESTful para interação com o frontend, oferecendo endpoints para todas as operações de CRUD.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript do lado do servidor.
- **Express**: Framework minimalista para construção da API RESTful.
- **MongoDB Atlas**: Banco de dados NoSQL escalável para armazenamento dos dados dos atletas.
- **Mongoose**: Biblioteca de modelagem de objetos MongoDB para Node.js, utilizada para definir os esquemas de dados e facilitar a interação com o banco de dados.
- **JWT (JSON Web Tokens)**: Para autenticação e controle de acesso dos usuários.
- **bcrypt**: Biblioteca para criptografia de senhas.

## Como Rodar a Aplicação

1. Clone o repositório:
   ```bash
   git clone https://github.com/eusuez/ofc-BadBons-app.git
   ```
   
2. Instale as dependências:
   ```bash
   npm install
   ```
   
3. Configure suas variáveis de ambiente no arquivo `.env` com a URL do MongoDB Atlas e a chave secreta do JWT:
   ```bash
   MONGODB_URI=your_mongodb_connection_url
   JWT_SECRET=your_jwt_secret_key
   ```

4. Para rodar a aplicação:
   - Para desenvolvimento (com `nodemon`):
     ```bash
     npm run dev
     ```
   - Para produção:
     ```bash
     npm run start
     ```

## Endpoints da API

- `POST /api/atletas`: Cadastrar um novo atleta (com criptografia de senha).
- `GET /api/atletas`: Buscar todos os atletas com suporte a filtros e paginação.
- `GET /api/atletas/:id`: Buscar um atleta específico pelo ID.
- `PUT /api/atletas/:id`: Atualizar um atleta existente.
- `DELETE /api/atletas/:id`: Excluir um atleta.

Filiais
- 'POST /api/filiais': Criar uma nova filial.
- GET /api/filiais: Buscar todas as filiais.
- GET /api/filiais/:id: Buscar uma filial específica pelo ID.
- PUT /api/filiais/:id: Atualizar uma filial existente.
- DELETE /api/filiais/:id: Excluir uma filial.


## Contribuição

Sinta-se à vontade para contribuir para o projeto! Faça um fork, crie uma branch e submeta um pull request.

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais informações.
```

### Alterações no backend:

1. **Criptografia de Senha**: Adicionamos a criptografia de senha com a biblioteca `bcrypt` na rota de criação de atletas (`POST /api/atletas`), garantindo que a senha seja armazenada de forma segura no banco de dados.

2. **Autenticação via JWT**: Continuamos usando o JWT para autenticação de admins nas rotas, garantindo que apenas administradores possam realizar operações sensíveis como criação, atualização e exclusão de atletas.

Se precisar de mais alguma alteração ou detalhe adicional, só avisar!
