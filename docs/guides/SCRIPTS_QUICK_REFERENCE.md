# Scripts Quick Reference

## Development Scripts (scripts/)

### 🚀 Setup Project
```bash
./scripts/setup.sh
```
**What**: Installs all dependencies (backend + frontend)  
**Exit**: 0 = success, 1 = error  
**Time**: ~2-3 minutes  
**Requires**: Node.js >= 18, npm

### 🧪 Run Quick Tests
```bash
./scripts/test.sh
```
**What**: Runs unit + integration tests  
**Exit**: 0 = passed, non-zero = failed  
**Time**: ~30-60 seconds  
**Requires**: Dependencies installed

### 🎭 Puppeteer Tests
```bash
npm run test:puppeteer          # Quick test
npm run test:puppeteer:all      # Full suite
```
**What**: Browser automation tests  
**Time**: ~1-2 minutes

## Production Scripts (shell_scripts/)

### 🚀 Deploy Service
```bash
./shell_scripts/deploy.sh install
./shell_scripts/deploy.sh start
```
**What**: Deploys as systemd service  
**Requires**: sudo access

### ✅ Validate Environment
```bash
./shell_scripts/validate-environment.sh
```
**What**: Checks all dependencies and tools  
**Exit**: 0 = ready, 1 = issues found

### 🖥️ Check Server Status
```bash
./shell_scripts/check_server_status.sh
```
**What**: Shows nginx and Node.js server status

## When to Use What

| Task | Command | Directory |
|------|---------|-----------|
| **Initial Setup** | `./scripts/setup.sh` | scripts/ |
| **Quick Tests** | `./scripts/test.sh` | scripts/ |
| **Full Tests** | `npm test` | - |
| **Deploy** | `./shell_scripts/deploy.sh install` | shell_scripts/ |
| **Validate Env** | `./shell_scripts/validate-environment.sh` | shell_scripts/ |

## Directory Purpose

- **scripts/**: Development tools (daily use)
- **shell_scripts/**: Production/ops tools (rare use)

## Documentation

- Development scripts: [scripts/README.md](../scripts/README.md)
- Production scripts: [shell_scripts/README.md](../shell_scripts/README.md)
- Main guide: [README.md](../README.md)

## Exit Codes

All scripts follow standard conventions:
- **0** = Success
- **1** = Error/Failure
- **Non-zero** = Specific error codes

---
Quick reference for Busca Vagas API scripts
