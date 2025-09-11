# DOCUMENTACÃO DE LOGIN E CADASTRO

Este documento descreve exclusivamente as requisições relacionadas às funcionalidade de login e cadastro.

## Cadastra um novo usuario 

```https
  POST /auth
```

### Exemplo de requisição

```json
    {
        "nome": "exemplo",
        "idade": 10,
        "email": "exemplo@exemplo.com",
        "telefone": "12345678901",
        "sexo": "Masculino",
        "unidade": ":unidadeID",
        "turma": ":turmaID",
        "password": "exemplo",
        "role": "ALUNO_MENSALISTA",
    }
```

### Exemplo de resposta(STATUS 200)

```json

    {
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
```

### Chaves com valores fixos

#### Sexo
```https
    'Masculino', 'Feminino', 'Outro'
```

#### Role
```https
    'ALUNO_MENSALISTA', 'ATLETA_FORA', 'PROFESSOR', 'ARBITRO', 'ADM'

    default: 'ALUNO_MENSALISTA'
```

## Login de usuario 

```https
  POST /auth/login
```

### Exemplo de requisição

```json
    {
        "email": "exemplo@exemplo.com",
        "password": "exemplo"
    }
```

### Exemplo de resposta(STATUS 401)

status !== 'active'

```json
    {
        "error" : "Usuário pendente"
    }
```

### Exemplo de resposta(STATUS 402)

```json
    {
        "error" : "Credenciais inválidas"
    }
```

