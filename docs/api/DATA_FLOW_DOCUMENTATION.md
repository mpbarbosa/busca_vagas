# Hotel Vacancy Search API - Data Flow Documentation

## Overview

This document explains the complete data flow for the hotel vacancy search endpoint `/api/vagas/search`, from the initial HTTP request to the final JSON response. The system uses Puppeteer to scrape hotel availability data from the AFPESP website and returns structured information about available rooms.

---

## Table of Contents

1. [Request Flow](#request-flow)
2. [Response Structure](#response-structure)
3. [Internal Processing](#internal-processing)
4. [Data Extraction Logic](#data-extraction-logic)
5. [Example Walkthrough](#example-walkthrough)
6. [Architecture Diagram](#architecture-diagram)

---

## Request Flow

### 1. HTTP Request Entry Point

**Endpoint:** `GET /api/vagas/search`

**Query Parameters:**

- `checkin` (required): Check-in date in `YYYY-MM-DD` format (e.g., `2025-04-03`)
- `checkout` (required): Check-out date in `YYYY-MM-DD` format (e.g., `2025-12-05`)
- `hotel` (optional): Hotel name or `-1` for all hotels (default: `Todas`)

**Example Request:**

```http
GET https://www.mpbarbosa.com/api/vagas/search?hotel=-1&checkin=2025-04-03&checkout=2025-12-05
```

### 2. Route Handling

**File:** `src/routes/vagasRoutes.js`

```javascript
// Line 25: Route definition
router.get('/search', vagasControllerPuppeteer.searchByDates);
```

The request is routed to the `searchByDates` function in the Puppeteer controller.

---

## Response Structure

### Top-Level Response Object

```json
{
  "success": true,
  "method": "puppeteer",
  "headlessMode": true,
  "resourceSavings": "40-60% compared to Selenium",
  "hotelFilter": "-1",
  "data": { ... }
}
```

**Fields:**

- `success` (boolean): Indicates if the API call was successful
- `method` (string): The scraping method used (`"puppeteer"`)
- `headlessMode` (boolean): Always `true` - browser runs without GUI
- `resourceSavings` (string): Performance benefit compared to Selenium
- `hotelFilter` (string): The hotel filter applied (value from query parameter)
- `data` (object): Contains the actual vacancy search results

### Data Object Structure

```json
{
  "success": true,
  "date": "4/3/2025",
  "hasAvailability": true,
  "result": { ... }
}
```

**Fields:**

- `success` (boolean): Indicates if the search operation completed successfully
- `date` (string): The search date in `M/D/YYYY` format
- `hasAvailability` (boolean): `true` if any vacancies were found
- `result` (object): Detailed vacancy information

### Result Object Structure

```json
{
  "hasAvailability": true,
  "status": "AVAILABLE",
  "summary": "Found vacancies in 4 hotel(s): Amparo, Appenzell, Areado, Avaré",
  "vacancies": [ ... ],
  "hotelGroups": { ... }
}
```

**Fields:**

- `hasAvailability` (boolean): Duplicate of parent-level flag for convenience
- `status` (string): Status code - `"AVAILABLE"`, `"NO AVAILABILITY"`, or `"ERROR"`
- `summary` (string): Human-readable summary of results
- `vacancies` (array): Flat list of all vacancy strings
- `hotelGroups` (object): Vacancies organized by hotel name

### Vacancies Array

A flat array of formatted vacancy strings:

```json
[
  "Amparo: COQUEIROS (até 3 pessoas)01/06 - 01/07 (30 dias livres) - 38 Quarto(s)",
  "Amparo: BOCAINA (até 3 pessoas)01/06 - 01/07 (30 dias livres) - 38 Quarto(s)",
  "Appenzell: JAZZ Luxo (até 2 pessoas)03/04 - 01/07 (89 dias livres) - 3 Quarto(s)"
]
```

**Format:** `{Hotel}: {RoomType} (até {capacity} pessoas){startDate} - {endDate} ({duration} dias livres) - {quantity} Quarto(s)`

### Hotel Groups Object

Vacancies organized by hotel for easier filtering and display:

```json
{
  "Amparo": [
    "COQUEIROS (até 3 pessoas)01/06 - 01/07 (30 dias livres) - 38 Quarto(s)",
    "BOCAINA (até 3 pessoas)01/06 - 01/07 (30 dias livres) - 38 Quarto(s)"
  ],
  "Appenzell": [
    "JAZZ Luxo (até 2 pessoas)03/04 - 01/07 (89 dias livres) - 3 Quarto(s)",
    "JAZZ Master (até 2 pessoas)03/04 - 01/07 (89 dias livres) - 1 Quarto(s)"
  ]
}
```

---

## Internal Processing

### Step 1: Controller Layer

**File:** `src/controllers/vagasControllerPuppeteer.js`

**Function:** `searchByDates(req, res)`

**Responsibilities:**

1. Extract and validate query parameters
2. Call the Puppeteer script
3. Format the response
4. Handle errors

```javascript
export const searchByDates = async (req, res) => {
  const { checkin, checkout, hotel = 'Todas' } = req.query;
  
  // Validation
  if (!checkin || !checkout) {
    return res.status(400).json({ error: '...' });
  }
  
  // Execute search
  const results = await searchVacanciesByDay(checkin, checkout, hotel);
  
  // Return formatted response
  res.json({
    success: true,
    method: 'puppeteer',
    headlessMode: true,
    resourceSavings: '40-60% compared to Selenium',
    hotelFilter: hotel,
    data: results
  });
};
```

### Step 2: Service Layer

**File:** `src/controllers/puppeteer-script.js`

**Function:** `searchVacanciesByDay(startDate, endDate, hotel)`

**Responsibilities:**

1. Convert date strings to Date objects
2. Validate dates
3. Call the core scraping function
4. Format results

**Date Conversion:**

```javascript
// Convert "2025-04-03" to Date object
const [year, month, day] = startDate.split('-').map(Number);
checkInDate = new Date(year, month - 1, day);
```

**Validation:**

```javascript
// Ensure dates are valid
if (isNaN(checkInDate.getTime())) {
  throw new Error('Invalid startDate provided');
}

// Ensure checkout is after checkin
if (checkOutDate <= checkInDate) {
  throw new Error('endDate must be after startDate');
}
```

### Step 3: Browser Automation

**Function:** `openVagasPage(fridayDate, sundayDate, weekendNumber, totalWeekends, hotel)`

**Browser Pool Management:**

```javascript
const browserPool = new BrowserPool();
const browser = await browserPool.getBrowser();
```

The browser pool reuses browser instances for 5 minutes to improve performance.

**Page Navigation:**

1. Navigate to AFPESP website
2. Wait for page to load (`networkidle2`)
3. Set hotel selection
4. Set check-in date
5. Set check-out date
6. Click search button
7. Wait for results

**Target URL:**

```url
https://associadoh.afpesp.org.br/Servicos/Reservas/Vagas-disponiveis.aspx
```

---

## Data Extraction Logic

### Step 1: Hotel Selection

```javascript
// Find hotel dropdown
await page.waitForSelector('#ddlHoteis');

// Get all available options
const hotelOptions = await page.evaluate(() => {
  const select = document.getElementById('ddlHoteis');
  const options = [];
  for (let i = 0; i < select.options.length; i++) {
    options.push({
      value: select.options[i].value,
      text: select.options[i].text.trim()
    });
  }
  return options;
});

// Select hotel (default: '-1' for all hotels)
await page.select('#ddlHoteis', selectedValue);
```

### Step 2: Date Input

```javascript
// Format: DD/MM/YYYY
const checkinDate = `${dayStr}/${monthStr}/${yearStr}`;

// Set check-in date
await page.evaluate((date) => {
  const input = document.getElementById('txtCheckin');
  input.value = date;
  input.dispatchEvent(new Event('change', { bubbles: true }));
}, checkinDate);
```

### Step 3: Search Execution

```javascript
// Click search button
await page.waitForSelector('#btnConsulta');
await page.click('#btnConsulta');

// Wait for results
await page.waitForSelector('#lyConsulta', { timeout: 15000 });
```

### Step 4: Result Parsing

**Get HTML Content:**

```javascript
const lyConsultaHTML = await page.evaluate(() => {
  const element = document.getElementById('lyConsulta');
  return element ? element.innerHTML : '';
});
```

**Check for "No Availability" Message:**

```javascript
const noRoomMessage = 'No período escolhido não há nenhum quarto disponível...';
const hasNoRoomMessage = lyConsultaContent.includes(noRoomMessage);
```

**Extract Hotel Sections:**

```javascript
// Split HTML by hotel section dividers
const hotelSections = pageSource.split(/<div class="cc_tit">/i);
```

**Parse Vacancies with Regex:**

```javascript
const vacancyPatterns = [
  /(\w+(?:\s+\w+)*)\s*\(até\s+(\d+)\s+pessoas?\)\s*(\d{1,2}\/\d{1,2})\s*-\s*(\d{1,2}\/\d{1,2})\s*\([^)]+\)\s*-\s*(\d+)\s+Quarto\(s\)(?:\s*-\s*adaptado)?/gim
];

vacancyPatterns.forEach(pattern => {
  const matches = section.match(pattern);
  // Process matches...
});
```

**Example Match:**

```text
COQUEIROS (até 3 pessoas)01/06 - 01/07 (30 dias livres) - 38 Quarto(s)
```

**Extracted Components:**

- Room Type: `COQUEIROS`
- Capacity: `3 pessoas`
- Start Date: `01/06`
- End Date: `01/07`
- Duration: `30 dias livres`
- Quantity: `38 Quarto(s)`

### Step 5: Data Structuring

**Group by Hotel:**

```javascript
const hotelGroups = {};
foundVacancies.forEach(vacancy => {
  if (!hotelGroups[vacancy.hotel]) {
    hotelGroups[vacancy.hotel] = [];
  }
  hotelGroups[vacancy.hotel].push(vacancy.vacancy);
});
```

**Build Response:**

```javascript
return {
  hasAvailability: true,
  status: 'AVAILABLE',
  summary: `Found vacancies in ${Object.keys(hotelGroups).length} hotel(s): ${Object.keys(hotelGroups).join(', ')}`,
  vacancies: foundVacancies.map(v => v.fullText),
  hotelGroups: hotelGroups
};
```

---

## Example Walkthrough

### Request

```http
GET /api/vagas/search?hotel=-1&checkin=2025-04-03&checkout=2025-12-05
```

### Processing Steps

1. **Route Handler** receives request
   - Extracts: `hotel="-1"`, `checkin="2025-04-03"`, `checkout="2025-12-05"`

2. **Controller** validates and converts dates
   - Converts `"2025-04-03"` → `Date(2025, 3, 3)` (April 3, 2025)
   - Converts `"2025-12-05"` → `Date(2025, 11, 5)` (December 5, 2025)

3. **Puppeteer Script** launches browser
   - Navigates to AFPESP website
   - Selects hotel: `-1` (all hotels)
   - Sets check-in: `03/04/2025`
   - Sets check-out: `05/12/2025`
   - Clicks search button

4. **Page Waits** for results
   - Waits for `#lyConsulta` element
   - Adds 2-second buffer for full rendering

5. **HTML Parser** extracts data
   - Finds 4 hotel sections: Amparo, Appenzell, Areado, Avaré
   - Extracts 12 vacancy entries

6. **Data Structuring**
   - Groups vacancies by hotel
   - Creates flat array of all vacancies
   - Builds summary string

7. **Response Formation**

   ```json
   {
     "success": true,
     "method": "puppeteer",
     "headlessMode": true,
     "resourceSavings": "40-60% compared to Selenium",
     "hotelFilter": "-1",
     "data": {
       "success": true,
       "date": "4/3/2025",
       "hasAvailability": true,
       "result": { ... }
     }
   }
   ```

---

## Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────┐
│                         HTTP Request                             │
│  GET /api/vagas/search?hotel=-1&checkin=2025-04-03              │
│                         &checkout=2025-12-05                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express Router                                │
│              (src/routes/vagasRoutes.js)                         │
│                                                                   │
│  router.get('/search', vagasControllerPuppeteer.searchByDates)   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Controller Layer                                 │
│        (src/controllers/vagasControllerPuppeteer.js)             │
│                                                                   │
│  1. Extract query parameters (checkin, checkout, hotel)          │
│  2. Validate required parameters                                 │
│  3. Call searchVacanciesByDay()                                  │
│  4. Format response with metadata                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Service Layer                                   │
│          (src/controllers/puppeteer-script.js)                   │
│                                                                   │
│  searchVacanciesByDay(startDate, endDate, hotel):                │
│  1. Convert date strings to Date objects                         │
│  2. Validate dates (format, logic)                               │
│  3. Call openVagasPage()                                         │
│  4. Format results for API response                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Browser Automation Layer                            │
│          (src/controllers/puppeteer-script.js)                   │
│                                                                   │
│  openVagasPage(fridayDate, sundayDate, weekendNumber,            │
│                totalWeekends, hotel):                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 1. Browser Pool Management                               │   │
│  │    - Reuse browser instances (5 min TTL)                 │   │
│  │    - Launch with headless mode                           │   │
│  │    - Optimize resource usage                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 2. Page Navigation                                       │   │
│  │    - Navigate to AFPESP website                          │   │
│  │    - Wait for networkidle2                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 3. Form Interaction                                      │   │
│  │    a. Hotel Selection                                    │   │
│  │       - Wait for #ddlHoteis dropdown                     │   │
│  │       - Get all available options                        │   │
│  │       - Select hotel by value (-1 = all)                 │   │
│  │                                                           │   │
│  │    b. Date Input                                         │   │
│  │       - Set #txtCheckin (DD/MM/YYYY)                     │   │
│  │       - Set #txtCheckout (DD/MM/YYYY)                    │   │
│  │       - Dispatch change events                           │   │
│  │                                                           │   │
│  │    c. Search Execution                                   │   │
│  │       - Click #btnConsulta button                        │   │
│  │       - Wait for #lyConsulta results                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 4. HTML Extraction                                       │   │
│  │    - Get #lyConsulta innerHTML                           │   │
│  │    - Get text content for message detection              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 5. Data Parsing                                          │   │
│  │    a. Check for "No Availability" message                │   │
│  │    b. Split HTML by hotel sections                       │   │
│  │       - Delimiter: div with class "cc_tit"               │   │
│  │    c. Extract hotel names from section headers           │   │
│  │    d. Apply vacancy regex patterns:                      │   │
│  │       - Room type (até X pessoas)                        │   │
│  │       - Date range (DD/MM - DD/MM)                       │   │
│  │       - Duration (X dias livres)                         │   │
│  │       - Quantity (X Quarto(s))                           │   │
│  │    e. Clean and normalize text                           │   │
│  │       - Remove HTML tags                                 │   │
│  │       - Normalize whitespace                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 6. Data Structuring                                      │   │
│  │    a. Create vacancy objects:                            │   │
│  │       {                                                   │   │
│  │         hotel: "Amparo",                                 │   │
│  │         vacancy: "COQUEIROS (até 3 pessoas)...",         │   │
│  │         fullText: "Amparo: COQUEIROS..."                 │   │
│  │       }                                                   │   │
│  │    b. Group by hotel name                                │   │
│  │    c. Build summary string                               │   │
│  │    d. Determine availability status                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 7. Return Result Object                                  │   │
│  │    {                                                      │   │
│  │      hasAvailability: true,                              │   │
│  │      status: "AVAILABLE",                                │   │
│  │      summary: "Found vacancies in 4 hotel(s)...",        │   │
│  │      vacancies: [...],                                   │   │
│  │      hotelGroups: {...}                                  │   │
│  │    }                                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Response Formation                            │
│        (src/controllers/vagasControllerPuppeteer.js)             │
│                                                                   │
│  Wrap result with API metadata:                                  │
│  {                                                                │
│    success: true,                                                │
│    method: "puppeteer",                                          │
│    headlessMode: true,                                           │
│    resourceSavings: "40-60% compared to Selenium",               │
│    hotelFilter: "-1",                                            │
│    data: { result object from above }                            │
│  }                                                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       JSON Response                              │
│                    (sent to client)                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Performance Optimizations

### 1. Browser Pool

- Reuses browser instances for 5 minutes
- Reduces startup overhead
- Shared across multiple requests

### 2. Headless Mode

- Always runs without GUI
- 40-60% less resource consumption vs Selenium
- Better for CI/CD and production environments

### 3. Minimal Browser Flags

```javascript
args: [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--no-first-run',
  '--no-zygote',
  '--disable-gpu'
]
```

### 4. Smart Waiting

- Uses `networkidle2` for complete page loads
- Targeted selector waiting instead of arbitrary timeouts
- 2-second buffer after results for complete rendering

---

## Error Handling

### Validation Errors (400)

```json
{
  "error": "Both checkin and checkout parameters are required",
  "example": "/api/vagas/search?checkin=2024-12-25&checkout=2024-12-26&hotel=Todas"
}
```

### Server Errors (500)

```json
{
  "success": false,
  "error": "Error message here",
  "method": "puppeteer"
}
```

### Search Errors

When scraping fails, the result object indicates the error:

```json
{
  "success": false,
  "date": "4/3/2025",
  "hasAvailability": false,
  "error": "Error message from puppeteer"
}
```

---

## Business Rules

### Booking Rules for Holiday Packages

The API implements special booking rules for Christmas and New Year periods. These are pre-defined closed packages with fixed dates:

#### Christmas Package

- **Check-in Date:** December 22nd
- **Check-out Date:** December 27th
- **Duration:** 5 days/4 nights
- **Rule:** Reservations during December 22-27 **must** use these exact dates

#### New Year Package

- **Check-in Date:** December 27th
- **Check-out Date:** January 2nd
- **Duration:** 6 days/5 nights
- **Rule:** Reservations during December 27 - January 2 **must** use these exact dates

#### Validation Logic

When processing search requests, the system validates booking rules based on the `applyBookingRules` parameter:

1. **Parameter Check:** Check if `applyBookingRules` query parameter is present and its value
   - If `applyBookingRules=false`: Skip validation and allow any date range
   - If `applyBookingRules=true` or omitted (default): Apply holiday package validation
2. **Date Range Check:** If validation is enabled, check if dates fall within either holiday package period
3. **Exact Match Requirement:** If in a package period and rules enabled, dates must match exactly:
   - Christmas: `checkin=YYYY-12-22` AND `checkout=YYYY-12-27`
   - New Year: `checkin=YYYY-12-27` AND `checkout=YYYY+1-01-02`
4. **Rejection:** Any partial or custom dates within these periods are rejected (when rules enabled)

**Business Rule References:**

- **BR-18:** Holiday reservation periods are pre-defined as closed packages
- **BR-19:** Reservations cannot be made on different dates during holiday periods (by default)
- **BR-20:** Booking rules can be optionally disabled via `applyBookingRules=false` parameter

**Implementation Note:** These rules apply at the business logic layer and should be validated before initiating the Puppeteer scraping process to avoid unnecessary resource usage. The `applyBookingRules` parameter provides flexibility for users who need to search custom dates during holiday periods.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/routes/vagasRoutes.js` | Route definitions and endpoint mapping |
| `src/controllers/vagasControllerPuppeteer.js` | Request handling and response formatting |
| `src/controllers/puppeteer-script.js` | Browser automation and data extraction |

---

## Related Documentation

- [API Documentation](./API.md)
- [Puppeteer Implementation](../PUPPETEER_IMPLEMENTATION.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Production Environment Validation](./PRODUCTION_ENVIRONMENT_VALIDATION.md)

---

## Conclusion

The `/api/vagas/search` endpoint provides a robust, optimized solution for scraping hotel vacancy data. It leverages Puppeteer's efficiency to deliver structured, queryable results with comprehensive availability information organized by hotel and room type.

**Key Benefits:**

- ✅ 40-60% resource savings vs Selenium
- ✅ Always headless for production reliability
- ✅ Browser instance pooling for performance
- ✅ Structured, easy-to-consume JSON response
- ✅ Detailed vacancy information grouped by hotel
- ✅ Flexible hotel filtering
- ✅ Comprehensive error handling
