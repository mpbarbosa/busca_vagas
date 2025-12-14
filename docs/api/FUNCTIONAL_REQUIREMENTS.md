# API Functional Requirements Documentation

**Project:** Busca Vagas API  
**Version:** 1.4.0  
**Last Updated:** December 14, 2025  
**Document Type:** Functional Requirements Specification

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Functional Requirements](#3-functional-requirements)
4. [API Endpoints](#4-api-endpoints)
5. [Data Models](#5-data-models)
6. [Business Rules](#6-business-rules)
7. [External Integrations](#7-external-integrations)
8. [Performance Requirements](#8-performance-requirements)
9. [Security Requirements](#9-security-requirements)
10. [Error Handling](#10-error-handling)

---

## 1. Introduction

### 1.1 Purpose

This document describes the functional requirements for the Busca Vagas API, a RESTful API designed to manage and search job vacancies in union hotels affiliated with AFPESP (Associação dos Funcionários Públicos do Estado de São Paulo).

### 1.2 Scope

The API provides:

- Hotel information management (list, search, cache)
- Vacancy search and management (CRUD operations)
- Automated web scraping for real-time vacancy data
- Integration with AFPESP website for availability checks

### 1.3 Definitions and Acronyms

- **API**: Application Programming Interface
- **CRUD**: Create, Read, Update, Delete
- **REST**: Representational State Transfer
- **AFPESP**: Associação dos Funcionários Públicos do Estado de São Paulo
- **TTL**: Time To Live (cache expiration)
- **Puppeteer**: Headless browser automation library

---

## 2. System Overview

### 2.1 Architecture

The API follows a layered architecture pattern:

```text
┌─────────────────────────────────────┐
│  Client Applications                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  API Routes (Express.js)            │
│  - /api/vagas                       │
│  - /api/vagas/hoteis                │
│  - /api/vagas/search                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Controllers                        │
│  - vagasController.js               │
│  - vagasControllerPuppeteer.js      │
│  - hoteisController.js              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Services (Business Logic)          │
│  - vagasService.js                  │
│  - hoteisService.js                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  External Systems & Cache           │
│  - AFPESP Website                   │
│  - In-Memory Cache                  │
│  - Puppeteer Browser Automation     │
└─────────────────────────────────────┘
```

### 2.2 Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Browser Automation**: Puppeteer (primary), Selenium WebDriver (legacy)
- **Testing**: Jest, Supertest
- **Code Quality**: ESLint
- **Dependencies**: CORS, dotenv

---

## 3. Functional Requirements

### 3.1 Hotel Management

#### FR-01: List All Hotels

**Description**: System shall provide a list of all available union hotels.

**Priority**: High

**Requirements**:

- REQ-01.1: Return hotels from cache if available
- REQ-01.2: Return default hotel list if cache is empty
- REQ-01.3: Include hotel ID, name, type, and description
- REQ-01.4: Support both static and dynamically scraped hotel lists

**Acceptance Criteria**:

- Returns HTTP 200 with hotel list
- Response includes count of hotels
- Hotels include all required fields

---

#### FR-02: Get Hotel by ID

**Description**: System shall retrieve detailed information for a specific hotel by its ID.

**Priority**: Medium

**Requirements**:

- REQ-02.1: Accept hotel ID as path parameter
- REQ-02.2: Return hotel details if found
- REQ-02.3: Return 404 error if hotel not found
- REQ-02.4: Search in cached list first, then default list

**Acceptance Criteria**:

- Returns HTTP 200 with hotel data when found
- Returns HTTP 404 when hotel does not exist
- Response matches hotel data structure

---

#### FR-03: Scrape Hotels from AFPESP Website

**Description**: System shall scrape the AFPESP website to retrieve the current list of available hotels from the dropdown menu.

**Priority**: High

**Requirements**:

- REQ-03.1: Connect to AFPESP reservations page
- REQ-03.2: Extract options from `ddlHoteis` dropdown element
- REQ-03.3: Transform raw options into standardized format
- REQ-03.4: Cache results automatically with configurable TTL
- REQ-03.5: Support force refresh to bypass cache
- REQ-03.6: Use headless browser mode for efficiency
- REQ-03.7: Handle network timeouts gracefully
- REQ-03.8: Close browser properly after scraping

**Acceptance Criteria**:

- Successfully extracts 24+ hotels
- Includes "Todos" (All) option
- Caches results for 24 hours by default
- Returns HTTP 200 with scraped data
- Handles errors with descriptive messages

---

#### FR-04: Hotel Cache Management

**Description**: System shall provide cache management capabilities for hotel data.

**Priority**: Medium

**Requirements**:

- REQ-04.1: Store hotel list in memory cache
- REQ-04.2: Set configurable TTL (default: 24 hours)
- REQ-04.3: Provide cache information endpoint
- REQ-04.4: Allow manual cache clearing
- REQ-04.5: Calculate and display cache expiration time

**Acceptance Criteria**:

- Cache persists across multiple requests
- TTL can be configured via environment variable
- Cache info shows remaining time
- Cache can be cleared via DELETE request

---

### 3.2 Vacancy Management

#### FR-05: List All Vacancies

**Description**: System shall list all job vacancies.

**Priority**: High

**Requirements**:

- REQ-05.1: Return all stored vacancies
- REQ-05.2: Support pagination (future enhancement)
- REQ-05.3: Return empty array if no vacancies exist

**Acceptance Criteria**:

- Returns HTTP 200 with vacancy array
- Response includes vacancy count
- Empty array returned when no data

---

#### FR-06: Get Vacancy by ID

**Description**: System shall retrieve a specific vacancy by its ID.

**Priority**: Medium

**Requirements**:

- REQ-06.1: Accept vacancy ID as path parameter
- REQ-06.2: Return vacancy details if found
- REQ-06.3: Return 404 if vacancy not found

**Acceptance Criteria**:

- Returns HTTP 200 with vacancy data
- Returns HTTP 404 for non-existent vacancy
- Response includes all vacancy fields

---

#### FR-07: Create New Vacancy

**Description**: System shall allow creation of new job vacancies.

**Priority**: Medium

**Requirements**:

- REQ-07.1: Accept vacancy data in request body
- REQ-07.2: Validate required fields (title, hotel, sindicato)
- REQ-07.3: Return validation errors if data is invalid
- REQ-07.4: Generate unique ID for new vacancy
- REQ-07.5: Store vacancy in system

**Acceptance Criteria**:

- Returns HTTP 201 on successful creation
- Returns HTTP 400 for invalid data
- Validates all required fields
- Returns created vacancy with ID

---

#### FR-08: Update Existing Vacancy

**Description**: System shall allow updating of existing vacancies.

**Priority**: Medium

**Requirements**:

- REQ-08.1: Accept vacancy ID as path parameter
- REQ-08.2: Accept partial update data in request body
- REQ-08.3: Validate update data
- REQ-08.4: Return 404 if vacancy not found
- REQ-08.5: Apply updates to existing vacancy

**Acceptance Criteria**:

- Returns HTTP 200 on successful update
- Returns HTTP 404 if vacancy doesn't exist
- Returns HTTP 400 for invalid data
- Only updates provided fields

---

#### FR-09: Delete Vacancy

**Description**: System shall allow deletion of vacancies.

**Priority**: Low

**Requirements**:

- REQ-09.1: Accept vacancy ID as path parameter
- REQ-09.2: Verify vacancy exists before deletion
- REQ-09.3: Remove vacancy from system
- REQ-09.4: Return 404 if vacancy not found

**Acceptance Criteria**:

- Returns HTTP 200 on successful deletion
- Returns HTTP 404 if vacancy doesn't exist
- Vacancy no longer accessible after deletion

---

### 3.3 Automated Vacancy Search

#### FR-10: Search Vacancies by Date Range

**Description**: System shall search for available vacancies using automated browser interaction with AFPESP website.

**Priority**: High

**Requirements**:

- REQ-10.1: Accept check-in date (required, format: YYYY-MM-DD)
- REQ-10.2: Accept check-out date (required, format: YYYY-MM-DD)
- REQ-10.3: Accept hotel name/ID (optional, default: "Todos")
- REQ-10.4: Validate date format and logic
- REQ-10.5: Navigate to AFPESP reservations page
- REQ-10.6: Fill date fields automatically
- REQ-10.7: Select specified hotel from dropdown
- REQ-10.8: Submit search form
- REQ-10.9: Wait for results to load completely
- REQ-10.10: Extract availability data from results
- REQ-10.11: Handle progressive loading of results
- REQ-10.12: Parse and structure vacancy data
- REQ-10.13: Use headless mode for efficiency

**Acceptance Criteria**:

- Validates date parameters
- Returns HTTP 400 for invalid dates
- Returns HTTP 200 with vacancy results
- Handles "no vacancies" scenario gracefully
- Closes browser after search
- Completes search in under 10 seconds
- Extracts all loaded vacancy data

---

#### FR-11: Search Weekend Vacancies

**Description**: System shall search for vacancies across multiple upcoming weekends.

**Priority**: Medium

**Requirements**:

- REQ-11.1: Calculate next N weekends automatically
- REQ-11.2: Execute separate search for each weekend
- REQ-11.3: Aggregate results from all weekends
- REQ-11.4: Include weekend date range in results
- REQ-11.5: Handle partial failures gracefully
- REQ-11.6: Optimize browser reuse across searches

**Acceptance Criteria**:

- Searches at least 4 upcoming weekends
- Returns aggregated results
- Includes metadata for each weekend
- Completes all searches within reasonable time
- Handles failures without crashing

---

### 3.4 System Health and Monitoring

#### FR-12: Health Check

**Description**: System shall provide a health check endpoint for monitoring.

**Priority**: High

**Requirements**:

- REQ-12.1: Respond quickly to health checks
- REQ-12.2: Indicate operational status
- REQ-12.3: Return HTTP 200 when healthy
- REQ-12.4: Include API version information

**Acceptance Criteria**:

- Responds in under 100ms
- Returns consistent status format
- Always available unless server is down

---

#### FR-13: API Information

**Description**: System shall provide basic API information at root endpoint.

**Priority**: Low

**Requirements**:

- REQ-13.1: Display API name and version
- REQ-13.2: List available endpoints
- REQ-13.3: Provide documentation links

**Acceptance Criteria**:

- Returns HTTP 200 at root path
- Includes version number
- Lists main endpoint categories

---

## 4. API Endpoints

### 4.1 Endpoint Summary

| Method | Endpoint | Description | Priority |
|--------|----------|-------------|----------|
| GET | `/api/health` | Health check | High |
| GET | `/` | API information | Low |
| GET | `/api/vagas` | List all vacancies | High |
| GET | `/api/vagas/:id` | Get vacancy by ID | Medium |
| POST | `/api/vagas` | Create vacancy | Medium |
| PUT | `/api/vagas/:id` | Update vacancy | Medium |
| DELETE | `/api/vagas/:id` | Delete vacancy | Low |
| GET | `/api/vagas/hoteis` | List hotels | High |
| GET | `/api/vagas/hoteis/:id` | Get hotel by ID | Medium |
| GET | `/api/vagas/hoteis/scrape` | Scrape hotel list | High |
| GET | `/api/vagas/hoteis/cache` | Get cache info | Low |
| DELETE | `/api/vagas/hoteis/cache` | Clear cache | Low |
| GET | `/api/vagas/search` | Search by dates (Puppeteer) | High |
| GET | `/api/vagas/search/weekends` | Search weekends | Medium |
| GET | `/api/vagas/search/selenium` | Search by dates (Selenium legacy) | Low |

### 4.2 Request/Response Examples

#### Example 1: List Hotels

**Request:**

```http
GET /api/vagas/hoteis HTTP/1.1
Host: localhost:3005
```

**Response:**

```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": 1,
      "hotelId": "-1",
      "name": "Todos",
      "type": "All",
      "description": "All hotels"
    },
    {
      "id": 2,
      "hotelId": "4007",
      "name": "Amparo",
      "type": "Hotel",
      "description": "Hotel Amparo"
    }
  ]
}
```

#### Example 2: Search Vacancies by Date

**Request:**

```http
GET /api/vagas/search?checkin=2025-12-25&checkout=2025-12-27&hotel=Amparo HTTP/1.1
Host: localhost:3005
```

**Response:**

```json
{
  "success": true,
  "query": {
    "checkin": "2025-12-25",
    "checkout": "2025-12-27",
    "hotel": "Amparo"
  },
  "results": {
    "found": true,
    "vacancies": [
      {
        "hotel": "Amparo",
        "hotelId": "4007",
        "date": "2025-12-25",
        "available": true,
        "spaces": 5
      }
    ]
  },
  "metadata": {
    "searchTime": "3.2s",
    "method": "Puppeteer"
  }
}
```

#### Example 3: Create Vacancy

**Request:**

```http
POST /api/vagas HTTP/1.1
Host: localhost:3005
Content-Type: application/json

{
  "titulo": "Recepcionista",
  "descricao": "Vaga para recepcionista",
  "hotel": "Amparo",
  "hotelId": "4007",
  "sindicato": "AFPESP",
  "dataInicio": "2025-12-25",
  "dataFim": "2025-12-27"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Vaga criada com sucesso",
  "data": {
    "id": "abc123",
    "titulo": "Recepcionista",
    "hotel": "Amparo",
    "status": "disponivel"
  }
}
```

---

## 5. Data Models

### 5.1 Hotel Model

```typescript
interface Hotel {
  id: number;              // Internal sequential ID
  hotelId: string;         // AFPESP hotel ID (e.g., "4007")
  name: string;            // Hotel name
  type: "Hotel" | "All";   // Hotel type
  description?: string;    // Optional description
}
```

**Constraints**:

- `id`: Positive integer, unique
- `hotelId`: String, AFPESP identifier
- `name`: Non-empty string
- `type`: Enum value

### 5.2 Vacancy Model

```typescript
interface Vacancy {
  id: string;              // Unique identifier
  titulo: string;          // Job title (required)
  descricao?: string;      // Job description
  hotel: string;           // Hotel name (required)
  hotelId?: string;        // Hotel ID reference
  sindicato: string;       // Union name (required)
  sindicatoId?: string;    // Union ID
  dataInicio?: string;     // Start date (ISO 8601)
  dataFim?: string;        // End date (ISO 8601)
  vagas?: number;          // Number of positions
  status?: string;         // Status (default: "disponivel")
}
```

**Constraints**:

- `id`: Unique string
- `titulo`: Required, non-empty
- `hotel`: Required, non-empty
- `sindicato`: Required, non-empty
- `vagas`: Non-negative integer
- `dataInicio`, `dataFim`: ISO 8601 format

### 5.3 Search Query Model

```typescript
interface SearchQuery {
  checkin: string;         // Check-in date (YYYY-MM-DD)
  checkout: string;        // Check-out date (YYYY-MM-DD)
  hotel?: string;          // Hotel name or "Todos"
}
```

**Constraints**:

- `checkin`: Required, valid date format
- `checkout`: Required, valid date format, after check-in
- `hotel`: Optional, defaults to "Todos"

### 5.4 Cache Info Model

```typescript
interface CacheInfo {
  cached: boolean;         // Whether data is cached
  ttlMs: number | null;    // Remaining TTL in milliseconds
  ttlHours: string | null; // Remaining TTL in hours (formatted)
  expiresAt: string | null;// Expiration timestamp (ISO 8601)
  cacheTTLMs: number;      // Configured TTL in milliseconds
  cacheTTLHours: number;   // Configured TTL in hours
}
```

---

## 6. Business Rules

### 6.1 Hotel Management Rules

**BR-01**: Hotels must have unique internal IDs  
**BR-02**: Hotel list cache expires after 24 hours by default  
**BR-03**: Scraped hotel list takes precedence over default list  
**BR-04**: "Todos" option represents all hotels combined  
**BR-05**: Hotel scraping should be rate-limited to prevent abuse

### 6.2 Vacancy Management Rules

**BR-06**: All vacancies must be associated with a valid hotel  
**BR-07**: All vacancies must be associated with a union (sindicato)  
**BR-08**: Check-out date must be after check-in date  
**BR-09**: Dates must be in future or present  
**BR-10**: Vacancy title is mandatory  
**BR-11**: Status defaults to "disponivel" if not specified

### 6.3 Search Rules

**BR-12**: Searches must specify both check-in and check-out dates  
**BR-13**: Date format must be YYYY-MM-DD  
**BR-14**: Maximum date range is 365 days  
**BR-15**: Weekend searches default to next 4 weekends  
**BR-16**: Search results show all progressively loaded data  
**BR-17**: Browser sessions must be cleaned up after search

### 6.3.1 Booking Rules

**BR-18**: During the New Year and New Year parties, reservation periods are pre-defined in the format of closed packages, as follows:

- **Christmas package**: from December 22nd to December 27th
- **New Year package**: from December 27th to January 2nd

**BR-19**: During these holiday periods (Christmas and New Year packages), reservations cannot be made on different dates than the pre-defined package dates

### 6.4 Performance Rules

**BR-20**: API responses should complete within 5 seconds (non-search)  
**BR-21**: Search operations should complete within 15 seconds  
**BR-22**: Browser automation should use headless mode  
**BR-23**: Cache should be used to minimize external requests  
**BR-24**: Connection pooling for concurrent searches

---

## 7. External Integrations

### 7.1 AFPESP Website Integration

**Integration Point**: https://associadoh.afpesp.org.br/Servicos/Reservas/Vagas-disponiveis.aspx

**Purpose**: 

- Scrape hotel dropdown list
- Search for vacancy availability
- Extract real-time data

**Requirements**:

- REQ-EI-01: Handle dynamic content loading
- REQ-EI-02: Wait for JavaScript execution
- REQ-EI-03: Handle network timeouts (30 seconds)
- REQ-EI-04: Implement retry logic for transient failures
- REQ-EI-05: Respect website rate limits
- REQ-EI-06: Handle CAPTCHA or anti-bot measures

**Data Extracted**:

- Hotel dropdown options (`ddlHoteis`)
- Availability calendar data
- Vacancy information per date
- Progressive loading results

### 7.2 Browser Automation (Puppeteer)

**Version**: Latest stable

**Configuration**:

- Headless mode: Enabled by default
- Executable path: `/usr/bin/google-chrome-stable`
- Viewport: 1280x800
- Timeout: 30 seconds for navigation
- Wait condition: `networkidle2`

**Security Flags**:

- `--no-sandbox`
- `--disable-setuid-sandbox`
- `--disable-dev-shm-usage`
- `--disable-gpu`

---

## 8. Performance Requirements

### 8.1 Response Time Requirements

| Operation | Target | Maximum |
|-----------|--------|---------|
| Health check | < 50ms | 100ms |
| List hotels (cached) | < 100ms | 500ms |
| Get hotel by ID | < 100ms | 500ms |
| Vacancy CRUD operations | < 500ms | 2s |
| Hotel scraping | < 5s | 15s |
| Vacancy search (single) | < 5s | 15s |
| Weekend search (4 weekends) | < 30s | 60s |

### 8.2 Resource Requirements

**Memory**:

- Base API: < 100 MB
- Per Puppeteer instance: ~180 MB
- Maximum concurrent searches: 3

**CPU**:

- Idle: < 5%
- Under load: < 80%

**Network**:

- Bandwidth: Minimal (mostly HTML scraping)
- Concurrent connections: Up to 3 browser instances

### 8.3 Scalability Requirements

- Support 100 concurrent API requests (non-search)
- Support 5 concurrent search operations
- Handle 1000 requests per hour
- Cache reduces load by 90% for hotel lists

---

## 9. Security Requirements

### 9.1 API Security

**SEC-01**: Enable CORS with configurable origins  
**SEC-02**: Validate all input parameters  
**SEC-03**: Sanitize user inputs to prevent injection  
**SEC-04**: Return appropriate HTTP status codes  
**SEC-05**: Do not expose internal error details to clients  
**SEC-06**: Log security-relevant events

### 9.2 Browser Automation Security

**SEC-07**: Use headless mode to prevent GUI exposure  
**SEC-08**: Run browser with minimal privileges (sandbox flags)  
**SEC-09**: Close browser sessions promptly  
**SEC-10**: Do not store sensitive data in browser  
**SEC-11**: Implement request rate limiting  
**SEC-12**: Validate scraped data before use

### 9.3 Data Security

**SEC-13**: Do not log sensitive user data  
**SEC-14**: Use environment variables for configuration  
**SEC-15**: Do not commit secrets to version control  
**SEC-16**: Implement input validation at all entry points

---

## 10. Error Handling

### 10.1 HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET/PUT/DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input/parameters |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server/application error |
| 503 | Service Unavailable | External service failure |

### 10.2 Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "details": {
    "field": "Specific error details",
    "code": "ERROR_CODE"
  }
}
```

### 10.3 Common Error Scenarios

#### ERR-01: Invalid Date Format

```json
{
  "success": false,
  "error": "Invalid date format. Use YYYY-MM-DD",
  "details": {
    "field": "checkin",
    "provided": "25-12-2025",
    "expected": "2025-12-25"
  }
}
```

#### ERR-02: Hotel Not Found

```json
{
  "success": false,
  "error": "Hotel não encontrado",
  "details": {
    "hotelId": "999"
  }
}
```

#### ERR-03: Scraping Failure

```json
{
  "success": false,
  "error": "Failed to scrape hotel list",
  "details": {
    "reason": "Timeout waiting for page load",
    "url": "https://associadoh.afpesp.org.br/..."
  }
}
```

#### ERR-04: Validation Error

```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "errors": [
      "Título é obrigatório",
      "Hotel é obrigatório"
    ]
  }
}
```

### 10.4 Retry Logic

**Browser Operations**:

- Retry up to 3 times on transient failures
- Exponential backoff: 1s, 2s, 4s
- Do not retry on validation errors

**External Requests**:

- Network timeout: 30 seconds
- Retry on 503 errors
- Fail fast on 400/404 errors

---

## Appendix A: Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-14 | System | Initial functional requirements document |

---

## Appendix B: Related Documents

- [API Documentation](./API.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [Data Flow Documentation](./DATA_FLOW_DOCUMENTATION.md)
- [Puppeteer Implementation](../PUPPETEER_IMPLEMENTATION.md)
- [Testing Documentation](../PUPPETEER_TEST_SUITE_SUMMARY.md)

---

**End of Document**
