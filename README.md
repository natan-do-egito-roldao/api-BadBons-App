
# 🚀 API BadBons

Este repositório documenta todas as rotas da **API BadBons**, incluindo exemplos de requisição, resposta, autenticação e detalhes técnicos.  
O backend foi desenvolvido com **Node.js + Express + MongoDB**, com autenticação JWT e integração ao **Cloudinary** para upload de imagens.

![Status do projeto](https://camo.githubusercontent.com/92e31ba8defedda019020920514ab8b2542d2b21e0162f088870ebde8171efb0/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f7374617475732d656d253230646573656e766f6c76696d746f2d79656c6c6f77)
![Versão do projeto](https://camo.githubusercontent.com/eb2ced8b4e517e1b6b7da52500a052fbf18073b473abb1eb01a6a1a023424b28/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f766572732543332541336f2d312e302e302d626c7565)

---

## 📚 Sumário de Rotas

- [🧾 Login e Cadastro](#login-e-cadastro)
- [🏫 Unidades](#unidades)
- [👤 Usuário](#usuario)
- [🧑‍🏫 Admin](#admin)
- [🔁 Ping (Verificação da API)](#ping-verificação-da-api)

---

## 🧾 Login e Cadastro

| Rota                                                   | Método | Descrição                                      |
|--------------------------------------------------------|---------|------------------------------------------------|
| [`/auth`](/src/routes/auth)                            | POST    | [Cadastro de usuário](#cadastro-de-usuário)   |
| [`/auth/login`](/src/routes/auth)                      | POST    | [Login de usuário](#login-de-usuário)         |
| [`/auth/login-token`](/src/routes/auth)                | POST    | [Verificação de token](#verificação-de-token) |
| [`/auth/logout`](/src/routes/auth)                     | POST    | [Logout de usuário](#logout-de-usuário)       |
| [`/auth/reAuth`](/src/routes/auth)                     | POST    | Atualiza o token via refresh token            |
| [`/auth/userData`](/src/routes/auth)                   | GET     | [Dados do usuário logado](#dados-do-usuário)  |

---

## 🏫 Unidades

| Rota                                        | Método | Descrição                                            |
|---------------------------------------------|---------|----------------------------------------------------|
| [`/unit`](/src/routes/unit)                 | GET     | Retorna todas as unidades                         |
| [`/unit/user`](/src/routes/unit)            | GET     | Retorna a unidade do usuário logado               |
| [`/unit/tagDay`](/src/routes/unit)          | PATCH   | Marca/desmarca presença de aluno                  |
| [`/unit/viewTagDays`](/src/routes/unit)     | GET     | Visualiza presenças por dia e horário             |
| [`/unit/confirmTagDay`](/src/routes/unit)   | PATCH   | Confirma presença do aluno (PROFESSOR/ADM)        |
| [`/admin/unit`](/src/routes/admin/unit)     | POST    | Cria nova unidade                                 |

---

## 👤 Usuário

| Rota                                      | Método | Descrição                                         |
|-------------------------------------------|---------|-------------------------------------------------|
| [`/user/update`](/src/routes/user)        | PATCH   | [Atualiza dados do usuário](#atualizar-dados-do-usuário) |
| [`/user/update-image`](/src/routes/user)  | PATCH   | [Atualiza imagem do perfil](#atualizar-foto-do-usuário)  |
| [`/user/treinos`](/src/routes/user)       | GET     | Retorna quantidade de treinos do usuário         |
| [`/user/data`](/src/routes/user)          | GET     | [Retorna dados completos do usuário logado](#rota-userdata) |

---

## 🧑‍🏫 Admin

| Rota                                                   | Método | Descrição                         |
|--------------------------------------------------------|---------|-----------------------------------|
| [`/admin/approve-athlete/:userId`](/src/routes/admin)  | PATCH   | Aprova cadastro de atleta         |
| [`/admin/disapprove-athlete/:userId`](/src/routes/admin)| PATCH  | Reprova cadastro de atleta        |

---

## 🔁 Ping (Verificação da API)

| Rota          | Método | Descrição                                           |
|----------------|---------|---------------------------------------------------|
| [`/ping`](/src/server.js) | GET     | Verifica se a API está online e valida a versão  |

**Exemplo de uso:**

```https
GET /ping?version=1.0.0
````

**Respostas possíveis:**

* ✅ `200 OK` → API online e versão compatível
* ⚠️ `426 Upgrade Required` → Versão do app desatualizada

---

## ⚙️ Configuração de autenticação

A maioria das rotas requer autenticação com **JWT Bearer Token**:

**Header necessário:**

```
Authorization: Bearer <token>
```

---

## 📦 Estrutura do projeto

```
src/
├── config/
│   └── db.js
├── controllers/
│   ├── auth.controller.js
│   ├── unit.controller.js
│   ├── user/
│   │   ├── info.controller.js
│   │   └── treinos.controller.js
├── jobs/
│   └── jobResetTags.js
├── middleware/
│   ├── authenticate.js
│   ├── authorize.js
│   └── reAuth.js
├── models/
│   ├── userModel.js
│   ├── unitModel.js
│   ├── presenceModel.js
│   └── trainingModel.js
├── routes/
│   ├── admin/
│   │   ├── user.routes.js
│   │   └── unit.routes.js
│   ├── auth/
│   │   └── auth.routes.js
│   ├── unit/
│   │   └── unit.routes.js
│   └── user/
│       └── info.routes.js
└── server.js
```

---

## 🔒 Segurança

* Autenticação via **JWT**
* Criptografia de senhas com **bcryptjs**
* Upload seguro via **Cloudinary**
* Controle de acesso com middleware `authorize()` baseado em **roles** (`ADM`, `PROFESSOR`, `ALUNO`)

---

## 🧠 Versão e dependências

| Pacote       | Versão mínima |
| ------------ | ------------- |
| Node.js      | 18+           |
| Express      | ^4.18.0       |
| Mongoose     | ^7.0.0        |
| bcryptjs     | ^2.4.3        |
| jsonwebtoken | ^9.0.0        |
| multer       | ^1.4.5        |
| dotenv       | ^16.0.0       |
| cloudinary   | ^1.41.0       |

---

## 📅 Agendamento automático

O **jobResetTagDay** roda automaticamente no startup do servidor, resetando marcações de presença diariamente.

---

## 🚀 Execução

### Ambiente local:

```bash
npm install
npm run dev
```

### Variáveis de ambiente obrigatórias:

```env
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=seu_token
CLOUD_KEY=sua_chave_cloudinary
CLOUD_SECRET=seu_segredo_cloudinary
```

---

## ✅ Status

| Ambiente        | Status         |
| --------------- | -------------- |
| Produção        | 🟢 Online      |
| Desenvolvimento | 🧩 Em evolução |

---

### 📖 Leia mais

* [Documentação de Login e Cadastro](docs/auth.md)
* [Documentação de Unidades](docs/unit.md)
* [Documentação de Usuário](docs/user.md)

```
