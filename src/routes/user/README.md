# 🧾 DOCUMENTAÇÃO DE USUÁRIO

Este documento descreve exclusivamente as requisições relacionadas às funcionalidades de **usuário**, incluindo atualização de dados, foto, quantidade de treinos e consulta de dados.

---

## Atualizar dados do usuário

```http
PATCH /user/update
````

### Alterações possíveis

| Chave    | Tipo   |
| -------- | ------ |
| nome     | String |
| email    | String |
| telefone | Number |

### Headers

| Header        | Value           |
| ------------- | --------------- |
| authorization | "Bearer :token" |

### Exemplo de requisição (STATUS 200)

```json
{
    "nome": "exemplo"
}
```

### Exemplo de resposta (STATUS 200)

```json
{
    "message": "usuario atualizado com sucesso"
}
```

---

## Atualizar foto do usuário

```http
PATCH /user/update-image
```

### Headers

| Header        | Value           |
| ------------- | --------------- |
| authorization | "Bearer :token" |

### Exemplo de requisição (form-data)

* Campo: `'fotoPerfil'`
* Arquivo:

```text
{
  uri: image,
  type: 'image/jpeg',
  name: 'perfil.jpg'
}
```

### Exemplo de resposta (STATUS 200)

```json
{
  "fotoPerfil": "https://res.cloudinary.com/dccx9drur/image/upload/v1758122159/users/68c9bff5511ea6ed50d41719/kokydxw3ikqeyz8ow48q.jpg",
  "message": "Imagem enviada com sucesso!",
  "user": {
    "_id": "68c9bff5511ea6ed50d41719",
    "nome": "God",
    "email": "God@god.com",
    "telefone": "7777777",
    "idade": 99,
    "sexo": "Masculino",
    "nivel": 3,
    "role": "ADM",
    "status": "active",
    "statusNivel": "Treinando",
    "foto": "https://res.cloudinary.com/dccx9drur/image/upload/v1758122159/users/68c9bff5511ea6ed50d41719/kokydxw3ikqeyz8ow48q.jpg",
    "turma": "68712206c1a63268a0e2baba",
    "unidade": "68712206c1a63268a0e2bab9",
    "treinosFeitos": 0,
    "treinosTotais": 0,
    "treinosPendentes": [],
    "progresso": 0,
    "desafiosConcluidos": [],
    "userRanking": [],
    "tokenVersion": 1,
    "criadoEm": "2025-09-16T19:52:21.049Z"
  }
}
```

### Possíveis respostas de erro

| STATUS | Mensagem               |
| ------ | ---------------------- |
| 400    | Imagem não selecionada |
| 401    | Ids não batem          |

---

## Consultar dados do usuário

```http
GET /user/data
```

### Headers

| Header        | Value           |
| ------------- | --------------- |
| authorization | "Bearer :token" |

### Descrição

Retorna os dados do usuário logado, omitindo campos sensíveis como senha, dispositivos ativos e tokenVersion.

### Exemplo de resposta (STATUS 200)

```json
{
  "user": {
    "_id": "68c9bff5511ea6ed50d41719",
    "nome": "God",
    "email": "God@god.com",
    "telefone": "7777777",
    "idade": 99,
    "sexo": "Masculino",
    "nivel": 3,
    "role": "ADM",
    "status": "active",
    "statusNivel": "Treinando",
    "foto": "https://res.cloudinary.com/dccx9drur/image/upload/v1758122159/users/68c9bff5511ea6ed50d41719/kokydxw3ikqeyz8ow48q.jpg",
    "turma": "68712206c1a63268a0e2baba",
    "unidade": "68712206c1a63268a0e2bab9",
    "treinosFeitos": 0,
    "treinosTotais": 0,
    "treinosPendentes": [],
    "progresso": 0,
    "desafiosConcluidos": [],
    "userRanking": [],
    "criadoEm": "2025-09-16T19:52:21.049Z"
  }
}
```

### Possíveis respostas de erro

| STATUS | Mensagem                        |
| ------ | ------------------------------- |
| 404    | Usuário não encontrado          |
| 500    | Erro ao buscar dados do usuário |

---

## Consultar quantidade de treinos do usuário

```http
GET /user/treinos
```

### Headers

| Header        | Value           |
| ------------- | --------------- |
| authorization | "Bearer :token" |

### Descrição

Retorna a quantidade de treinos concluídos e pendentes do usuário logado.

---

