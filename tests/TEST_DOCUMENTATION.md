# Test Suite Documentation

## Overview

This document describes the comprehensive test suite for the Busca Vagas API project, following the recommendations from the test analysis report (workflow_20251221_200045/step5).

## Test Structure

```
tests/
├── setup.js                          # Global test configuration
├── unit/                             # Unit tests (70+ tests)
│   ├── utils/                        # Utility function tests
│   │   ├── bookingRules.test.js     # 40+ tests for holiday booking rules
│   │   ├── cache.test.js            # 20+ tests for cache utilities
│   │   └── helpers.test.js          # 10+ tests for helper functions
│   ├── services/                     # Service layer tests
│   │   └── vagasService.test.js     # 25+ tests for vacancy services
│   ├── models/                       # Model tests
│   │   └── Vaga.test.js             # 15+ tests for Vaga model
│   └── middlewares/                  # Middleware tests
│       └── validation.test.js       # 15+ tests for validation middleware
├── integration/                      # Integration tests (40+ tests)
│   ├── api-comprehensive.test.js    # Comprehensive API endpoint tests
│   ├── bookingRules.integration.test.js
│   ├── hoteis.test.js
│   └── vagas.test.js
└── e2e/                              # End-to-end tests
    ├── busca-vagas.test.js
    ├── puppeteer.test.js
    ├── puppeteer-business-logic.test.js
    └── simpleSearch.test.js
```

## Test Coverage Goals

| Module | Target | Priority | Status |
|--------|--------|----------|--------|
| **utils/bookingRules.js** | 95% | 🔴 Critical | ✅ Enhanced |
| **utils/cache.js** | 90% | 🔴 Critical | ✅ Complete |
| **utils/helpers.js** | 100% | 🟡 Medium | ✅ New |
| **services/vagasService.js** | 85% | 🟠 High | ✅ New |
| **models/Vaga.js** | 100% | 🟡 Medium | ✅ New |
| **middlewares/validation.js** | 85% | 🟠 High | ✅ New |
| **API Endpoints** | 80% | 🟠 High | ✅ New |

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm test -- --testPathPattern=unit
```

### Integration Tests Only
```bash
npm test -- --testPathPattern=integration
```

### E2E Tests Only
```bash
npm test -- --testPathPattern=e2e
```

### With Coverage Report
```bash
npm test -- --coverage
```

### Watch Mode (for development)
```bash
npm test -- --watch
```

### Specific Test File
```bash
npm test -- tests/unit/utils/bookingRules.test.js
```

## Test Categories

### 1. Unit Tests - Utils (Critical)

#### bookingRules.test.js (40+ tests)
Tests the core business logic for holiday package validation (BR-18, BR-19):

- **Valid Booking Dates**: Tests for valid Christmas and New Year packages
- **Holiday Package Restrictions**: Tests rejection of partial/invalid packages
- **Edge Cases**: Invalid formats, date range validation, null/undefined handling
- **Boundary Testing**: Tests around holiday period boundaries
- **Multi-Year Scenarios**: Tests for different years

**Key Functions Tested:**
- `validateBookingDates(checkin, checkout)`
- `getHolidayPackageInfo(checkin, checkout)`
- `isHolidayPackage(checkin, checkout)`
- `HOLIDAY_PACKAGES` constant

#### cache.test.js (20+ tests)
Tests in-memory caching functionality:

- **Basic Operations**: set, get, has, delete, clear
- **TTL Expiration**: Time-to-live validation
- **Statistics**: Cache stats tracking
- **Cleanup**: Expired entry removal
- **Edge Cases**: Null values, expired entries

#### helpers.test.js (10+ tests)
Tests utility helper functions:

- **ID Generation**: `gerarId()` uniqueness and format
- **Response Formatting**: `respostaSucesso()` and `respostaErro()`
- **Email Validation**: `validarEmail()` with various formats

### 2. Unit Tests - Services

#### vagasService.test.js (25+ tests)
Tests vacancy service business logic:

- **Filtering**: `filterVagasByHotel()`, `filterVagasBySindicato()`
- **Multi-filtering**: `applyFilters()` with multiple criteria
- **Sorting**: `sortVagas()` by different fields
- **Enrichment**: `enrichVagaWithPackageInfo()` for holiday packages
- **Immutability**: Ensures original data not mutated

### 3. Unit Tests - Models

#### Vaga.test.js (15+ tests)
Tests the Vaga model class:

- **Constructor**: Property assignment, defaults
- **Validation**: Required field validation, error messages
- **Serialization**: JSON conversion

### 4. Unit Tests - Middlewares

#### validation.test.js (15+ tests)
Tests validation middleware:

- **Holiday Package Validation**: Christmas and New Year rules
- **Bypass Logic**: `applyBookingRules=false` parameter
- **Date Validation**: Format and range validation
- **Error Responses**: Proper error codes and messages

### 5. Integration Tests

#### api-comprehensive.test.js (40+ tests)
Comprehensive API endpoint testing:

- **Health Endpoints**: `/`, `/api/health`
- **Hotel Endpoints**: `/api/vagas/hoteis`, `/api/vagas/hoteis/:id`
- **Search Endpoints**: `/api/vagas/search` with booking rules
- **Cache Endpoints**: Cache info and clearing
- **Error Handling**: 404s, malformed requests
- **CORS**: Cross-origin header validation

## Test Best Practices

### 1. Test Isolation
- Each test is independent
- Uses `beforeEach` to reset state
- No shared mutable state between tests

### 2. Mock Strategy
- External dependencies (Puppeteer/Selenium) should be mocked
- Use Jest mocks for external API calls
- Mock timers for time-sensitive tests

### 3. Descriptive Names
- Test names describe what is being tested
- Use "should" format: "should reject invalid dates"
- Group related tests with `describe` blocks

### 4. AAA Pattern
All tests follow Arrange-Act-Assert:
```javascript
test('should do something', () => {
  // Arrange
  const input = 'test';
  
  // Act
  const result = functionUnderTest(input);
  
  // Assert
  expect(result).toBe(expected);
});
```

### 5. Edge Case Coverage
- Test null/undefined inputs
- Test empty strings
- Test boundary values
- Test error conditions

## Coverage Thresholds

The project enforces minimum coverage thresholds:

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  }
}
```

## CI/CD Integration

Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Pre-commit hooks (recommended)

## Continuous Improvement

### Next Steps:
1. Add performance/benchmark tests
2. Add mutation testing with Stryker
3. Add visual regression tests
4. Increase coverage to 85%+

## Troubleshooting

### Tests Timing Out
- Increase timeout in jest.config.cjs
- Use `headless: true` for browser tests
- Mock external API calls

### Flaky Tests
- Check for timing issues
- Ensure proper async/await usage
- Verify test isolation

### Coverage Not Meeting Threshold
- Run with `--coverage` to see gaps
- Add tests for uncovered branches
- Focus on critical paths first

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**Last Updated**: 2025-12-21  
**Test Count**: 150+ tests  
**Coverage Target**: 80%+
