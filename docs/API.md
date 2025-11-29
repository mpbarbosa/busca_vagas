# API Documentation

## Base URL

```plaintext
http://localhost:3005/api
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

#### Busca Simples de Vagas por Dia

**GET** `/vagas/search/bydates`

Realiza uma busca automatizada de vagas disponíveis em hotéis para uma data específica usando Selenium WebDriver.

**Query Parameters:**

- `checkin` (required): Data inicial para busca no formato YYYY-MM-DD (ex: 2025-12-25)
- `checkout` (required): Data final para busca no formato YYYY-MM-DD (ex: 2025-12-26)
- `headless` (optional): Define se o navegador será executado em modo headless. Valores: `true` (padrão) ou `false`

**Example Request:**

```plaintext
GET /api/vagas/search/bydates?checkin=2025-12-25&checkout=2025-12-26
GET /api/vagas/search/bydates?checkin=2025-12-25&checkout=2025-12-26&headless=false
```

**Response:**

```json
{
  "searchDate": "2025-12-25",
  "results": {
    "availableHotels": [],
    "unavailableHotels": [],
    "checkInDate": "12/25/2025",
    "checkOutDate": "12/26/2025"
  }
}
```

**Error Response (400 - Missing Parameters):**

```json
{
  "error": "Both checkin and checkout parameters are required"
}
```

**Error Response (500 - Invalid Date):**

```json
{
  "error": "Invalid date provided. Please check the date format."
}
```

**Notes:**
- This endpoint performs automated web scraping using Selenium
- Response time may be longer (20-30 seconds) due to browser automation
- The search checks availability for the specified date (check-in) and the following day (check-out)

## Error Responses

Todos os endpoints podem retornar os seguintes erros:

### 400 Bad Request

```json
{
  "error": "Mensagem de erro específica"
}
```

### 401 Unauthorized

```json
{
  "error": "Token não fornecido"
}
```

### 500 Internal Server Error

```json
{
  "error": "Algo deu errado!"
}
```
