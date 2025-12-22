# Changelog - Simple Search Feature

## 2025-11-29 - Headless Mode & Date Parsing Enhancement

### Added

#### Headless Browser Parameter

- **`headless` query parameter** (optional) for `/api/vagas/search/bydates`
  - Default: `true` (headless mode for production)
  - Set to `false` for visible browser (debugging)
  - Chrome options configured: `--headless`, `--disable-gpu`, `--no-sandbox`, `--disable-dev-shm-usage`

### Fixed

#### Date Parsing Timezone Issue

- **Fixed timezone bug in date parsing** (`selenium-script.cjs`)
  - Issue: `new Date('YYYY-MM-DD')` parsed as UTC causing date shifts
  - Solution: Manual parsing to local time `new Date(year, month - 1, day)`
  - Example: '2025-12-22' now correctly parses as Dec 22 instead of Dec 21

#### Function Signatures Updated

- **`searchVacanciesByDay(startDate, endDate, headless = true)`**
  - Added headless parameter with default value
- **`openVagasPage(fridayDate, sundayDate, weekendNumber, totalWeekends, headless = true)`**
  - Added headless parameter support

### Modified

#### Documentation

- **`docs/API.md`**
  - Added `headless` parameter documentation
  - Updated example requests with headless usage
  
#### Testing

- **Confirmed headless mode compatibility**
  - All Selenium operations work in headless mode
  - Tested successfully with real hotel search
  - Production-ready for AWS deployment

### Technical Details

#### Headless Mode Implementation

```javascript
// Controller parsing
const isHeadless = headless === 'false' ? false : true;

// Chrome configuration
if (headless) {
  options.addArguments('--headless');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
}
```

#### Date Parsing Fix

```javascript
// Before (timezone issue)
checkInDate = new Date(startDate); // UTC interpretation

// After (local time)
const [year, month, day] = startDate.split('-').map(Number);
checkInDate = new Date(year, month - 1, day); // Local time
```

### Benefits

- **Production**: Headless mode optimized for AWS servers
- **Development**: Visible mode for debugging
- **Accuracy**: Dates now parse correctly regardless of timezone

---

## 2025-01-28 - Simple Search Endpoint Implementation

### Added

#### New Endpoint

- **`GET /api/vagas/search/bydates`** - Automated vacancy search by date
  - Query parameter: `date` (required, format: YYYY-MM-DD)
  - Uses Selenium WebDriver for automated web scraping
  - Returns hotel availability for specified date
  - Response time: 20-30 seconds (browser automation)

#### Controller Function

- **`searchByDates`** in `src/controllers/vagasController.js`
  - Validates checkin and checkout parameters
  - Dynamically imports `searchVacanciesByDay` from CommonJS module
  - Calls `searchVacanciesByDay(checkin, checkout)` with both date parameters
  - Proper error handling for invalid dates
  - Returns JSON response with search results

#### Route

- Added route in `src/routes/vagasRoutes.js`
  - Path: `/search/bydates` (before `/:id` to avoid conflicts)
  - Method: GET
  - Handler: `vagasController.searchByDates`

#### Testing

- **E2E Test Suite**: `tests/e2e/simpleSearch.test.js`
  - Server availability check with graceful skip
  - Test: Missing date parameter (expects 400)
  - Test: Valid date format (expects results)
  - Test: Invalid date format (expects error)
  - Test: YYYY-MM-DD format acceptance
  - All 4 tests passing successfully

### Modified

#### Configuration

- **`jest.config.cjs`**
  - Removed incompatible `extensionsToTreatAsEsm: ['.js']`
  - Removed `testEnvironmentOptions`
  - Fixed compatibility with ES modules

#### Documentation

- **`README.md`**
  - Updated base URL to port 3005
  - Added simple search endpoint to endpoint list
  - Enhanced testing section with E2E requirements
  - Added new documentation references

- **`docs/API.md`**
  - Updated base URL to port 3005
  - Added comprehensive simple search endpoint documentation
  - Included query parameters, examples, and error responses
  - Added performance notes about Selenium automation

### Technical Details

#### ES Module Integration

- Controller uses dynamic import to load CommonJS module
- Pattern: `const { searchVacanciesByDay } = await import('./selenium-script.cjs')`
- Maintains compatibility between ES modules and CommonJS

#### Test Infrastructure

- Helper function `isServerRunning()` for connection testing
- Tests skip gracefully when server is unavailable
- Clear warning messages guide users to start server
- Extended timeouts (120s) for Selenium operations

### Testing Results

```text
Test Suites: 2 passed, 2 total
Tests:       7 passed, 7 total
Time:        50.788 s
```

### Dependencies

No new dependencies added. Uses existing:

- selenium-webdriver (already in devDependencies)
- Express.js routing
- Jest testing framework

### Breaking Changes

None. All changes are additive.

### Migration Notes

N/A - New feature, no migration required.

### Known Issues

- Integration tests have pre-existing ES module import issues (not related to this feature)
- Server must be running on port 3005 for E2E tests

### Future Enhancements

- Add caching for search results
- Implement rate limiting for Selenium operations
- Add more search filters (date range, hotel type, etc.)
- ~~Consider headless browser mode for production~~ ✅ **Implemented (2025-11-29)**
