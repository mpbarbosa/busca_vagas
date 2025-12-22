# Busca Vagas API - Client Documentation

**Version:** 1.5.0  
**Last Updated:** 2025-12-21  
**Status:** Current

## 📚 Table of Contents

- [1. Overview](#1-overview)
- [2. Getting Started](#2-getting-started)
- [3. Authentication](#3-authentication)
- [4. Base URL](#4-base-url)
- [5. Response Format](#5-response-format)
- [6. Error Handling](#6-error-handling)
- [7. Rate Limiting](#7-rate-limiting)
- [8. Endpoints](#8-endpoints)
  - [8.1. Health Check](#81-health-check)
  - [8.2. Hotels](#82-hotels)
  - [8.3. Vacancy Search](#83-vacancy-search)
  - [8.4. Vacancy Management (CRUD)](#84-vacancy-management-crud)
- [9. Code Examples](#9-code-examples)
- [10. Best Practices](#10-best-practices)
- [11. Changelog](#11-changelog)

---

## 1. Overview

The **Busca Vagas API** is a RESTful API designed for searching and managing hotel vacancies in union hotels (AFPESP). The API provides automated vacancy search capabilities using web scraping technology and standard CRUD operations for vacancy management.

### 1.1. Key Features

- 🔍 **Automated Vacancy Search** - Search hotel availability by date range using Puppeteer (optimized)
- 🏨 **Hotel Information** - Get lists of available hotels with details
- 🔄 **CRUD Operations** - Create, read, update, and delete vacancy records
- 🌐 **CORS Enabled** - Cross-origin requests supported
- 📊 **JSON Responses** - All responses in JSON format
- ⚡ **High Performance** - Optimized with Puppeteer (40-60% resource savings vs Selenium)

### 1.2. Version Information

- **Current Version:** 1.5.0
- **API Type:** REST
- **Data Format:** JSON
- **Protocol:** HTTP/HTTPS
- **Semantic Versioning:** Yes (MAJOR.MINOR.PATCH)

#### Version History

- **1.5.0** (2025-12-21) - Added `applyBookingRules` parameter to bypass holiday booking restrictions
- **1.4.0** (2025-12-14) - Implemented holiday booking rules (BR-18, BR-19)
- **1.3.0** (2025-12-02) - Added `hotel` parameter to `/api/vagas/search` endpoint
- **1.2.1** (2024) - Puppeteer implementation refinements
- **1.2.0** (2024) - Puppeteer integration for improved performance
- **1.1.0** (2024) - Initial Selenium-based implementation
- **1.0.0** (2024) - Initial release

---

## 2. Getting Started

### 2.1. Prerequisites

To use this API, you need:

- Basic knowledge of HTTP/REST APIs
- An HTTP client (curl, Postman, axios, fetch, etc.)
- Network access to the API server

### 2.2. Quick Start

```bash
# Check if API is running
curl http://localhost:3000/api/health

# Search for vacancies
curl "http://localhost:3000/api/vagas/search?checkin=2024-12-25&checkout=2024-12-26"

# Get hotel list
curl http://localhost:3000/api/vagas/hoteis
```

---

## 3. Authentication

**Current Status:** No authentication required

The API is currently open and does not require authentication. Future versions may implement:

- API Key authentication
- JWT tokens
- OAuth 2.0

---

## 4. Base URL

### 4.1. Development

```url
http://localhost:3000
```

### 4.2. Production

```url
https://www.mpbarbosa.com
```

All API endpoints are prefixed with `/api`:

```url
http://localhost:3000/api
```

---

## 5. Response Format

### 5.1. Success Response

All successful responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### 5.2. Error Response

Error responses include:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### 5.3. Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error occurred |

---

## 6. Error Handling

### 6.1. Error Response Structure

```json
{
  "success": false,
  "error": "Detailed error message",
  "code": "ERROR_CODE"
}
```

### 6.2. Common Errors

#### 6.2.1. 400 - Bad Request

```json
{
  "error": "Both checkin and checkout parameters are required",
  "example": "/api/vagas/search?checkin=2024-12-25&checkout=2024-12-26"
}
```

#### 6.2.2. 404 - Not Found

```json
{
  "success": false,
  "error": "Hotel não encontrado"
}
```

#### 6.2.3. 500 - Internal Server Error

```json
{
  "success": false,
  "error": "Erro ao buscar vagas",
  "method": "puppeteer"
}
```

---

## 7. Rate Limiting

**Current Status:** No rate limiting implemented

**Recommendations:**

- Be respectful with request frequency
- The vacancy search endpoints perform web scraping and may take 20-60 seconds
- Weekend search may take up to 10 minutes
- Avoid concurrent requests to search endpoints

---

## 8. Endpoints

### 8.1. Health Check

#### 8.1.1. Check API Status

**Endpoint:** `GET /api/health`

**Description:** Verify if the API is running and get system information.

**Parameters:** None

**Response:**

```json
{
  "status": "OK",
  "message": "API está funcionando",
  "version": "1.2.0",
  "name": "busca_vagas_api",
  "uptime": 3600.5,
  "timestamp": "2024-12-02T04:30:00.000Z"
}
```

**Example:**

```bash
curl http://localhost:3000/api/health
```

---

### 8.2. Hotels

#### 8.2.1. List All Hotels (Static)

**Endpoint:** `GET /api/vagas/hoteis`

**Description:** Get a list of available hotels from static data.

**Parameters:** None

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

**Example:**

```bash
curl http://localhost:3000/api/vagas/hoteis
```

---

#### 8.2.2. Get Hotel by ID

**Endpoint:** `GET /api/vagas/hoteis/:id`

**Description:** Get details of a specific hotel by ID.

**Parameters:**

| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| id | integer | path | Yes | Hotel ID |

**Response (200 OK):**

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

**Response (404 Not Found):**

```json
{
  "success": false,
  "error": "Hotel não encontrado"
}
```

**Example:**

```bash
curl http://localhost:3000/api/vagas/hoteis/1
```

---

#### 8.2.3. Scrape Hotel List from AFPESP

**Endpoint:** `GET /api/vagas/hoteis/scrape`

**Description:** Scrape the current list of hotels from the AFPESP website in real-time. Returns **all** dropdown options including "Todos" (all hotels).

**Technology:** Puppeteer (headless browser)

**Parameters:** None

**Response Time:** 5-15 seconds

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

**Available Hotels (24 total):**

| Hotel Name | Hotel ID |
|------------|----------|
| Amparo | 4007 |
| Appenzell | 4003 |
| Areado | 4001 |
| Avaré | 4002 |
| Boraceia | 4024 |
| Campos do Jordão | 4004 |
| Caraguatatuba | 4013 |
| Fazenda Ibirá | 4023 |
| Guarujá | 4014 |
| Itanhaém | 4015 |
| Lindoia | 4008 |
| Maresias | 4018 |
| Monte Verde | 4005 |
| Peruíbe I | 4021 |
| Peruíbe II | 4022 |
| Poços de Caldas | 4006 |
| Saha | 4020 |
| São Lourenço | 4019 |
| São Pedro | 4011 |
| Serra Negra | 4009 |
| Socorro | 4010 |
| Termas de Ibirá | 4012 |
| Ubatuba | 4016 |
| Unidade Capital | 4017 |

**Example:**

```bash
curl http://localhost:3000/api/vagas/hoteis/scrape
```

**Note:** This endpoint performs real-time web scraping and may take several seconds to respond.

---

### 8.3. Vacancy Search

#### 8.3.1. Search Vacancies by Date Range (Recommended)

**Endpoint:** `GET /api/vagas/search`

**Description:** Search for hotel vacancies by check-in and check-out dates using optimized Puppeteer automation.

**Technology:** Puppeteer (headless mode enforced)

**Performance:** 40-60% resource savings compared to Selenium

**Parameters:**

| Name     | Type   | Location | Required | Format     | Description                            |
|----------|--------|----------|----------|------------|----------------------------------------|
| checkin  | string | query    | Yes      | YYYY-MM-DD | Check-in date                          |
| checkout | string | query    | Yes      | YYYY-MM-DD | Check-out date (must be after checkin) |
| hotel    | string | query    | No       | string     | Hotel name or "Todas" for all hotels (default: "Todas") |

**Response Time:** 20-60 seconds (depending on hotel availability)

**Response:**

```json
{
  "success": true,
  "method": "puppeteer",
  "headlessMode": true,
  "resourceSavings": "40-60% compared to Selenium",
  "data": {
    "success": true,
    "date": "12/25/2024",
    "hasAvailability": true,
    "result": {
      "checkInDate": "12/25/2024",
      "checkOutDate": "12/26/2024",
      "hasAvailability": true,
      "summary": "10 hotels with availability",
      "hotelGroups": {
        "Appenzell": [
          "Standard Room - 2 pessoas",
          "Deluxe Room - 3 pessoas"
        ],
        "Campos do Jordão": [
          "Suite Master - 2 pessoas"
        ]
      },
      "allVacancies": [
        "Appenzell - Standard Room - 2 pessoas",
        "Appenzell - Deluxe Room - 3 pessoas",
        "Campos do Jordão - Suite Master - 2 pessoas"
      ]
    }
  }
}
```

**Response (No Availability):**

```json
{
  "success": true,
  "method": "puppeteer",
  "headlessMode": true,
  "resourceSavings": "40-60% compared to Selenium",
  "data": {
    "success": true,
    "date": "12/25/2024",
    "hasAvailability": false,
    "result": {
      "checkInDate": "12/25/2024",
      "checkOutDate": "12/26/2024",
      "hasAvailability": false,
      "summary": "No hotels with availability"
    }
  }
}
```

**Error Response (400):**

```json
{
  "error": "Both checkin and checkout parameters are required",
  "example": "/api/vagas/search?checkin=2024-12-25&checkout=2024-12-26"
}
```

**Error Response (500):**

```json
{
  "success": false,
  "error": "Invalid date provided. Please check the date format.",
  "method": "puppeteer"
}
```

**Examples:**

```bash
# Basic search (all hotels)
curl "http://localhost:3000/api/vagas/search?checkin=2024-12-25&checkout=2024-12-26"

# Search for specific hotel
curl "http://localhost:3000/api/vagas/search?checkin=2024-12-25&checkout=2024-12-26&hotel=Appenzell"

# Search for New Year's weekend (all hotels)
curl "http://localhost:3000/api/vagas/search?checkin=2024-12-31&checkout=2025-01-02&hotel=Todas"
```

**Important Notes:**

- Always runs in headless mode for optimal performance
- The checkout date must be after the checkin date
- By default searches all available hotels in the AFPESP system
- Use the `hotel` parameter to filter by specific hotel name
- Response may take 20-60 seconds due to web scraping automation
- Date format must be YYYY-MM-DD (ISO 8601)

---

#### 8.3.2. Search Weekend Vacancies

**Endpoint:** `GET /api/vagas/search/weekends`

**Description:** Automatically search for vacancies in all upcoming weekends (Friday-Sunday) for the next 2 months.

**Technology:** Puppeteer (headless mode)

**Parameters:** None

**Response Time:** 5-10 minutes (searches multiple weekends)

**Timeout:** 10 minutes

**Response:**

```json
{
  "success": true,
  "method": "puppeteer",
  "resourceSavings": "40-60% compared to Selenium",
  "message": "Weekend search completed",
  "note": "Check server console for detailed results"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Erro ao buscar vagas de fim de semana",
  "method": "puppeteer"
}
```

**Example:**

```bash
curl http://localhost:3000/api/vagas/search/weekends
```

**Important Notes:**

- This endpoint searches ALL weekends for the next 2 months
- Expected execution time: 5-10 minutes
- Results are logged to the server console
- Best used for batch/scheduled operations
- Consider implementing webhook or polling for long-running operations

---

#### 8.3.3. Search Vacancies (Legacy Selenium)

**Endpoint:** `GET /api/vagas/search/selenium`

**Description:** Legacy endpoint using Selenium WebDriver. Kept for backward compatibility.

**Technology:** Selenium WebDriver

**Status:** Deprecated (use `/api/vagas/search` instead)

**Parameters:**

| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| checkin | string | query | Yes | Check-in date (YYYY-MM-DD) |
| checkout | string | query | Yes | Check-out date (YYYY-MM-DD) |
| headless | boolean | query | No | Run in headless mode (default: true) |

**Example:**

```bash
curl "http://localhost:3000/api/vagas/search/selenium?checkin=2024-12-25&checkout=2024-12-26"
```

**Migration Notice:**

⚠️ **Deprecated:** This endpoint is maintained for backward compatibility only. New integrations should use `/api/vagas/search` which offers:

- 40-60% better resource efficiency
- Faster execution times
- Better stability in CI/CD environments

---

### 8.4. Vacancy Management (CRUD)

#### 8.4.1. List All Vacancies

**Endpoint:** `GET /api/vagas`

**Description:** List all vacancy records (placeholder - returns empty array).

**Parameters:** None

**Response:**

```json
{
  "vagas": []
}
```

**Example:**

```bash
curl http://localhost:3000/api/vagas
```

**Note:** This endpoint is a placeholder. Implementation pending.

---

#### 8.4.2. Get Vacancy by ID

**Endpoint:** `GET /api/vagas/:id`

**Description:** Get details of a specific vacancy by ID (placeholder).

**Parameters:**

| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| id | string | path | Yes | Vacancy ID |

**Response:**

```json
{
  "id": "123",
  "message": "Vaga não implementada"
}
```

**Example:**

```bash
curl http://localhost:3000/api/vagas/123
```

**Note:** This endpoint is a placeholder. Implementation pending.

---

#### 8.4.3. Create New Vacancy

**Endpoint:** `POST /api/vagas`

**Description:** Create a new vacancy record (placeholder).

**Content-Type:** application/json

**Request Body:**

```json
{
  "titulo": "Recepcionista",
  "descricao": "Vaga para recepcionista de hotel",
  "hotel": "Hotel Appenzell",
  "sindicato": "AFPESP",
  "localizacao": "São Paulo, SP",
  "salario": 2500,
  "requisitos": [
    "Ensino médio completo",
    "Experiência em hotelaria"
  ]
}
```

**Response (201 Created):**

```json
{
  "message": "Vaga criada com sucesso"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/vagas \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Recepcionista",
    "descricao": "Vaga para recepcionista de hotel",
    "hotel": "Hotel Appenzell",
    "localizacao": "São Paulo, SP",
    "salario": 2500
  }'
```

**Note:** This endpoint is a placeholder. Implementation pending.

---

#### 8.4.4. Update Vacancy

**Endpoint:** `PUT /api/vagas/:id`

**Description:** Update an existing vacancy record (placeholder).

**Content-Type:** application/json

**Parameters:**

| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| id | string | path | Yes | Vacancy ID |

**Request Body:**

```json
{
  "titulo": "Recepcionista Senior",
  "salario": 3500,
  "requisitos": [
    "Ensino médio completo",
    "5 anos de experiência"
  ]
}
```

**Response:**

```json
{
  "message": "Vaga atualizada com sucesso"
}
```

**Example:**

```bash
curl -X PUT http://localhost:3000/api/vagas/123 \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Recepcionista Senior",
    "salario": 3500
  }'
```

**Note:** This endpoint is a placeholder. Implementation pending.

---

#### 8.4.5. Delete Vacancy

**Endpoint:** `DELETE /api/vagas/:id`

**Description:** Delete a vacancy record (placeholder).

**Parameters:**

| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| id | string | path | Yes | Vacancy ID |

**Response:**

```json
{
  "message": "Vaga removida com sucesso"
}
```

**Example:**

```bash
curl -X DELETE http://localhost:3000/api/vagas/123
```

**Note:** This endpoint is a placeholder. Implementation pending.

---

## 9. Code Examples

### 9.1. JavaScript (Fetch API)

```javascript
// Health check
async function checkHealth() {
  const response = await fetch('http://localhost:3000/api/health');
  const data = await response.json();
  console.log(data);
}

// Search vacancies
async function searchVacancies(checkin, checkout) {
  const url = `http://localhost:3000/api/vagas/search?checkin=${checkin}&checkout=${checkout}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.success && data.data.hasAvailability) {
      console.log('Vacancies found!');
      console.log(data.data.result.hotelGroups);
    } else {
      console.log('No vacancies available');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Get hotels
async function getHotels() {
  const response = await fetch('http://localhost:3000/api/vagas/hoteis');
  const data = await response.json();
  console.log(`Found ${data.count} hotels:`, data.data);
}

// Usage
checkHealth();
searchVacancies('2024-12-25', '2024-12-26');
getHotels();
```

---

### 9.2. JavaScript (Axios)

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// Search vacancies
async function searchVacancies(checkin, checkout) {
  try {
    const response = await axios.get(`${API_BASE}/vagas/search`, {
      params: { checkin, checkout }
    });
    
    if (response.data.success) {
      console.log('Search successful!');
      console.log(response.data.data);
    }
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data.error);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Get hotel by ID
async function getHotel(id) {
  try {
    const response = await axios.get(`${API_BASE}/vagas/hoteis/${id}`);
    console.log(response.data.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error('Hotel not found');
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Create vacancy
async function createVacancy(vacancyData) {
  try {
    const response = await axios.post(`${API_BASE}/vagas`, vacancyData);
    console.log(response.data.message);
  } catch (error) {
    console.error('Error:', error.response?.data?.error || error.message);
  }
}

// Usage
searchVacancies('2024-12-25', '2024-12-26');
getHotel(1);
```

---

### 9.3. Python (Requests)

```python
import requests
from datetime import datetime, timedelta

API_BASE = 'http://localhost:3000/api'

def check_health():
    """Check API health status"""
    response = requests.get(f'{API_BASE}/health')
    data = response.json()
    print(f"API Status: {data['status']}")
    print(f"Version: {data['version']}")
    return data

def search_vacancies(checkin, checkout):
    """Search for vacancies by date range"""
    params = {
        'checkin': checkin,
        'checkout': checkout
    }
    
    response = requests.get(f'{API_BASE}/vagas/search', params=params)
    
    if response.status_code == 200:
        data = response.json()
        if data['success'] and data['data']['hasAvailability']:
            print(f"Vacancies found for {checkin}!")
            hotel_groups = data['data']['result']['hotelGroups']
            for hotel, rooms in hotel_groups.items():
                print(f"\n{hotel}:")
                for room in rooms:
                    print(f"  - {room}")
        else:
            print(f"No vacancies available for {checkin}")
    else:
        print(f"Error: {response.json().get('error')}")

def get_hotels():
    """Get list of all hotels"""
    response = requests.get(f'{API_BASE}/vagas/hoteis')
    data = response.json()
    
    if data['success']:
        print(f"Found {data['count']} hotels:")
        for hotel in data['data']:
            print(f"  - {hotel['name']} ({hotel['location']})")
    
    return data['data']

def scrape_hotels():
    """Scrape current hotel list from AFPESP"""
    print("Scraping hotel list... (this may take a few seconds)")
    response = requests.get(f'{API_BASE}/vagas/hoteis/scrape')
    data = response.json()
    
    if data['success']:
        print(f"Found {data['count']} hotels from {data['source']}")
        for hotel in data['data'][:5]:  # Show first 5
            print(f"  - {hotel['name']} (ID: {hotel['hotelId']})")
    
    return data['data']

# Usage examples
if __name__ == '__main__':
    # Check API health
    check_health()
    
    # Search for vacancies
    tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
    day_after = (datetime.now() + timedelta(days=2)).strftime('%Y-%m-%d')
    search_vacancies(tomorrow, day_after)
    
    # Get hotels
    get_hotels()
    
    # Scrape hotel list
    scrape_hotels()
```

---

### 9.4. cURL Examples

```bash
#!/bin/bash

# Health check
echo "=== Health Check ==="
curl -s http://localhost:3000/api/health | jq

# Get all hotels
echo -e "\n=== Get Hotels ==="
curl -s http://localhost:3000/api/vagas/hoteis | jq

# Get hotel by ID
echo -e "\n=== Get Hotel by ID ==="
curl -s http://localhost:3000/api/vagas/hoteis/1 | jq

# Scrape hotel list
echo -e "\n=== Scrape Hotels ==="
curl -s http://localhost:3000/api/vagas/hoteis/scrape | jq '.data[0:5]'

# Search vacancies
echo -e "\n=== Search Vacancies ==="
curl -s "http://localhost:3000/api/vagas/search?checkin=2024-12-25&checkout=2024-12-26" | jq

# Create vacancy
echo -e "\n=== Create Vacancy ==="
curl -s -X POST http://localhost:3000/api/vagas \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Recepcionista",
    "hotel": "Appenzell",
    "salario": 2500
  }' | jq

# Update vacancy
echo -e "\n=== Update Vacancy ==="
curl -s -X PUT http://localhost:3000/api/vagas/123 \
  -H "Content-Type: application/json" \
  -d '{
    "salario": 3000
  }' | jq

# Delete vacancy
echo -e "\n=== Delete Vacancy ==="
curl -s -X DELETE http://localhost:3000/api/vagas/123 | jq
```

---

### 9.5. TypeScript

```typescript
interface Hotel {
  id: number;
  name: string;
  location: string;
  type: string;
  description: string;
}

interface SearchResponse {
  success: boolean;
  method: string;
  headlessMode: boolean;
  resourceSavings: string;
  data: {
    success: boolean;
    date: string;
    hasAvailability: boolean;
    result?: {
      checkInDate: string;
      checkOutDate: string;
      hasAvailability: boolean;
      summary: string;
      hotelGroups?: Record<string, string[]>;
      allVacancies?: string[];
    };
  };
}

class VagasAPIClient {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
  }

  async checkHealth(): Promise<any> {
    const response = await fetch(`${this.baseURL}/health`);
    return response.json();
  }

  async getHotels(): Promise<Hotel[]> {
    const response = await fetch(`${this.baseURL}/vagas/hoteis`);
    const data = await response.json();
    return data.data;
  }

  async getHotelById(id: number): Promise<Hotel | null> {
    try {
      const response = await fetch(`${this.baseURL}/vagas/hoteis/${id}`);
      if (response.status === 404) return null;
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching hotel:', error);
      return null;
    }
  }

  async searchVacancies(
    checkin: string,
    checkout: string
  ): Promise<SearchResponse> {
    const url = `${this.baseURL}/vagas/search?checkin=${checkin}&checkout=${checkout}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Search failed');
    }
    
    return response.json();
  }

  async scrapeHotels(): Promise<any[]> {
    const response = await fetch(`${this.baseURL}/vagas/hoteis/scrape`);
    const data = await response.json();
    return data.data;
  }
}

// Usage
const client = new VagasAPIClient();

async function main() {
  // Check health
  const health = await client.checkHealth();
  console.log('API Version:', health.version);

  // Get hotels
  const hotels = await client.getHotels();
  console.log(`Found ${hotels.length} hotels`);

  // Search vacancies
  try {
    const results = await client.searchVacancies('2024-12-25', '2024-12-26');
    if (results.data.hasAvailability) {
      console.log('Vacancies available!');
      console.log(results.data.result?.hotelGroups);
    }
  } catch (error) {
    console.error('Search error:', error);
  }
}

main();
```

---

## 10. Best Practices

### 10.1. Error Handling

Always implement proper error handling:

```javascript
async function searchWithErrorHandling(checkin, checkout) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/vagas/search?checkin=${checkin}&checkout=${checkout}`
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Search failed:', error.message);
    // Implement retry logic or fallback
    return null;
  }
}
```

### 10.2. Timeout Handling

Set appropriate timeouts for long-running operations:

```javascript
async function searchWithTimeout(checkin, checkout, timeoutMs = 120000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(
      `http://localhost:3000/api/vagas/search?checkin=${checkin}&checkout=${checkout}`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeout);
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timeout');
    }
    throw error;
  }
}
```

### 10.3. Rate Limiting

Implement client-side rate limiting:

```javascript
class RateLimitedClient {
  constructor(maxRequestsPerMinute = 10) {
    this.maxRequests = maxRequestsPerMinute;
    this.requestTimes = [];
  }
  
  async request(url) {
    // Remove requests older than 1 minute
    const now = Date.now();
    this.requestTimes = this.requestTimes.filter(
      time => now - time < 60000
    );
    
    // Check if we've hit the limit
    if (this.requestTimes.length >= this.maxRequests) {
      const oldestRequest = this.requestTimes[0];
      const waitTime = 60000 - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.requestTimes.push(now);
    return fetch(url);
  }
}
```

### 10.4. Retry Logic

Implement exponential backoff for failed requests:

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      
      if (response.status >= 500) {
        // Server error, retry
        const waitTime = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // Client error, don't retry
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const waitTime = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}
```

### 10.5. Data Validation

Validate data before sending requests:

```javascript
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

async function searchVacancies(checkin, checkout) {
  if (!isValidDate(checkin) || !isValidDate(checkout)) {
    throw new Error('Invalid date format. Use YYYY-MM-DD');
  }
  
  if (new Date(checkout) <= new Date(checkin)) {
    throw new Error('Checkout date must be after checkin date');
  }
  
  // Proceed with request (implementation details omitted)
  const url = `http://localhost:3000/api/vagas/search?checkin=${checkin}&checkout=${checkout}`;
  return fetch(url);
}
```

### 10.6. Caching

Implement caching for frequently accessed data:

```javascript
class CachedAPIClient {
  constructor() {
    this.cache = new Map();
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes
  }
  
  async getHotels() {
    const cacheKey = 'hotels';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }
    
    const response = await fetch('http://localhost:3000/api/vagas/hoteis');
    const data = await response.json();
    
    this.cache.set(cacheKey, {
      data: data.data,
      timestamp: Date.now()
    });
    
    return data.data;
  }
}
```

### 10.7. Progress Tracking

For long-running operations, implement progress tracking:

```javascript
async function searchWithProgress(checkin, checkout, onProgress) {
  onProgress({ status: 'starting', progress: 0 });
  
  const response = await fetch(
    `http://localhost:3000/api/vagas/search?checkin=${checkin}&checkout=${checkout}`
  );
  
  onProgress({ status: 'fetching', progress: 50 });
  
  const data = await response.json();
  
  onProgress({ status: 'complete', progress: 100 });
  
  return data;
}

// Usage
searchWithProgress('2024-12-25', '2024-12-26', (progress) => {
  console.log(`${progress.status}: ${progress.progress}%`);
});
```

### 10.8. Booking Rules Validation

**Important:** The API has special booking rules for holiday periods. By default, dates are validated against these rules, but you can bypass them using the `applyBookingRules` parameter:

**Holiday Package Rules:**

1. **Christmas Package:** December 22nd to December 27th (5 days)
2. **New Year Package:** December 27th to January 2nd (6 days)

During these periods, reservations **must** use the exact package dates by default and cannot be made on different dates.

**Bypassing Rules:**

To search custom dates during holiday periods, add `applyBookingRules=false` to your request:

```javascript
// Search custom dates during holiday period
const response = await fetch(
  'http://localhost:3000/api/vagas/search?' +
  'checkin=2024-12-23&checkout=2024-12-26&applyBookingRules=false'
);
```

**Implementation Example:**

```javascript
function validateBookingDates(checkin, checkout, applyBookingRules = true) {
  // If rules are disabled, skip validation
  if (!applyBookingRules) {
    return true;
  }
  
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  const checkinMonth = checkinDate.getMonth();
  const checkinDay = checkinDate.getDate();
  const checkoutMonth = checkoutDate.getMonth();
  const checkoutDay = checkoutDate.getDate();
  
  // Check if dates fall within Christmas package period
  const isChristmasPeriod = 
    (checkinMonth === 11 && checkinDay >= 22 && checkinDay <= 27) ||
    (checkoutMonth === 11 && checkoutDay >= 22 && checkoutDay <= 27);
  
  // Check if dates fall within New Year package period
  const isNewYearPeriod = 
    (checkinMonth === 11 && checkinDay >= 27) ||
    (checkoutMonth === 0 && checkoutDay <= 2);
  
  if (isChristmasPeriod) {
    // Validate Christmas package dates
    const validChristmas = 
      checkinMonth === 11 && checkinDay === 22 &&
      checkoutMonth === 11 && checkoutDay === 27;
    
    if (!validChristmas) {
      throw new Error(
        'Christmas package requires check-in on Dec 22 and check-out on Dec 27. ' +
        'Use applyBookingRules=false to bypass this restriction.'
      );
    }
  }
  
  if (isNewYearPeriod) {
    // Validate New Year package dates
    const validNewYear = 
      checkinMonth === 11 && checkinDay === 27 &&
      checkoutMonth === 0 && checkoutDay === 2;
    
    if (!validNewYear) {
      throw new Error(
        'New Year package requires check-in on Dec 27 and check-out on Jan 2. ' +
        'Use applyBookingRules=false to bypass this restriction.'
      );
    }
  }
  
  return true;
}

// Usage
try {
  validateBookingDates('2024-12-22', '2024-12-27'); // Valid Christmas package
  validateBookingDates('2024-12-27', '2025-01-02'); // Valid New Year package
  validateBookingDates('2024-12-23', '2024-12-26'); // Throws error - invalid dates
  validateBookingDates('2024-12-23', '2024-12-26', false); // Valid - rules bypassed
} catch (error) {
  console.error('Booking validation failed:', error.message);
}
```

---

## 11. Changelog

### 11.1. Version 1.3.0

**Released:** December 2, 2025

**New Features:**

- ✨ Added `hotel` parameter to `/api/vagas/search` endpoint
  - Allows filtering by specific hotel name
  - Defaults to "Todas" (all hotels) for backward compatibility
  - Smart matching with case-insensitive partial name matching
  - Graceful fallback if hotel not found

**Improvements:**

- 📝 Enhanced API response with `hotelFilter` field
- 🔍 Improved hotel selection logging and debugging
- 📖 Updated documentation with hotel parameter examples

**Breaking Changes:**

- None (fully backward compatible)

**Migration Guide:**

```bash
# Old (still works)
GET /api/vagas/search?checkin=2024-12-25&checkout=2024-12-26

# New (with hotel filter)
GET /api/vagas/search?checkin=2024-12-25&checkout=2024-12-26&hotel=Appenzell
```

---

### 11.2. Version 1.2.1

**Released:** 2024

**Improvements:**

- Puppeteer implementation refinements
- Performance optimizations
- Bug fixes and stability improvements

---

### 11.3. Version 1.2.0

**Released:** December 2024

**New Features:**

- ✨ Added Puppeteer-based vacancy search (40-60% resource savings)
- ✨ Added weekend vacancy search endpoint
- ✨ Enforced headless mode for all search operations
- ✨ Added hotel scraping endpoint

**Improvements:**

- ⚡ Optimized browser automation with instance pooling
- 📊 Enhanced response format with detailed availability information
- 🔒 Improved security with enforced headless mode

**Deprecated:**

- ⚠️ Selenium-based search endpoints (use Puppeteer endpoints instead)

---

### 11.4. Version 1.1.0

**Features:**

- Added Selenium-based vacancy search
- Added basic CRUD endpoints
- Added health check endpoint

---

### 11.5. Version 1.0.0

**Initial Release:**

- Basic API structure
- Hotel listing endpoints
- Health check

---

## Support & Resources

### Documentation

- [API Reference](docs/API.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Deployment Guide](DEPLOYMENT_QUICKSTART.md)
- [Production Validation](docs/PRODUCTION_ENVIRONMENT_VALIDATION.md)

### GitHub Repository

- Repository: [https://github.com/mpbarbosa/busca_vagas](https://github.com/mpbarbosa/busca_vagas)
- Issues: [https://github.com/mpbarbosa/busca_vagas/issues](https://github.com/mpbarbosa/busca_vagas/issues)
- Releases: [https://github.com/mpbarbosa/busca_vagas/releases](https://github.com/mpbarbosa/busca_vagas/releases)

### Need Help?

- 📖 Check the [documentation](docs/)
- 🐛 Report bugs via GitHub Issues
- 💡 Request features via GitHub Issues
- 📧 Contact the development team

---

## License

This API is licensed under the ISC License. See [LICENSE](LICENSE) file for details.

---

**Last Updated:** December 2024  
**API Version:** 1.2.0  
**Document Version:** 1.0.0
