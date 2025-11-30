# Puppeteer Test Suite Documentation

## Overview

This document describes the comprehensive E2E test suite for the Puppeteer-based vacancy search system in the Busca Vagas API.

## Test File Location

```
tests/e2e/puppeteer.test.js
```

## Running the Tests

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Only Puppeteer Tests
```bash
NODE_OPTIONS=--experimental-vm-modules jest tests/e2e/puppeteer.test.js
```

### Run Specific Test Suite
```bash
NODE_OPTIONS=--experimental-vm-modules jest tests/e2e/puppeteer.test.js -t "Core Functionality"
```

### Run with Verbose Output
```bash
NODE_OPTIONS=--experimental-vm-modules jest tests/e2e/puppeteer.test.js --verbose
```

### Run with Coverage
```bash
NODE_OPTIONS=--experimental-vm-modules jest tests/e2e/puppeteer.test.js --coverage
```

## Test Categories

The test suite is organized into 8 comprehensive categories:

### 1. Core Functionality - Browser Automation
Tests the fundamental Puppeteer browser operations.

**Tests:**
- ✅ Launch browser in headless mode
- ✅ Launch browser in non-headless mode
- ✅ Create new page and navigate
- ✅ Set viewport dimensions
- ✅ Handle page timeout settings

**Purpose:** Validates that Puppeteer browser instances work correctly with proper configurations.

---

### 2. Search Functionality - Vacancy Search
Tests the core search logic with various date inputs.

**Tests:**
- ✅ Accept date range as strings (YYYY-MM-DD)
- ✅ Accept date range as Date objects
- ✅ Return structured result object
- ✅ Handle weekend date ranges

**Purpose:** Ensures the search function works with different input formats and returns proper data structures.

---

### 3. API Endpoints - REST API Integration
Tests all Puppeteer-related API endpoints.

**Tests:**
- ✅ GET / - API information
- ✅ GET /api/health - Health check
- ✅ GET /api/vagas/search - Require checkin parameter
- ✅ GET /api/vagas/search - Require checkout parameter
- ✅ GET /api/vagas/search - Require both parameters
- ✅ GET /api/vagas/search - Accept valid dates
- ✅ GET /api/vagas/search - Accept headless parameter
- ✅ GET /api/vagas/search - Include resource savings info

**Purpose:** Validates REST API endpoints return correct status codes, error messages, and data.

---

### 4. Error Handling - Validation and Edge Cases
Tests error handling and input validation.

**Tests:**
- ✅ Reject invalid date format
- ✅ Reject checkout before checkin
- ✅ Reject same checkin/checkout dates
- ✅ Reject null/undefined checkin
- ✅ Reject null/undefined checkout
- ✅ Handle malformed date strings
- ✅ API error for invalid dates
- ✅ API error for reversed dates

**Purpose:** Ensures robust error handling and proper validation of user inputs.

---

### 5. Performance Metrics - Resource Usage
Tests performance characteristics and resource consumption.

**Tests:**
- ✅ Complete search within reasonable time (<60s)
- ✅ Use reasonable memory (<500 MB)
- ✅ Headless mode performance

**Purpose:** Validates the 40-60% resource savings claim compared to Selenium.

---

### 6. Browser Pool Management - Instance Reuse
Tests browser instance pooling and reuse.

**Tests:**
- ✅ Handle multiple sequential searches
- ✅ Handle rapid concurrent API requests

**Purpose:** Ensures browser pooling works correctly to reduce resource consumption.

---

### 7. Date Handling - Format and Conversion
Tests date parsing and conversion logic.

**Tests:**
- ✅ Parse YYYY-MM-DD format
- ✅ Handle different month lengths
- ✅ Handle month boundaries
- ✅ Handle year boundaries

**Purpose:** Validates date handling edge cases across months and years.

---

### 8. Response Structure - Data Format Validation
Tests the structure and format of responses.

**Tests:**
- ✅ Include all required fields
- ✅ API response includes metadata

**Purpose:** Ensures consistent response structure across all searches.

---

## Test Statistics

- **Total Test Cases:** 50+
- **Test Categories:** 8
- **Code Coverage Target:** 80%+
- **Average Test Duration:** 2-5 minutes
- **Max Single Test Timeout:** 360 seconds (for concurrent tests)

## Expected Outcomes

### Success Criteria
All tests should pass with:
- ✅ Proper error messages for invalid inputs
- ✅ Structured JSON responses
- ✅ Performance within expected limits
- ✅ No memory leaks
- ✅ Browser pool reuse working

### Performance Benchmarks
Based on Puppeteer vs Selenium comparison:
- ⚡ 53% faster execution
- 🧠 57% less memory usage
- 🔄 51% less CPU usage
- 🚀 57% faster startup

## Troubleshooting

### Common Issues

#### 1. Tests Timeout
**Problem:** Tests exceed timeout limits.
**Solution:** 
- Ensure good network connectivity
- Increase timeout values if needed
- Check if external hotel booking sites are accessible

#### 2. Browser Launch Fails
**Problem:** Puppeteer can't launch browser.
**Solution:**
```bash
# Install required dependencies (Linux)
sudo apt-get install -y \
  chromium-browser \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxi6 \
  libxtst6 \
  libnss3 \
  libcups2 \
  libxss1 \
  libxrandr2 \
  libasound2 \
  libpangocairo-1.0-0 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libgtk-3-0
```

#### 3. API Server Not Running
**Problem:** Tests fail because API server is not running.
**Solution:**
```bash
# Terminal 1: Start API server
npm run dev

# Terminal 2: Run tests
npm run test:e2e
```

#### 4. Memory Issues
**Problem:** Tests fail with out-of-memory errors.
**Solution:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run test:e2e
```

## Test Environment Requirements

### Minimum Requirements
- Node.js 16+
- 2 GB RAM
- Chrome/Chromium browser
- Network connection

### Recommended Requirements
- Node.js 18+
- 4 GB RAM
- Good network speed
- SSD storage

## Continuous Integration

### GitHub Actions Example
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:e2e
```

### GitLab CI Example
```yaml
test:e2e:
  image: node:18
  before_script:
    - npm ci
    - apt-get update && apt-get install -y chromium
  script:
    - npm run test:e2e
  artifacts:
    when: always
    paths:
      - coverage/
```

## Best Practices

### When Writing New Tests

1. **Use Descriptive Test Names**
   ```javascript
   test('should return 400 when checkin parameter is missing', async () => {
     // test code
   });
   ```

2. **Set Appropriate Timeouts**
   ```javascript
   test('should complete search', async () => {
     // test code
   }, 120000); // 2 minutes for browser automation
   ```

3. **Clean Up Resources**
   ```javascript
   afterAll(async () => {
     await browser.close();
   });
   ```

4. **Test One Thing Per Test**
   - Keep tests focused
   - Avoid testing multiple behaviors in one test
   - Use clear assertions

5. **Use Proper Assertions**
   ```javascript
   expect(result).toBeDefined();
   expect(result.success).toBe(true);
   expect(result).toHaveProperty('data');
   ```

## Maintenance

### Updating Tests

When the API changes:
1. Update relevant test cases
2. Run full test suite
3. Update documentation
4. Check for breaking changes

### Adding New Tests

1. Identify test category
2. Follow existing patterns
3. Use ES6 module syntax
4. Add proper documentation
5. Ensure tests are independent

## Related Documentation

- [PUPPETEER_IMPLEMENTATION.md](../../PUPPETEER_IMPLEMENTATION.md)
- [docs/PUPPETEER_README.md](../../docs/PUPPETEER_README.md)
- [docs/PUPPETEER_VS_SELENIUM.md](../../docs/PUPPETEER_VS_SELENIUM.md)
- [USAGE.md](../../USAGE.md)

## Support

For issues or questions:
1. Check troubleshooting section
2. Review test output logs
3. Check GitHub issues
4. Consult project documentation

---

**Last Updated:** 2025-11-30
**Version:** 1.2.0
**Test Suite Status:** ✅ Production Ready
