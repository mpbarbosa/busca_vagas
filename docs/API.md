# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### Health Check
**GET** `/health`

Verifica se a API está funcionando.

**Response:**
```json
{
  "status": "OK",
  "message": "API está funcionando"
}
```

---

### Vagas

#### Listar todas as vagas
**GET** `/vagas`

**Response:**
```json
{
  "vagas": []
}
```

#### Buscar vaga por ID
**GET** `/vagas/:id`

**Parameters:**
- `id` (path): ID da vaga

**Response:**
```json
{
  "id": "123",
  "titulo": "Recepcionista",
  "descricao": "Vaga para recepcionista de hotel",
  "hotel": "Hotel Example",
  "sindicato": "Sindicato dos Hoteleiros",
  "localizacao": "São Paulo, SP",
  "salario": 2500,
  "requisitos": ["Ensino médio completo", "Experiência"]
}
```

#### Criar nova vaga
**POST** `/vagas`

**Request Body:**
```json
{
  "titulo": "Recepcionista",
  "descricao": "Vaga para recepcionista de hotel",
  "hotel": "Hotel Example",
  "sindicato": "Sindicato dos Hoteleiros",
  "localizacao": "São Paulo, SP",
  "salario": 2500,
  "requisitos": ["Ensino médio completo", "Experiência"]
}
```

**Response:**
```json
{
  "message": "Vaga criada com sucesso"
}
```

#### Atualizar vaga
**PUT** `/vagas/:id`

**Parameters:**
- `id` (path): ID da vaga

**Request Body:**
```json
{
  "titulo": "Recepcionista Senior",
  "salario": 3000
}
```

**Response:**
```json
{
  "message": "Vaga atualizada com sucesso"
}
```

#### Remover vaga
**DELETE** `/vagas/:id`

**Parameters:**
- `id` (path): ID da vaga

**Response:**
```json
{
  "message": "Vaga removida com sucesso"
}
```

## Error Responses

Todos os endpoints podem retornar os seguintes erros:

**400 Bad Request**
```json
{
  "error": "Mensagem de erro específica"
}
```

**401 Unauthorized**
```json
{
  "error": "Token não fornecido"
}
```

**500 Internal Server Error**
```json
{
  "error": "Algo deu errado!"
}
```
