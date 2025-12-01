# Production Environment Validation Test Suite

## Overview

Comprehensive JavaScript test suite designed to validate production environment readiness for the Busca Vagas API. This suite performs deep validation of system dependencies, browser automation tools, API functionality, security configurations, and performance metrics.

## 🎯 Purpose

This test suite ensures:

- **System Dependencies**: All required software and libraries are installed and accessible
- **Browser Automation**: Puppeteer and Chrome/Chromium are properly configured
- **API Functionality**: All endpoints are operational and performant
- **Security**: Headless mode and security flags are enforced
- **Performance**: Response times and resource usage are within acceptable limits
- **Integration**: End-to-end workflows execute successfully

## 📋 Test Categories

### 1. System Dependencies Validation

- ✅ Node.js version compatibility (>= 18.0.0)
- ✅ npm installation and accessibility
- ✅ All package.json dependencies installed
- ✅ Project structure integrity

### 2. Browser Automation Dependencies

- ✅ Puppeteer installation verification
- ✅ Chrome/Chromium browser availability
- ✅ Browser launch capability
- ✅ JavaScript execution in browser context

### 3. API Server Validation

- ✅ Server running and accessible
- ✅ Root endpoint metadata
- ✅ CORS configuration
- ✅ 404 error handling
- ✅ Response time performance

### 4. Puppeteer Integration

- ✅ Puppeteer endpoints availability
- ✅ Search operation execution
- ✅ Error handling and reporting

### 5. Security & Configuration

- ✅ Environment variables loaded
- ✅ Headless mode enforcement
- ✅ Security flags configuration

### 6. Performance & Resource Management

- ✅ Memory usage monitoring
- ✅ Browser cleanup verification
- ✅ Resource leak detection

## 🚀 Usage

### Run Complete Validation Suite

```bash
npm run test:prod
```

or

```bash
npm run validate:env
```

### Run Specific Test Categories

```bash
# Run only system dependency tests
NODE_OPTIONS=--experimental-vm-modules jest tests/production-environment-validator.test.js -t "System Dependencies"

# Run only browser automation tests
NODE_OPTIONS=--experimental-vm-modules jest tests/production-environment-validator.test.js -t "Browser Automation"

# Run only API validation tests
NODE_OPTIONS=--experimental-vm-modules jest tests/production-environment-validator.test.js -t "API Server"
```

### Verbose Output

```bash
npm run test:prod -- --verbose
```

## 📊 Expected Output

### Successful Run

```plaintext
🏭 Production Environment Validation Suite
  📦 System Dependencies Validation
    ✓ should verify Node.js version is compatible (>= 18.0.0) (15ms)
      ✅ Node.js version: v20.10.0
    ✓ should verify npm is installed and accessible (45ms)
      ✅ npm version: 10.2.3
    ✓ should verify all package.json dependencies are installed (120ms)
      ✅ All 13 dependencies installed
    ✓ should verify project structure integrity (25ms)
      ✅ Project structure integrity verified (7 paths checked)

  🌐 Browser Automation Dependencies
    ✓ should verify Puppeteer is installed (12ms)
      ✅ Puppeteer version: 24.31.0
    ✓ should verify Chrome/Chromium browser is available (8ms)
      ✅ Browser found: /usr/bin/google-chrome-stable
    ✓ should successfully launch and close Puppeteer browser (2.5s)
      ✅ Browser launched successfully in 2456ms
      ✅ Browser version: Chrome/131.0.6778.85
    ✓ should verify Puppeteer can navigate to pages and execute JavaScript (1.8s)
      ✅ Puppeteer can execute JavaScript in browser context

  🚀 API Server Validation
    ✓ should verify API server is running and accessible (125ms)
      ✅ API server responding on http://localhost:3001
         Version: 1.2.0
         Uptime: 5.32s
    ✓ should verify API root endpoint returns correct metadata (45ms)
      ✅ API metadata: busca_vagas_api v1.2.0
    ✓ should verify CORS is properly configured (38ms)
      ✅ CORS configured: *
    ✓ should handle 404 errors gracefully (32ms)
      ✅ 404 errors handled correctly
    ✓ should verify API response times are within acceptable limits (28ms)
      ✅ API response time: 28ms (threshold: 5000ms)

  🔧 Puppeteer Integration with API
    ✓ should verify Puppeteer endpoints are available (156ms)
      ✅ Endpoint available: /api/vagas/search (status: 200)
      ✅ Endpoint available: /api/vagas/search/weekends (status: 200)
    ✓ should successfully execute Puppeteer search operation (12.5s)
      ✅ Puppeteer search executed successfully
         Execution time: 12456ms
         Has availability: false
         Date searched: 12/25/2025

  🔒 Security & Configuration
    ✓ should verify environment variables are properly loaded (5ms)
      ✅ Environment variables configured
    ✓ should verify headless mode is enforced for production (11.2s)
      ✅ Headless mode enforced: true
    ✓ should verify browser runs with security flags (3ms)
      ✅ Security flags configured: --no-sandbox, --disable-setuid-sandbox, --disable-dev-shm-usage

  📊 Performance & Resource Management
    ✓ should monitor memory usage during operations (10.8s)
      📊 Memory usage increase: 45.23 MB
         Heap used: 125.67 MB
         Heap total: 156.00 MB
    ✓ should verify browser cleanup after operations (38.5s)
      ✅ Browser cleanup verified (0 Chrome processes)

  📝 Final Environment Report
    ✓ should generate comprehensive environment summary (42ms)

============================================================
🎉 PRODUCTION ENVIRONMENT VALIDATION COMPLETE
============================================================
{
  "timestamp": "2025-12-01T02:07:23.696Z",
  "nodeVersion": "v20.10.0",
  "platform": "linux",
  "architecture": "x64",
  "apiStatus": "OK",
  "apiVersion": "1.2.0",
  "apiUptime": 45.234,
  "memoryUsage": {
    "heapUsed": "125.67 MB",
    "heapTotal": "156.00 MB",
    "rss": "245.32 MB"
  }
}
============================================================

Test Suites: 1 passed, 1 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        95.432 s
```

## ❌ Error Messages & Troubleshooting

### Common Errors and Solutions

#### 1. Browser Launch Failure

**Error:**

```plaintext
Failed to launch Puppeteer browser: Failed to launch the browser process

🔍 Common causes:
  1. Chrome/Chromium not installed - see installation instructions above
  2. Missing system libraries - run: sudo apt-get install -y libxss1 libnss3 libasound2
  3. Insufficient permissions - ensure the browser executable has execute permissions
  4. Incompatible Chrome version - update to latest stable version

💡 Debug steps:
  1. Verify browser exists: ls -la /usr/bin/google-chrome-stable
  2. Test browser directly: google-chrome-stable --version
  3. Check system libraries: ldd /usr/bin/google-chrome-stable | grep "not found"
  4. Review Puppeteer logs for detailed error information
```

**Solution:**

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y google-chrome-stable
sudo apt-get install -y libxss1 libnss3 libasound2 libgbm1

# Fedora/RHEL
sudo dnf install google-chrome-stable
sudo dnf install libXScrnSaver nss alsa-lib

# macOS
brew install --cask google-chrome
```

#### 2. Missing Dependencies

**Error:**

```plaintext
Missing dependencies: puppeteer, selenium-webdriver
Run 'npm install' to install missing packages.
```

**Solution:**

```bash
npm install
```

#### 3. API Server Not Accessible

**Error:**

```plaintext
API server is not accessible at http://localhost:3001

🔍 Troubleshooting steps:
  1. Verify server is running: ps aux | grep "node.*server.js"
  2. Check if port is in use: lsof -i :3001
  3. Review server logs for startup errors
  4. Ensure no firewall is blocking the port
  5. Try different port: PORT=3002 npm start
```

**Solution:**

```bash
# Check if port is already in use
lsof -i :3001

# Kill existing process if needed
pkill -f "node.*server.js"

# Start on different port
PORT=3002 npm run test:prod
```

#### 4. Puppeteer Search Operation Failed

**Error:**

```plaintext
Puppeteer search operation failed:
Failed to navigate to target page

🔍 Analysis:
  - Method: puppeteer
  - Headless Mode: true
  - Execution Time: 15234ms

💡 Possible causes:
  1. Browser launch failure - verify Chrome/Chromium installation
  2. Network connectivity issues - check internet connection
  3. Target website unavailable or changed structure
  4. Timeout - operation exceeded maximum allowed time
  5. Missing dependencies - verify all system libraries installed
```

**Solution:**

```bash
# Test browser directly
google-chrome-stable --headless --disable-gpu --dump-dom https://www.google.com

# Check network connectivity
ping -c 3 google.com

# Run detailed Puppeteer tests
npm run test:puppeteer:e2e

# Check system libraries
ldd /usr/bin/google-chrome-stable | grep "not found"

```

#### 5. Headless Mode Not Enforced

**Error:**

```plaintext
⚠️  SECURITY WARNING: Headless mode is disabled!

Headless mode must be enabled in production for:
  - Security (no GUI exposure)
  - Performance (40-60% resource savings)
  - Stability (CI/CD compatibility)

Fix: Ensure src/controllers/puppeteer-script.js has headless: 'new'
```

**Solution:**

```javascript
// src/controllers/puppeteer-script.js
this.browser = await puppeteer.launch({
  headless: 'new',  // ✅ Must be 'new' or true
  executablePath: '/usr/bin/google-chrome-stable',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```

## 🔧 Configuration

### Test Configuration Options

Edit `tests/production-environment-validator.test.js`:

```javascript
const TEST_CONFIG = {
  API_PORT: process.env.PORT || 3001,
  API_HOST: process.env.HOST || 'localhost',
  TIMEOUT_SHORT: 5000,         // Short operations (5s)
  TIMEOUT_MEDIUM: 30000,       // Medium operations (30s)
  TIMEOUT_LONG: 120000,        // Long operations (120s)
  PERFORMANCE_THRESHOLD_MS: 5000,  // Max acceptable response time
  MEMORY_THRESHOLD_MB: 500     // Max acceptable memory increase
};
```

### Environment Variables

```bash
# API Configuration
export PORT=3001
export HOST=localhost
export NODE_ENV=production

# Test Configuration
export TEST_TIMEOUT=180000
```

## 📈 Performance Metrics

The suite monitors and validates:

| Metric | Threshold | Description |
|--------|-----------|-------------|
| API Response Time | < 5000ms | Maximum time for API health check |
| Browser Launch Time | < 10000ms | Maximum time to launch browser |
| Memory Increase | < 500MB | Maximum memory increase per operation |
| Browser Cleanup | 0 orphans | No orphaned Chrome processes after tests |

## 🔍 Debugging

### Enable Verbose Logging

```bash
DEBUG=* npm run test:prod
```

### Run Individual Tests

```bash
NODE_OPTIONS=--experimental-vm-modules jest tests/production-environment-validator.test.js -t "should successfully launch and close Puppeteer browser"
```

### Check System Requirements

```bash
# Node version
node --version

# Chrome version
google-chrome-stable --version

# System libraries
ldd /usr/bin/google-chrome-stable

# Disk space
df -h

# Memory
free -h
```

## 🎯 CI/CD Integration

### GitHub Actions

```yaml
name: Validate Production Environment

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Chrome
        run: |
          sudo apt-get update
          sudo apt-get install -y google-chrome-stable
      
      - name: Validate Environment
        run: npm run validate:env
```

### GitLab CI

```yaml
validate-environment:
  image: node:20
  before_script:
    - apt-get update
    - apt-get install -y google-chrome-stable
    - npm ci
  script:
    - npm run validate:env
```

## 📚 Additional Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [Puppeteer Troubleshooting Guide](https://pptr.dev/troubleshooting)
- [Chrome Installation Guide](https://www.google.com/chrome/)
- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/ladjs/supertest)

## 🤝 Contributing

To add new validation tests:

1. Add test to appropriate `describe` block
2. Follow existing error message format
3. Include detailed troubleshooting steps
4. Update this README with new test description
5. Ensure test has appropriate timeout
6. Add console.log with ✅ emoji for success messages

## 📄 License

ISC
