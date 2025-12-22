# Development Scripts Directory

This directory contains development and build scripts for the Busca Vagas API project.

## 📋 Directory Purpose

**scripts/** contains development-focused scripts:
- Project setup and initialization
- Development testing workflows
- Build and development tools
- Quick development utilities

**Contrast with shell_scripts/**:
- **shell_scripts/** contains production/operations scripts (deploy, monitoring, validation)
- **scripts/** contains development scripts (setup, quick tests)

## Available Scripts

### 🚀 setup.sh

**Purpose**: Initialize the project by installing all dependencies.

**Usage**:
```bash
./scripts/setup.sh
```

**What it does**:
1. Installs backend dependencies (`npm install`)
2. Installs frontend/client dependencies (`cd client && npm install`)
3. Displays next steps for running the application

**Exit Codes**:
- `0` - Success (all dependencies installed)
- `1` - Error (installation failed)

**Prerequisites**:
- Node.js >= 18.0.0
- npm
- Bash shell
- Internet connection

**Estimated Time**: 2-3 minutes (depending on network speed)

**Output Example**:
```
Iniciando Busca Vagas...
Instalando dependências do backend...
✓ Backend dependencies installed
Instalando dependências do frontend...
✓ Frontend dependencies installed
Instalação concluída!

Para iniciar o desenvolvimento:
  Backend: npm run dev
  Frontend: npm run client
  Ambos: npm run dev:all
```

**When to use**:
- First time setting up the project
- After cloning the repository
- After pulling major changes that affect dependencies

**Troubleshooting**:
- If fails, ensure Node.js >= 18 is installed: `node --version`
- Check npm is available: `npm --version`
- Verify you have write permissions in the directory
- Check internet connectivity

---

### 🧪 test.sh

**Purpose**: Quick test runner for unit and integration tests.

**Usage**:
```bash
./scripts/test.sh
```

**What it does**:
1. Runs unit tests (`npm run test:unit`)
2. Runs integration tests (`npm run test:integration`)
3. Displays consolidated results
4. Reports pass/fail status

**Exit Codes**:
- `0` - All tests passed
- Non-zero - One or more tests failed

**Prerequisites**:
- Dependencies installed (`npm install`)
- Test environment configured

**Estimated Time**: 30-60 seconds

**Output Example**:
```
Executando testes...
Executando testes unitários...
✓ 126 tests passed

Executando testes de integração...
✓ 40 tests passed

Testes concluídos!
```

**Comparison with npm commands**:
| Command | test.sh | npm test |
|---------|---------|----------|
| Unit Tests | ✅ Yes | ✅ Yes |
| Integration Tests | ✅ Yes | ✅ Yes |
| E2E Tests | ❌ No (commented) | ✅ Yes |
| Speed | ⚡ Fast | 🐢 Slower |

**When to use**:
- Quick validation during development
- Pre-commit checks
- Fast feedback loop
- CI/CD pipelines (fast stage)

**Note**: E2E tests are commented out by default as they require a running server. Uncomment if needed.

---

### 🎭 test-puppeteer.js

**Purpose**: Node.js script for running Puppeteer-based E2E tests.

**Usage**:
```bash
node scripts/test-puppeteer.js
# or
npm run test:puppeteer
```

**What it does**:
- Runs quick Puppeteer smoke tests
- Validates browser automation setup
- Tests core search functionality

**Exit Codes**:
- `0` - Tests passed
- `1` - Tests failed

**Prerequisites**:
- Google Chrome/Chromium installed
- Puppeteer dependency installed
- API server running (for E2E tests)

**Features**:
- Headless mode by default (faster)
- Automated browser management
- Screenshot capture on failures

**Related npm scripts**:
```bash
npm run test:puppeteer          # Quick test
npm run test:puppeteer:all      # Full suite
npm run test:puppeteer:e2e      # Detailed E2E
npm run test:puppeteer:business # Business logic
```

---

### 🏃 run-puppeteer-tests.js

**Purpose**: Comprehensive Puppeteer test suite runner.

**Usage**:
```bash
node scripts/run-puppeteer-tests.js
# or
npm run test:puppeteer:all
```

**What it does**:
- Runs complete Puppeteer test suite
- Includes business logic tests
- Validates holiday booking rules
- Tests weekend search functionality

**Exit Codes**:
- `0` - All tests passed
- `1` - One or more tests failed

**Test Coverage**:
- ✅ Basic search functionality
- ✅ Holiday package validation (Christmas, New Year)
- ✅ Weekend search
- ✅ Error handling
- ✅ Browser automation

---

## Usage Guidelines

### Making Scripts Executable

Ensure scripts have execute permissions:

```bash
chmod +x scripts/*.sh
```

### Running Scripts

From the project root:

```bash
# Setup
./scripts/setup.sh

# Quick tests
./scripts/test.sh

# Or with bash explicitly
bash scripts/test.sh
```

### Script Execution Order (New Project)

1. **First Time Setup**:
   ```bash
   ./scripts/setup.sh              # Install dependencies
   npm run dev                     # Start development server
   ```

2. **Development Workflow**:
   ```bash
   ./scripts/test.sh               # Run quick tests
   npm run test                    # Full test suite
   npm run lint                    # Check code quality
   ```

3. **Before Commit**:
   ```bash
   ./scripts/test.sh               # Quick validation
   npm run lint:fix                # Fix linting issues
   npm run test                    # Full test suite
   ```

## Integration with npm Scripts

Most scripts have corresponding npm scripts in `package.json`:

| Script | npm Command | Description |
|--------|-------------|-------------|
| `setup.sh` | - | Initial setup only |
| `test.sh` | `npm test` | Quick test runner |
| `test-puppeteer.js` | `npm run test:puppeteer` | Puppeteer tests |
| `run-puppeteer-tests.js` | `npm run test:puppeteer:all` | Full Puppeteer suite |

**When to use scripts vs npm**:
- Use **scripts** for: Setup, quick validation, automation
- Use **npm** for: Full test suites, specific test types, coverage

## Best Practices

### For Script Authors

1. **Exit Codes**: Always use proper exit codes
   ```bash
   # Success
   exit 0
   
   # Failure
   exit 1
   ```

2. **Error Handling**: Check command success
   ```bash
   npm install || { echo "Install failed"; exit 1; }
   ```

3. **User Feedback**: Provide clear messages
   ```bash
   echo "Installing dependencies..."
   ```

4. **Documentation**: Keep this README updated

### For Script Users

1. **Check Prerequisites**: Ensure Node.js and dependencies are installed
2. **Run from Root**: Always run from project root directory
3. **Read Output**: Pay attention to error messages
4. **Check Exit Code**: Verify script success
   ```bash
   ./scripts/test.sh && echo "Success" || echo "Failed"
   ```

## Troubleshooting

### Permission Denied

```bash
chmod +x scripts/*.sh
```

### Command Not Found

Run from project root:
```bash
cd /path/to/busca_vagas
./scripts/setup.sh
```

### Script Hangs

- Check if waiting for input
- Verify dependencies are available
- Check for network issues (for setup.sh)

### Tests Fail

1. Ensure dependencies are installed:
   ```bash
   npm install
   ```

2. Check Node.js version:
   ```bash
   node --version  # Should be >= 18
   ```

3. Run tests individually:
   ```bash
   npm run test:unit
   npm run test:integration
   ```

## Comparison: scripts/ vs shell_scripts/

| Aspect | scripts/ | shell_scripts/ |
|--------|----------|----------------|
| **Purpose** | Development | Production/Operations |
| **Audience** | Developers | DevOps/Admins |
| **Frequency** | Daily/hourly | Rarely (deploy, maintenance) |
| **Examples** | setup, test | deploy, validate-env, monitoring |
| **Complexity** | Simple, quick | Complex, robust |
| **Error Handling** | Basic | Comprehensive |
| **Documentation** | This file | shell_scripts/README.md |

**Rule of Thumb**:
- If it helps **development**, put it in `scripts/`
- If it's for **production/ops**, put it in `shell_scripts/`

## Adding New Scripts

When adding a new script:

1. **Choose the right directory**:
   - Development tool → `scripts/`
   - Production/ops tool → `shell_scripts/`

2. **Follow naming conventions**:
   - Shell scripts: `kebab-case.sh`
   - Node scripts: `kebab-case.js`

3. **Add shebang**:
   ```bash
   #!/bin/bash
   # or
   #!/usr/bin/env node
   ```

4. **Make executable**:
   ```bash
   chmod +x scripts/new-script.sh
   ```

5. **Update this README** with:
   - Script name and purpose
   - Usage instructions
   - Exit codes
   - Prerequisites
   - Examples

6. **Add to package.json** if appropriate:
   ```json
   "scripts": {
     "new-command": "node scripts/new-script.js"
   }
   ```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Development Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: ./scripts/setup.sh
      
      - name: Run Tests
        run: ./scripts/test.sh
```

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

./scripts/test.sh || {
  echo "Tests failed. Commit aborted."
  exit 1
}
```

## Related Documentation

- [Main README](../README.md) - Project overview
- [shell_scripts/README.md](../shell_scripts/README.md) - Production scripts
- [Test Documentation](../tests/TEST_DOCUMENTATION.md) - Testing guide
- [API Documentation](../docs/api/API.md) - API reference

## Future Scripts (Planned)

- [ ] `build.sh` - Build production bundle
- [ ] `dev.sh` - Start development environment
- [ ] `clean.sh` - Clean build artifacts and caches
- [ ] `lint.sh` - Run linting with auto-fix
- [ ] `coverage.sh` - Generate test coverage report

## Contributing

When contributing scripts:

1. Follow existing patterns and conventions
2. Add comprehensive documentation here
3. Test on multiple environments if possible
4. Keep scripts simple and focused
5. Provide clear error messages
6. Use exit codes correctly

## License

Same license as the parent project (see root LICENSE file).

---

**Last Updated**: 2025-12-22  
**Script Count**: 4 scripts  
**Status**: Active Development
