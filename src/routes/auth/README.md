
# 🧾 DOCUMENTAÇÃO DE LOGIN E CADASTRO

Este documento descreve exclusivamente as requisições relacionadas às funcionalidades de **login**, **cadastro**, **logout** e **validação de token**.

---

## 🧍‍♂️ Cadastrar um novo usuário

```http
POST /auth
````

### Exemplo de requisição

```json
{
    "nome": "exemplo",
    "idade": 10,
    "dataNascimento": "2000-01-01",
    "cpf": 12345678900,
    "email": "exemplo@exemplo.com",
    "telefone": "12345678901",
    "sexo": "Masculino",
    "unidade": ":unidadeID",
    "turma": ":turmaID",
    "password": "exemplo",
    "role": "ALUNO_MENSALISTA"
}
```

### Exemplo de resposta (STATUS 201)

```json
{
    "message": "Atleta criado com sucesso!",
    "athlete": {
        "_id": "68712695cd22408b59d9e397",
        "nome": "exemplo",
        "idade": 10,
        "email": "exemplo@exemplo.com",
        "telefone": "12345678901",
        "sexo": "Masculino",
        "nivel": 1,
        "unidade": "68712206c1a63268a0e2bab9",
        "turma": "68712206c1a63268a0e2baba",
        "password": "$2b$10$MzfOjqfV1Nj/Jj/8xNQ8uez7LRGnYAc1lYvDwxoVLjqP2R9LMNACO",
        "statusNivel": "Treinando",
        "role": "ALUNO_MENSALISTA",
        "treinosPendentes": [],
        "treinosFeitos": 0,
        "treinosTotais": 0,
        "progresso": 0,
        "status": "pending",
        "criadoEm": "2025-07-11T14:58:29.971Z",
        "treinosConcluidos": [],
        "desafiosConcluidos": [],
        "userRanking": [],
        "__v": 0
    }
}
```

### Campos obrigatórios

* `nome`
* `password`
* `unidade`
* `turma`

### Possíveis respostas de erro

| STATUS | Mensagem                     |
| ------ | ---------------------------- |
| 400    | Unidade é obrigatória        |
| 400    | Turma é obrigatória          |
| 400    | Unidade não encontrada       |
| 400    | Turma não encontrada         |
| 400    | Nome é obrigatório           |
| 400    | Senha é obrigatória          |
| 400    | Email já cadastrado          |
| 500    | Erro interno ao criar atleta |

---

## 🔑 Login de usuário

```http
POST /auth/login
```

### Exemplo de requisição

```json
{
    "email": "exemplo@exemplo.com",
    "password": "exemplo"
}
```

### Exemplo de resposta (STATUS 200)

```json
{
    "accesstoken": "exemplo_token_15min",
    "RefreshToken": "exemplo_refresh_token_30dias"
}
```

### Possíveis respostas de erro

| STATUS | Descrição                                |
| ------ | ---------------------------------------- |
| 401    | Usuário pendente (`status !== 'active'`) |
| 402    | Credenciais inválidas                    |
| 403    | Usuário sem dispositivos ativos          |

---

## 🧭 Verificação de token ativo

```http
POST /auth/login-token
```

### Requer autenticação via `Bearer Token`

### Exemplo de resposta (STATUS 200)

Token válido:

```json
{
    "message": "Token válido"
}
```

### Exemplo de resposta (STATUS 400)

```json
{
    "error": "Token ausente ou inválido"
}
```

---

## 🚪 Logout de usuário

```http
POST /auth/logout
```

### Exemplo de requisição

```json
{
    "refreshToken": "Bearer exemplo1234255exemplo"
}
```

### Exemplo de resposta (STATUS 200)

```json
{
    "message": "usuario deslogado com sucesso",
    "dispositivosAtivos": []
}
```

### Possíveis respostas de erro

| STATUS | Descrição                                           |
| ------ | --------------------------------------------------- |
| 401    | Token ausente ou mal formatado (sem `Bearer`)       |
| 402    | Token não associado a algum dispositivo dessa conta |
| 403    | Refresh token inválido                              |
| 404    | Usuário não encontrado                              |
| 500    | Erro interno no logout                              |

---

## 👤 Buscar dados do usuário logado

```http
GET /auth/userData
```

### Requer autenticação via `Bearer Token`

### Exemplo de resposta (STATUS 200)

```json
{
    "_id": "68712695cd22408b59d9e397",
    "nome": "exemplo",
    "idade": 10,
    "email": "exemplo@exemplo.com",
    "telefone": "12345678901",
    "sexo": "Masculino",
    "nivel": 1,
    "role": "ALUNO_MENSALISTA",
    "unidade": "68712206c1a63268a0e2bab9",
    "turma": "68712206c1a63268a0e2baba"
}
```

### Exemplo de resposta (STATUS 404)

```json
{
    "error": "Usuário não encontrado"
}
```

---

## 📚 Valores fixos aceitos

### Sexo

```json
["Masculino", "Feminino", "Outro"]
```

### Role

```json
["ALUNO_MENSALISTA", "ATLETA_FORA", "PROFESSOR", "ARBITRO", "ADM"]
```

**Default:** `"ALUNO_MENSALISTA"`

---

## ⚙️ Middleware Utilizados

| Middleware     | Descrição                                        |
| -------------- | ------------------------------------------------ |
| `authenticate` | Valida o token JWT de acesso                     |
| `reAuth`       | Gera novo access token a partir do refresh token |

---

## 📦 Estrutura das rotas

| Rota                | Método | Descrição                               |
| ------------------- | ------ | --------------------------------------- |
| `/auth`             | `POST` | Cria um novo usuário                    |
| `/auth/login`       | `POST` | Realiza o login                         |
| `/auth/login-token` | `POST` | Valida o token do dispositivo           |
| `/auth/logout`      | `POST` | Encerra a sessão do dispositivo         |
| `/auth/reAuth`      | `POST` | Atualiza o access token (refresh token) |
| `/auth/userData`    | `GET`  | Retorna os dados do usuário autenticado |

