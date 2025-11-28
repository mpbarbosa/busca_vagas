# Changelog - Simple Search Feature

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
  - Validates startDate and endDate parameters
  - Dynamically imports `searchVacanciesByDay` from CommonJS module
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
```
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
- Consider headless browser mode for production
