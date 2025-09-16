# DOCUMENTACÃO DE LOGIN E CADASTRO

Este documento descreve exclusivamente as requisições relacionadas às funcionalidade de adm.

***

## Aprovar um novo usuario 

alteração feita ao enviar requisição

```https
  PATCH /admin/approve-user/:userId
```

### Headers

| Header           | Value           |
|------------------|-----------------|
| authorization    | "Bearer :token" |

### Autorização

```https
  user.role = ADM
```

### Exemplo de resposta(STATUS 200)

```json

    {
	    "message": "usuario aprovado com sucesso",
    }
```

***

## Reprovar um novo usuario 

alteração feita ao enviar requisição

```https
  PATCH /admin/disapprove-user/:userId
```

### Headers

| Header           | Value           |
|------------------|-----------------|
| authorization    | "Bearer :token" |

### Autorização

```https
  user.role = ADM
```

### Exemplo de resposta(STATUS 200)

```json

    {
	    "message": "usuario Reprovado com sucesso",
    }
```

***

## Cadastrar nova unidade

alteração feita ao enviar requisição

```https
  POST /admin/unit
```

### Headers

| Header           | Value           |
|------------------|-----------------|
| authorization    | "Bearer :token" |

### Autorização

```https
  user.role = ADM
```

### Exemplo de resposta(STATUS 200)

```json
    {
        "endereco": "Rua Aguiar Moreira, 555",
        "bairro": "Bonsucesso",
        "valorDiaria": 40,
            "planos": [
            {
            "valor": 125,
            "quantidadeDeAulas": 2
            },
                {
            "valor": 105,
            "quantidadeDeAulas": 1
            }
            ],
        "turmas": [
            {
            "nome": "1x Quarta",
            "capacidade": 24,
            "sessoes": [
                {
                "diaSemana": 3,
                "horaInicio": "19:30",
                "duracaoMin": 120
                }
            ]
            },
            {
            "nome": "1x Sabado",
            "capacidade": 24,
            "sessoes": [
                {
                "diaSemana": 6,
                "horaInicio": "09:00",
                "duracaoMin": 120
                }
            ]
            },
            {
            "nome": "2x Quarta e Sabado",
            "capacidade": 24,
            "sessoes": [
                {
                "diaSemana": 3,
                "horaInicio": "19:30",
                "duracaoMin": 120
                },
                        {
                "diaSemana": 6,
                "horaInicio": "09:00",
                "duracaoMin": 120
                }
            ]
            }
        ]
    }
```