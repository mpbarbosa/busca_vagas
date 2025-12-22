# Test Suite - Busca Vagas API

**Generated:** 2025-12-21  
**Based on:** Comprehensive Test Analysis Report  
**Status:** Phase 1 Implementation (Critical Tests)

## Overview

This test suite provides comprehensive coverage for the Busca Vagas API, focusing on business-critical modules first.

## Test Structure

```
tests/
├── setup.js                          # Global test configuration
├── unit/                             # Unit tests
│   ├── utils/                        # Utility function tests
│   │   ├── bookingRules.test.js     # ✅ 30 tests (CRITICAL)
│   │   ├── cache.test.js            # ✅ 20 tests (CRITICAL)
│   │   └── helpers.test.js          # TODO: 10 tests
│   ├── services/                     # Service layer tests
│   │   ├── vagasService.test.js     # TODO: 25 tests
│   │   └── hoteisService.test.js    # TODO: 15 tests
│   ├── models/                       # Data model tests
│   │   └── Vaga.test.js            # TODO: 8 tests
│   └── middlewares/                  # Middleware tests
│       └── validation.test.js       # TODO: 15 tests
├── integration/                      # Integration tests
│   └── api.test.js                  # TODO: 20 tests
└── e2e/                             # End-to-end tests
    └── workflow.test.js             # TODO: 5 tests
```

## Implemented Tests (Phase 1)

### ✅ bookingRules.test.js (30 tests)
**Priority:** 🔴 CRITICAL  
**Coverage Target:** 95%

Tests the core business logic for holiday booking validation:
- Valid booking dates (Christmas and New Year packages)
- Business rule enforcement (BR-18, BR-19)
- Edge cases (invalid formats, date ranges)
- Boundary testing (period transitions)
- Multi-year scenarios

**Key Test Cases:**
- Christmas Package validation (Dec 22-27)
- New Year Package validation (Dec 27 - Jan 2)
- Invalid partial period bookings
- Date format validation
- Date range validation

### ✅ cache.test.js (20 tests)
**Priority:** 🔴 CRITICAL  
**Coverage Target:** 90%

Tests the in-memory caching utility:
- Set and get operations
- TTL expiration handling
- Cache statistics
- Cleanup operations
- Data type handling (objects, arrays, primitives)

**Key Test Cases:**
- Value storage and retrieval
- TTL expiration
- Cache has/delete operations
- Statistics collection
- Cleanup of expired entries

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test bookingRules
npm test cache
```

### Run with Coverage
```bash
npm run test:coverage
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### Run Only Unit Tests
```bash
npm run test:unit
```

## Test Configuration

### Jest Configuration (`jest.config.cjs`)
- **Test Environment:** Node.js
- **Module System:** ES Modules (experimental-vm-modules)
- **Coverage Threshold:** 80% (global)
- **Test Timeout:** 10 seconds
- **Setup File:** `tests/setup.js`

### Environment Variables (Test)
```env
NODE_ENV=test
PORT=3001
HOTEL_CACHE_TTL=3600000
```

## Coverage Goals

| Module | Target | Priority | Status |
|--------|--------|----------|--------|
| utils/bookingRules.js | 95% | 🔴 Critical | ✅ Tests Created |
| utils/cache.js | 90% | 🔴 Critical | ✅ Tests Created |
| utils/helpers.js | 100% | 🟡 Medium | ⏳ TODO |
| services/vagasService.js | 85% | 🟠 High | ⏳ TODO |
| services/hoteisService.js | 80% | 🟠 High | ⏳ TODO |
| middlewares/validation.js | 85% | 🟠 High | ⏳ TODO |
| models/Vaga.js | 100% | 🟡 Medium | ⏳ TODO |

**Overall Target:** 80% minimum coverage

## Implementation Roadmap

### ✅ Phase 1: Critical Foundation (Completed)
- [x] Set up test infrastructure
- [x] Create test directory structure
- [x] Implement bookingRules.test.js
- [x] Implement cache.test.js
- [x] Document test suite

### ⏳ Phase 2: Business Logic (Next)
- [ ] Implement helpers.test.js
- [ ] Implement vagasService.test.js
- [ ] Implement hoteisService.test.js
- [ ] Implement Vaga.test.js
- [ ] Implement validation.test.js

### 📅 Phase 3: Integration (Planned)
- [ ] Implement API integration tests
- [ ] Test all endpoints
- [ ] Test booking rules integration
- [ ] Mock external dependencies

### 📅 Phase 4: E2E (Planned)
- [ ] Implement workflow tests
- [ ] Test critical user journeys
- [ ] Performance benchmarks

## Best Practices

### Writing Tests
1. **Follow AAA Pattern:** Arrange, Act, Assert
2. **Descriptive Names:** Test names should explain what is being tested
3. **Isolated Tests:** Each test should be independent
4. **Clean Up:** Use beforeEach/afterEach for setup/teardown
5. **Mock External Dependencies:** Don't test external services

### Test Organization
- Group related tests using `describe` blocks
- Use clear, hierarchical test structure
- Keep test files focused on single module
- Name test files same as source files with `.test.js` suffix

### Example Test Structure
```javascript
describe('ModuleName', () => {
  describe('FunctionName', () => {
    test('should do X when Y', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = functionName(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

## Troubleshooting

### Common Issues

**1. ES Module Import Errors**
```
Must use import to load ES Module
```
**Solution:** Ensure `jest.config.cjs` has correct `extensionsToTreatAsEsm` setting.

**2. Timeout Errors**
```
Exceeded timeout of 5000ms
```
**Solution:** Increase timeout in test or jest config for async operations.

**3. Cache Pollution**
```
Tests fail when run together
```
**Solution:** Use `beforeEach` to clear cache before each test.

## CI/CD Integration

### GitHub Actions
Tests are automatically run on:
- Push to `main` or `develop` branches
- Pull requests
- Pre-commit hooks (recommended)

### Coverage Enforcement
- Minimum 80% coverage required
- Coverage reports generated on each test run
- Failed coverage fails the build

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Coverage Reports](../coverage/lcov-report/index.html)
- [Test Analysis Report](../.ai_workflow/logs/workflow_20251221_200045/step5_copilot_test_review_20251221_202616_48869.log)

## Contributing

When adding new features:
1. Write tests first (TDD approach recommended)
2. Ensure tests pass: `npm test`
3. Check coverage: `npm run test:coverage`
4. Run linter: `npm run lint`
5. Update this README if adding new test categories

## Contact

For questions about the test suite:
- Review test analysis report in `.ai_workflow/logs/`
- Check existing test examples
- Follow established patterns

---

**Last Updated:** 2025-12-21  
**Test Suite Version:** 1.0.0  
**Coverage Status:** Phase 1 Complete (Critical Tests)
