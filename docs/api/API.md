# API Documentation

**Version:** 1.3.0  
**Last Updated:** December 2, 2025

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

#### Listar todos os hotéis (estático)

**GET** `/vagas/hoteis`

Retorna a lista de hotéis disponíveis (dados estáticos).

**Response:**

```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": 1,
      "name": "BLUES Appenzell",
      "location": "Appenzell",
      "type": "Hotel",
      "description": "Hotel BLUES Appenzell"
    },
    {
      "id": 2,
      "name": "Homem de Melo",
      "location": "Homem de Melo",
      "type": "Location",
      "description": "Unidade Homem de Melo"
    },
    {
      "id": 3,
      "name": "Perdizes",
      "location": "Perdizes",
      "type": "Location",
      "description": "Unidade Perdizes"
    },
    {
      "id": 4,
      "name": "Sumaré",
      "location": "Sumaré",
      "type": "Location",
      "description": "Unidade Sumaré"
    }
  ]
}
```

#### Buscar lista de hotéis do site AFPESP (web scraping)

**GET** `/vagas/hoteis/scrape`

Realiza web scraping da página AFPESP para obter a lista atualizada de hotéis do dropdown `ddlHoteis`.

**Tecnologia:** Puppeteer (headless browser)

**Nota:** Este endpoint retorna **todas** as opções do dropdown, incluindo a opção "Todos" (valor vazio ou -1).

**Response:**

```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": 1,
      "hotelId": "",
      "name": "Todos",
      "type": "All"
    },
    {
      "id": 2,
      "hotelId": "4007",
      "name": "Amparo",
      "type": "Hotel"
    },
    {
      "id": 3,
      "hotelId": "4003",
      "name": "Appenzell",
      "type": "Hotel"
    },
    {
      "id": 4,
      "hotelId": "4001",
      "name": "Areado",
      "type": "Hotel"
    }
  ],
  "source": "AFPESP Website - ddlHoteis dropdown"
}
```

**Hotéis disponíveis (25 total, inclui opção "Todos"):**

- **Todos** (opção para todos os hotéis)
- Amparo (4007)
- Appenzell (4003)
- Areado (4001)
- Avaré (4002)
- Boraceia (4024)
- Campos do Jordão (4004)
- Caraguatatuba (4013)
- Fazenda Ibirá (4023)
- Guarujá (4014)
- Itanhaém (4015)
- Lindoia (4008)
- Maresias (4018)
- Monte Verde (4005)
- Peruíbe I (4021)
- Peruíbe II (4022)
- Poços de Caldas (4006)
- Saha (4020)
- São Lourenço (4019)
- São Pedro (4011)
- Serra Negra (4009)
- Socorro (4010)
- Termas de Ibirá (4012)
- Ubatuba (4016)
- Unidade Capital (4017)

**Nota:** Este endpoint realiza scraping em tempo real e pode levar alguns segundos para responder.

#### Buscar hotel por ID

**GET** `/vagas/hoteis/:id`

Retorna informações de um hotel específico pelo ID.

**Parameters:**

- `id` (path): ID do hotel

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "BLUES Appenzell",
    "location": "Appenzell",
    "type": "Hotel",
    "description": "Hotel BLUES Appenzell"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": "Hotel não encontrado"
}
```

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

Realiza uma busca automatizada de vagas disponíveis em hotéis para uma data específica usando Puppeteer (recomendado) ou Selenium WebDriver (legado).

**Query Parameters:**

- `checkin` (required): Data inicial para busca no formato YYYY-MM-DD (ex: 2025-12-25)
- `checkout` (required): Data final para busca no formato YYYY-MM-DD (ex: 2025-12-26)
- `hotel` (optional): Nome do hotel ou "Todas" para todos os hotéis (padrão: "Todas")

**Example Request:**

```plaintext
GET /api/vagas/search?checkin=2025-12-25&checkout=2025-12-26
GET /api/vagas/search?checkin=2025-12-25&checkout=2025-12-26&hotel=Appenzell
GET /api/vagas/search/bydates?checkin=2025-12-25&checkout=2025-12-26
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

---

## Booking Rules

### Holiday Package Reservations

During the Christmas and New Year periods, reservation dates are pre-defined in the format of closed packages. These packages have fixed check-in and check-out dates and cannot be modified.

#### Christmas Package
- **Check-in:** December 22nd
- **Check-out:** December 27th
- **Duration:** 5 days/4 nights

#### New Year Package
- **Check-in:** December 27th
- **Check-out:** January 2nd
- **Duration:** 6 days/5 nights

#### Important Notes

⚠️ **Booking Restrictions:**
1. During these holiday periods, reservations **cannot** be made on different dates
2. Only the exact package dates are accepted
3. Partial periods within these packages are not allowed
4. These rules apply to all hotels in the system

**Example Valid Requests:**

```bash
# Christmas Package (Valid)
GET /api/vagas/search?checkin=2024-12-22&checkout=2024-12-27

# New Year Package (Valid)
GET /api/vagas/search?checkin=2024-12-27&checkout=2025-01-02
```

**Example Invalid Requests:**

```bash
# Invalid - Partial Christmas period
GET /api/vagas/search?checkin=2024-12-23&checkout=2024-12-26

# Invalid - Partial New Year period
GET /api/vagas/search?checkin=2024-12-28&checkout=2024-12-31

# Invalid - Custom dates during holiday period
GET /api/vagas/search?checkin=2024-12-24&checkout=2024-12-25
```

---

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
