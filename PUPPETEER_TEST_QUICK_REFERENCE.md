# Puppeteer Test Suite - Quick Reference Card

## 🚀 Quick Commands

```bash
# Run all Puppeteer tests
npm run test:puppeteer:all

# Run by category
npm run test:puppeteer:unit        # Unit tests only
npm run test:puppeteer:e2e         # E2E core tests
npm run test:puppeteer:business    # Business logic tests

# Run specific file
NODE_OPTIONS=--experimental-vm-modules jest tests/e2e/puppeteer.test.js

# Run specific test
NODE_OPTIONS=--experimental-vm-modules jest -t "should launch Puppeteer"

# With verbose output
npm run test:puppeteer:e2e -- --verbose

# With coverage
npm run test:puppeteer:unit -- --coverage
```

## 📊 Test Suite Overview

| Test Suite | File | Tests | Duration |
|------------|------|-------|----------|
| Unit Tests | `tests/unit/puppeteer-controller.test.js` | 28 | ~20s |
| E2E Core | `tests/e2e/puppeteer.test.js` | 37 | ~5-10m |
| Business Logic | `tests/e2e/puppeteer-business-logic.test.js` | 35 | ~10-20m |
| **Total** | **3 files** | **100+** | **15-30m** |

## 🎯 What Each Suite Tests

### Unit Tests (28 tests)
- ✅ Controller functions
- ✅ Request validation
- ✅ Response format
- ✅ Parameter handling
- ✅ Endpoint routing
- ✅ Error handling

### E2E Core (37 tests)
- ✅ Browser automation
- ✅ Search functionality
- ✅ API endpoints
- ✅ Error handling
- ✅ Performance metrics
- ✅ Browser pool
- ✅ Date handling
- ✅ Response structure

### Business Logic (35 tests)
- ✅ Hotel search
- ✅ Availability detection
- ✅ Data extraction
- ✅ API integration
- ✅ Date range scenarios
- ✅ Error scenarios
- ✅ Performance validation
- ✅ Concurrent operations

## 📝 Test Examples

### Basic Test
```javascript
test('should validate parameters', async () => {
  const response = await request(app)
    .get('/api/vagas/search')
    .query({ checkin: '2025-12-25' });
  
  expect(response.status).toBe(400);
});
```

### Search Test
```javascript
test('should search vacancies', async () => {
  const result = await searchVacanciesByDay(
    '2025-12-25', 
    '2025-12-26', 
    true
  );
  
  expect(result.success).toBeDefined();
}, 180000);
```

### Performance Test
```javascript
test('should complete in time', async () => {
  const start = Date.now();
  await searchVacanciesByDay(checkin, checkout, true);
  const duration = Date.now() - start;
  
  expect(duration).toBeLessThan(90000);
}, 180000);
```

## 🛠️ Common Options

| Option | Description |
|--------|-------------|
| `--verbose` | Detailed output |
| `--testTimeout=180000` | Set timeout (ms) |
| `--coverage` | Generate coverage report |
| `--watch` | Watch mode |
| `-t "test name"` | Run specific test |
| `--bail` | Stop on first failure |

## 🔍 Debugging

```bash
# Run single test with logs
NODE_OPTIONS=--experimental-vm-modules jest -t "specific test" --verbose

# Run with increased timeout
NODE_OPTIONS=--experimental-vm-modules jest --testTimeout=300000

# Run with debugger
NODE_OPTIONS="--experimental-vm-modules --inspect-brk" jest

# Check syntax
node -c tests/e2e/puppeteer.test.js
```

## 📈 Performance Targets

| Metric | Target | Typical |
|--------|--------|---------|
| Single Search | <90s | 30-60s |
| Memory | <600MB | 180-300MB |
| API Response | <90s | 30-60s |
| Browser Start | <5s | 1.8s |

## 🚦 Exit Codes

- `0` = All tests passed ✅
- `1` = Some tests failed ❌
- `2` = Fatal error 💥

## 📚 Documentation

- `tests/README_PUPPETEER_TESTS.md` - Quick start
- `docs/PUPPETEER_TESTS.md` - Detailed guide
- `PUPPETEER_TEST_SUITE_SUMMARY.md` - Summary

## 🐛 Troubleshooting

### Timeout Issues
```bash
# Increase timeout
NODE_OPTIONS=--experimental-vm-modules jest --testTimeout=300000
```

### Browser Issues (Linux)
```bash
sudo apt-get install -y chromium-browser libx11-xcb1
```

### Memory Issues
```bash
NODE_OPTIONS="--max-old-space-size=4096 --experimental-vm-modules" npm test
```

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
```

## ✅ Pre-Commit Checklist

- [ ] Run unit tests: `npm run test:puppeteer:unit`
- [ ] Run linter: `npm run lint`
- [ ] Fix issues: `npm run lint:fix`
- [ ] Check syntax: `node -c path/to/file.js`

## 🚀 Pre-Deploy Checklist

- [ ] All unit tests pass
- [ ] All E2E tests pass
- [ ] All business tests pass
- [ ] Performance benchmarks met
- [ ] No memory leaks
- [ ] Documentation updated
- [ ] Code linted

## 🎨 Output Colors

- 🟢 Green = Passed
- 🔴 Red = Failed
- 🔵 Blue = Info
- 🟡 Yellow = Warning
- 🔷 Cyan = Section

## 📞 Need Help?

1. Check troubleshooting section
2. Review test output
3. Check documentation
4. Review error messages

---

**Quick Tip:** Start with unit tests (fast) before running E2E tests (slow)!

```bash
npm run test:puppeteer:unit && npm run test:puppeteer:e2e
```
