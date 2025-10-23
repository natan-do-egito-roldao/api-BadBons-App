# 🚀 API BadBons

Este repositório documenta todas as rotas da API BadBons, incluindo exemplos de requisição, resposta, autenticação e detalhes técnicos.

![Status do projeto](https://camo.githubusercontent.com/92e31ba8defedda019020920514ab8b2542d2b21e0162f088870ebde8171efb0/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f7374617475732d656d253230646573656e766f6c76696d656e746f2d79656c6c6f77) 
![Versão do projeto](https://camo.githubusercontent.com/eb2ced8b4e517e1b6b7da52500a052fbf18073b473abb1eb01a6a1a023424b28/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f766572732543332541336f2d312e302e302d626c7565) 

---

## 📚 Sumário por rotas

- [Login e Cadastro](#login-e-cadastro)
- [Unidades](#unidades)
- [Usuário](#usuario)

---

## Login e Cadastro

| Rota                                                   | Método        | Descrição                                    |
|--------------------------------------------------------|---------------|----------------------------------------------|
| `/ping`                                                | GET           | Verifica se a API está online               |
| `/auth`                                                | POST          | Cadastro de usuário                          |
| `/auth/login`                                          | POST          | Login de usuário                             |
| `/auth/login-token`                                    | POST          | Verifica token do dispositivo               |
| `/auth/logout`                                        | POST          | Logout de usuário                            |
| `/auth/reAuth`                                        | POST          | Atualiza token de acesso via refresh token  |
| `/auth/userData`                                      | GET           | Retorna dados do usuário logado              |
| `/admin/approve-athlete/:userId`                      | PATCH         | Aprova cadastro de atleta                    |
| `/admin/disapprove-athlete/:userId`                   | PATCH         | Reprova cadastro de atleta                   |

---

## Unidades

| Rota                               | Método        | Descrição                                           |
|------------------------------------|---------------|---------------------------------------------------|
| `/admin/unit`                      | POST          | Criar nova unidade                                |
| `/unit`                             | GET           | Retorna todas as unidades                          |
| `/unit/user`                        | GET           | Retorna unidade do usuário logado                 |
| `/unit/tagDay`                      | PATCH         | Marca/desmarca presença de aluno                  |
| `/unit/viewTagDays`                 | GET           | Visualiza presenças por dia e horário            |
| `/unit/confirmTagDay`               | PATCH         | Confirma presença do aluno (PROFESSOR/ADM)       |

---

## Usuário

| Rota                                      | Método        | Descrição                                         |
|-------------------------------------------|---------------|-------------------------------------------------|
| `/user/update`                             | PATCH         | Atualiza dados do usuário logado               |
| `/user/update-image`                       | PATCH         | Atualiza foto do usuário                        |
| `/user/treinos`                            | GET           | Retorna quantidade de treinos do usuário       |
| `/user/data`                               | GET           | Retorna dados completos do usuário logado      |

---

### Observações gerais

- **Autenticação:** A maioria das rotas requer o header `Authorization: "Bearer :token"`.
- **Permissões:** Algumas rotas são restritas por `role` (ex.: `PROFESSOR`, `ADM`).
- **Uploads:** A rota `/user/update-image` utiliza `multipart/form-data` para enviar imagens.

---

### Status e versão

- **Status:** ![Status do projeto](https://camo.githubusercontent.com/92e31ba8defedda019020920514ab8b2542d2b21e0162f088870ebde8171efb0/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f7374617475732d656d253230646573656e766f6c76696d656e746f2d79656c6c6f77)  
- **Versão:** ![Versão do projeto](https://camo.githubusercontent.com/eb2ced8b4e517e1b6b7da52500a052fbf18073b473abb1eb01a6a1a023424b28/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f766572732543332541336f2d312e302e302d626c7565)
