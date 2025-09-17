# DOCUMENTACÃO DE LOGIN E CADASTRO

Este documento descreve exclusivamente as requisições relacionadas às funcionalidade de usuario.

***

## Atualizar dados do usuario 


```https
  PATCH /user/update
```

### Alterações possiveis 

| Chave             | Tipo            |
|-------------------|-----------------|
| nome              | String          |
| email             | String          |
| telefone          | Number          |

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

## Atualizar foto do usuario 


```https
  PATCH /user/update-image 
```



### Headers

| Header           | Value           |
|------------------|-----------------|
| authorization    | "Bearer :token" |

### Exemplo de requisição (STATUS 200)

Formulario c/

  'fotoPerfil', {
  uri: image,
  type: 'image/jpeg',
  name: 'perfil.jpg'}

### Exemplo de resposta(STATUS 200)

```json

    {
      "fotoPerfil": "https://res.cloudinary.com/dccx9drur/image/upload/v1758122159/users/68c9bff5511ea6ed50d41719/kokydxw3ikqeyz8ow48q.jpg", 
      "message": "Imagem enviada com sucesso!", "user": {"__v": 0, 
      "_id": "68c9bff5511ea6ed50d41719", "activeDevices": [[Object]], 
      "cpf": "77777777777", 
      "criadoEm": "2025-09-16T19:52:21.049Z", "dataNascimento": "0001-01-01T00:00:00.000Z", "desafiosConcluidos": [], 
      "email": "God@god.com", 
      "foto": "https://res.cloudinary.com/dccx9drur/image/upload/v1758122159/users/68c9bff5511ea6ed50d41719/kokydxw3ikqeyz8ow48q.jpg", 
      "idade": 99, 
      "nivel": 3, 
      "nome": "God", 
      "password": "$2b$10$JD6K7m2wwh6dDC4i9Us.eOJItFw.XC/54ZQD2frRMeqA.HeWmJcSK", "progresso": 0, 
      "role": "ADM", 
      "sexo": "Masculino", 
      "status": "active", 
      "statusNivel": "Treinando", 
      "telefone": "7777777", 
      "tokenVersion": 1, 
      "treinosConcluidos": [], 
      "treinosFeitos": 0, 
      "treinosPendentes": [], 
      "treinosTotais": 0, 
      "turma": "68712206c1a63268a0e2baba", "unidade": "68712206c1a63268a0e2bab9", "userRanking": []}}
```

### Exemplo de resposta(STATUS 400)

```json
{ 
  "error": "imagem não selecionada"
}
```

### Exemplo de resposta(STATUS 401)

```json
{ 
  "error": "Ids não batem"
}
```