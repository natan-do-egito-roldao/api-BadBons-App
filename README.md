# 🚀 API BadBons

Este repositório documenta todas as rotas da API BadBons, incluindo exemplos de requisição, resposta, autenticação e detalhes técnicos.

![Status do projeto](https://camo.githubusercontent.com/92e31ba8defedda019020920514ab8b2542d2b21e0162f088870ebde8171efb0/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f7374617475732d656d253230646573656e766f6c76696d656e746f2d79656c6c6f77) ![Versão do projeto](https://camo.githubusercontent.com/eb2ced8b4e517e1b6b7da52500a052fbf18073b473abb1eb01a6a1a023424b28/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f766572732543332541336f2d312e302e302d626c7565) 

***

## 📚 Sumário por rotas

- [LOGIN E CADASTRO](#login-e-cadastro)
- [UNIDADES](#unidades)
- [USUARIO](#usuario)

***

### Login e Cadastro

| Rota                                                   | Metodo        | Descrição                     |
|--------------------------------------------------------|---------------|-------------------------------|
| [/ping](/src)                                          | GET           | Verifica se a api está online |
| [/auth](/src/routes/auth)                              | POST          | Cadastro de Usuario           |
| [/auth/login](/src/routes/auth)                        | POST          | Login de Usuario              |
| [/admin/approve-athlete/:userId](/src/routes/admin)    | PATCH         | Aprova Login                  |
| [/admin/disapprove-athlete/:userId](/src/routes/admin) | PATCH         | Reprova Login                 |

***

### Unidades

| Rota             | Metodo        | Descrição                 |
|------------------|---------------|---------------------------|
| /admin/unit      | POST          | Criar nova unidade        |
| /unit            | GET           | retorna todas as unidades |

***

### Usuario

| Rota                      | Metodo        | Descrição                   |
|---------------------------|---------------|-----------------------------|
| /user/update/:userID      | PATCH         | Atualiza dados pelo usuario |