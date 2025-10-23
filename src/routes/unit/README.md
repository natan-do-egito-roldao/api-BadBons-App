
# 🏫 DOCUMENTAÇÃO DE UNIDADES E PRESENÇA

Este documento descreve as rotas e funcionalidades relacionadas a **unidades**, **sessões** e **marcação de presença**.

---

## 📋 Listar todas as unidades

```http
GET /unit
````

### Exemplo de resposta (STATUS 200)

```json
{
    "success": true,
    "data": [
        {
            "_id": "68712206c1a63268a0e2bab9",
            "nome": "Unidade Exemplo",
            "endereco": "Rua Exemplo, 123",
            "turmas": [
                {
                    "_id": "68712206c1a63268a0e2baba",
                    "nome": "Turma A",
                    "sessoes": [
                        {
                            "diaSemana": [1, 3, 5],
                            "horaInicio": "18:00",
                            "horaFim": "19:30"
                        }
                    ]
                }
            ]
        }
    ]
}
```

---

## 👤 Obter unidade do usuário logado

```http
GET /unit/user
```

### Requer autenticação via `Bearer Token`

### Exemplo de resposta (STATUS 200)

```json
{
    "success": true,
    "data": {
        "_id": "68712206c1a63268a0e2bab9",
        "nome": "Unidade Exemplo",
        "turmas": [
            {
                "_id": "68712206c1a63268a0e2baba",
                "nome": "Turma A",
                "sessoes": [
                    {
                        "diaSemana": [1, 3, 5],
                        "horaInicio": "18:00",
                        "horaFim": "19:30"
                    }
                ]
            }
        ]
    }
}
```

---

## 📅 Marcar presença (Tag Day)

```http
PATCH /unit/tagDay
```

### Requer autenticação via `Bearer Token`

### Exemplo de requisição

```json
{
    "diaSemana": 3,
    "horaInicio": "18:00"
}
```

### Lógica

* Permite que um aluno registre sua presença em uma sessão.
* Verifica se o dia está habilitado para a turma.
* Alterna entre marcar e desmarcar a presença do aluno.

### Exemplo de resposta (STATUS 200)

```json
{
    "success": true,
    "data": {
        "_id": "68713000c1a63268a0e2bb00",
        "presencaSchema": [
            {
                "data": 3,
                "horaInicio": "18:00",
                "alunos": [
                    {
                        "aluno": "João Silva",
                        "marcouIda": true
                    }
                ]
            }
        ]
    }
}
```

### Possíveis respostas de erro

| STATUS | Mensagem                                       |
| ------ | ---------------------------------------------- |
| 400    | Dia não habilitado para marcação de presença   |
| 404    | Turma não encontrada na unidade                |
| 404    | Sessão não encontrada para o dia especificado  |
| 404    | Horário não encontrado para o dia especificado |
| 500    | Erro interno ao buscar unidades                |

---

## 🔍 Visualizar presenças por dia

```http
GET /unit/viewTagDays
```

### Requer autenticação via `Bearer Token`

### Exemplo de requisição

```json
{
    "diaSemana": 3,
    "horaInicio": "18:00"
}
```

### Exemplo de resposta (STATUS 200)

```json
{
    "success": true,
    "data": [
        {
            "data": 3,
            "horaInicio": "18:00",
            "alunos": [
                {
                    "aluno": "João Silva",
                    "marcouIda": true
                }
            ]
        }
    ]
}
```

### Possíveis respostas de erro

| STATUS | Mensagem                        |
| ------ | ------------------------------- |
| 500    | Erro interno ao buscar unidades |

---

## ✅ Confirmar presença (apenas PROFESSOR ou ADM)

```http
PATCH /unit/confirmTagDay
```

### Requer autenticação via `Bearer Token` e autorização `PROFESSOR` ou `ADM`

### Exemplo de requisição

```json
{
    "aluno": "João Silva",
    "data": 3,
    "horaInicio": "18:00",
    "marcouIda": true
}
```

### Exemplo de resposta (STATUS 200)

```json
{
    "success": true,
    "data": {
        "_id": "68713000c1a63268a0e2bb00",
        "presencaSchema": [
            {
                "data": 3,
                "horaInicio": "18:00",
                "alunos": [
                    {
                        "aluno": "João Silva",
                        "marcouIda": true,
                        "presente": true
                    }
                ]
            }
        ]
    }
}
```

### Possíveis respostas de erro

| STATUS | Mensagem                   |
| ------ | -------------------------- |
| 403    | Usuário não autorizado     |
| 500    | Erro ao confirmar presença |

---

## 📦 Estrutura das rotas

| Rota                  | Método  | Descrição                                        |
| --------------------- | ------- | ------------------------------------------------ |
| `/unit`               | `GET`   | Lista todas as unidades                          |
| `/unit/user`          | `GET`   | Retorna unidade do usuário logado                |
| `/unit/tagDay`        | `PATCH` | Marca/desmarca presença de aluno                 |
| `/unit/viewTagDays`   | `GET`   | Visualiza presenças em determinado dia e horário |
| `/unit/confirmTagDay` | `PATCH` | Confirma presença do aluno (PROFESSOR/ADM)       |

---

## ⚙️ Middleware Utilizados

| Middleware     | Descrição                                                   |
| -------------- | ----------------------------------------------------------- |
| `authenticate` | Valida o token JWT de acesso                                |
| `authorize`    | Verifica se o usuário possui permissão para executar a ação |


