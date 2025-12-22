# Dependency Management - Quick Reference

**Last Updated**: 2025-12-22

## Quick Commands

### Check for Updates
```bash
# Check outdated packages
npm outdated

# Security audit
npm audit

# Check specific package
npm list <package-name>
```

### Update Packages
```bash
# Update to wanted versions (respects semver)
npm update

# Update specific package
npm install <package-name>@latest

# Update all to latest (careful!)
npx npm-check-updates -u
npm install
```

### Node Version
```bash
# Use pinned version
nvm use

# Install pinned version
nvm install

# Check current version
node --version
```

## File Locations

| File | Purpose | Location |
|------|---------|----------|
| `.nvmrc` | Node version pin | Root directory |
| `package.json` | Dependencies & engines | Root directory |
| `dependabot.yml` | Automation config | `.github/` |
| `DEPENDENCY_MANAGEMENT.md` | Full strategy | `docs/` |

## Update Schedule

| Day | Task |
|-----|------|
| **Monday 9 AM** | Dependabot runs automatically |
| **Every Monday** | Review and merge safe PRs |
| **First Monday** | Monthly dependency review |
| **Quarterly** | Strategic planning & migrations |

## Current Versions

```json
{
  "node": "18.20.0",
  "npm": ">=9.0.0",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.6.1",
    "express": "^4.22.1"
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "eslint": "^8.57.1",
    "jest": "^29.7.0",
    "nodemon": "^3.0.1",
    "puppeteer": "^24.34.0",
    "selenium-webdriver": "^4.39.0",
    "supertest": "^6.3.4"
  }
}
```

## Planned Updates

| Package | Current | Target | Priority | Status |
|---------|---------|--------|----------|--------|
| ESLint | 8.57.1 | 9.x | Medium | 📋 Planned |
| Jest | 29.7.0 | 30.x | Low | 📋 Planned |
| Express | 4.22.1 | 5.x | Low | 🔍 Monitoring |

## Security Status

```
✅ 0 vulnerabilities
✅ All dependencies up to date
✅ Automated scanning enabled
```

## Emergency Rollback

```bash
# Quick rollback
git checkout HEAD~1 package*.json
npm ci
./deploy.sh reload

# Specific package
npm install <package>@<previous-version>
```

## Help & Resources

- **Full Documentation**: `docs/DEPENDENCY_MANAGEMENT.md`
- **Dependabot Config**: `.github/dependabot.yml`
- **Deploy Script**: `shell_scripts/deploy.sh`
- **Security Report**: `SECURITY_FIX_REPORT.md`

## Status

- 🟢 **Security**: Excellent (0 vulnerabilities)
- 🟢 **Updates**: Current (all up to date)
- 🟢 **Automation**: Active (Dependabot running)
- 🟢 **Documentation**: Complete

---

**Questions?** See `docs/DEPENDENCY_MANAGEMENT.md` for detailed information.
