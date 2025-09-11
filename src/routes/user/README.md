# DOCUMENTACÃO DE LOGIN E CADASTRO

Este documento descreve exclusivamente as requisições relacionadas às funcionalidade de usuario.

***

## Atualizar dados do usuario 


```https
  PATCH /user/update/:userID 
```

### Alterações possiveis 

| Cave             | Tipo            |
|------------------|-----------------|
| nome             | String          |
| email            | String          |
| telefone         | Number          |

### Headers

| Header           | Value           |
|------------------|-----------------|
| authorization    | "Bearer :token" |

### Exemplo de requisição (STATUS 200)

```json

  {
	  "nome": "exemplo"
  }
```

### Exemplo de resposta(STATUS 200)

```json

    {
	    "message": "usuario atualizado com sucesso",
    }
```
