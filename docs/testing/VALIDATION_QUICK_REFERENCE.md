# Production Environment Validation - Quick Reference Guide

## 🚀 Quick Start

```bash
# Run complete validation suite
npm run test:prod

# Or use the alias
npm run validate:env
```

## ✅ What Gets Validated

### 1. System Dependencies (4 tests)
- Node.js >= 18.0.0
- npm installation
- All dependencies from package.json
- Project structure integrity

### 2. Browser Automation (4 tests)
- Puppeteer installation
- Chrome/Chromium availability
- Browser launch capability
- JavaScript execution

### 3. API Server (5 tests)
- Server accessibility
- Endpoint metadata
- CORS configuration
- Error handling (404)
- Response time performance

### 4. Puppeteer Integration (2 tests)
- Endpoint availability
- Search operation execution

### 5. Security (3 tests)
- Environment variables
- Headless mode enforcement
- Security flags

### 6. Performance (2 tests)
- Memory usage monitoring
- Browser cleanup verification

**Total: 20 comprehensive validation tests**

## 🎯 Common Error Messages

### ❌ Browser Launch Failed

**Error Message:**
```
Failed to launch Puppeteer browser: Failed to launch the browser process

🔍 Common causes:
  1. Chrome/Chromium not installed
  2. Missing system libraries
  3. Insufficient permissions
  4. Incompatible Chrome version
```

**Quick Fix:**
```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y google-chrome-stable

# Install missing libraries
sudo apt-get install -y libxss1 libnss3 libasound2 libgbm1
```

---

### ❌ API Server Not Accessible

**Error Message:**
```
API server is not accessible at http://localhost:3001
Error: connect ECONNREFUSED
```

**Quick Fix:**
```bash
# Check if port is in use
lsof -i :3001

# Kill conflicting process
pkill -f "node.*server.js"

# Use different port
PORT=3002 npm run test:prod
```

---

### ❌ Missing Dependencies

**Error Message:**
```
Missing dependencies: puppeteer, supertest
Run 'npm install' to install missing packages.
```

**Quick Fix:**
```bash
npm install
```

---

### ❌ Puppeteer Search Failed

**Error Message:**
```
Puppeteer search operation failed:
Failed to navigate to target page

💡 Possible causes:
  1. Browser launch failure
  2. Network connectivity issues
  3. Target website unavailable
  4. Timeout exceeded
  5. Missing dependencies
```

**Quick Fix:**
```bash
# Test browser directly
google-chrome-stable --version

# Check network
ping -c 3 google.com

# Run detailed tests
npm run test:puppeteer:e2e

# Check system libraries
ldd /usr/bin/google-chrome-stable | grep "not found"
```

---

### ⚠️  Headless Mode Disabled

**Error Message:**
```
SECURITY WARNING: Headless mode is disabled!

Headless mode must be enabled for:
  - Security (no GUI exposure)
  - Performance (40-60% savings)
  - Stability (CI/CD compatibility)
```

**Quick Fix:**
```javascript
// src/controllers/puppeteer-script.js
this.browser = await puppeteer.launch({
  headless: 'new',  // ✅ Set to 'new' or true
  executablePath: '/usr/bin/google-chrome-stable',
  // ...
});
```

---

## 🔧 Configuration

### Change Test Port
```bash
PORT=3002 npm run test:prod
```

### Adjust Timeouts
Edit `tests/production-environment-validator.test.js`:
```javascript
const TEST_CONFIG = {
  TIMEOUT_SHORT: 5000,    // 5 seconds
  TIMEOUT_MEDIUM: 30000,  // 30 seconds
  TIMEOUT_LONG: 120000,   // 120 seconds
};
```

### Performance Thresholds
```javascript
const TEST_CONFIG = {
  PERFORMANCE_THRESHOLD_MS: 5000,  // API response time
  MEMORY_THRESHOLD_MB: 500         // Memory increase
};
```

---

## 📊 Expected Output

### ✅ All Tests Pass
```
🏭 Production Environment Validation Suite
  📦 System Dependencies Validation
    ✓ should verify Node.js version (15 ms)
    ✓ should verify npm is installed (60 ms)
    ✓ should verify all dependencies (1 ms)
    ✓ should verify project structure (1 ms)
  🌐 Browser Automation Dependencies
    ✓ should verify Puppeteer (1 ms)
    ✓ should verify Chrome/Chromium (1 ms)
    ✓ should launch browser (178 ms)
    ✓ should execute JavaScript (215 ms)
  🚀 API Server Validation
    ✓ should verify server running (16 ms)
    ✓ should verify root endpoint (4 ms)
    ✓ should verify CORS (1 ms)
    ✓ should handle 404 errors (4 ms)
    ✓ should verify response times (2 ms)
  🔧 Puppeteer Integration
    ✓ should verify endpoints (156 ms)
    ✓ should execute search (12.5s)
  🔒 Security & Configuration
    ✓ should verify env vars (5 ms)
    ✓ should verify headless mode (11.2s)
    ✓ should verify security flags (3 ms)
  📊 Performance & Resource
    ✓ should monitor memory (10.8s)
    ✓ should verify cleanup (38.5s)
  📝 Final Report
    ✓ should generate summary (42 ms)

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
Tests:       20 passed, 20 total
Time:        95.432 s
```

---

## 🐛 Debug Commands

### Check System Requirements
```bash
node --version                      # Node version
google-chrome-stable --version      # Chrome version
ldd /usr/bin/google-chrome-stable  # System libraries
df -h                              # Disk space
free -h                            # Memory
```

### Check Server Status
```bash
ps aux | grep "node.*server.js"    # Server running?
lsof -i :3001                      # Port in use?
curl http://localhost:3001/api/health  # API health
```

### Run Individual Tests
```bash
# Run specific test category
NODE_OPTIONS=--experimental-vm-modules jest tests/production-environment-validator.test.js -t "System Dependencies"

# Run specific test
NODE_OPTIONS=--experimental-vm-modules jest tests/production-environment-validator.test.js -t "should successfully launch"
```

---

## 🔍 Verbose Logging

```bash
# Enable verbose output
npm run test:prod -- --verbose

# Enable debug mode
DEBUG=* npm run test:prod

# Show stack traces
npm run test:prod -- --verbose --no-coverage
```

---

## 📦 Installation Commands

### Ubuntu/Debian
```bash
# Install Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt-get install -f

# Install dependencies
sudo apt-get install -y libxss1 libnss3 libasound2 libgbm1
```

### Fedora/RHEL
```bash
# Install Chrome
sudo dnf install google-chrome-stable

# Install dependencies
sudo dnf install libXScrnSaver nss alsa-lib
```

### macOS
```bash
# Install Chrome
brew install --cask google-chrome

# Or Chromium
brew install --cask chromium
```

---

## 🎯 CI/CD Integration

### GitHub Actions
```yaml
- name: Validate Environment
  run: npm run validate:env
```

### GitLab CI
```yaml
validate:
  script:
    - npm run validate:env
```

---

## 📞 Support

### Full Documentation
- See: `docs/PRODUCTION_ENVIRONMENT_VALIDATION.md`

### Puppeteer Issues
- https://pptr.dev/troubleshooting

### Chrome Installation
- https://www.google.com/chrome/

---

## ⏱️ Estimated Runtime

- **Minimum**: ~60 seconds (all pass quickly)
- **Average**: ~90 seconds (normal execution)
- **Maximum**: ~180 seconds (timeout threshold)

---

## 💡 Tips

1. **Run before deployment** to catch issues early
2. **Run after system updates** to verify compatibility
3. **Run in CI/CD** for automated validation
4. **Check logs** for detailed error information
5. **Use verbose mode** when debugging failures

---

## 📈 Success Criteria

All 20 tests must pass:
- ✅ System dependencies verified
- ✅ Browser automation functional
- ✅ API server operational
- ✅ Security enforced
- ✅ Performance acceptable
- ✅ Resources managed properly

---

**Last Updated:** 2025-12-01  
**Version:** 1.2.0
