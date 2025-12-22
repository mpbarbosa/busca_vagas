# Dependency Management Strategy

**Date**: 2025-12-22  
**Version**: 1.0.0  
**Status**: ✅ IMPLEMENTED

## Overview

This document outlines the dependency management strategy for the Busca Vagas API project, including version pinning, update procedures, and automation configuration.

## Version Pinning

### Node.js Version

**File**: `.nvmrc`
```
18.20.0
```

**Purpose**: 
- Ensures consistent Node.js version across all environments
- Used by nvm, CI/CD pipelines, and deployment tools
- Specifies LTS version for stability

**Usage**:
```bash
# Install and use the pinned version
nvm install
nvm use

# Verify version
node --version  # Should output v18.20.0
```

### Package.json Engines

**Field**: `engines`
```json
{
  "engines": {
    "node": ">=18.20.0 <19.0.0 || >=20.0.0",
    "npm": ">=9.0.0"
  }
}
```

**Purpose**:
- Enforces minimum Node.js and npm versions
- Prevents installation on incompatible versions
- Documents version requirements

**Supported Versions**:
- Node.js 18.20.0+ (LTS) ✅
- Node.js 20.x (Current LTS) ✅
- npm 9.0.0+ ✅

## Dependency Updates - This Week ✅

### Safe Minor Updates Applied

#### 1. Puppeteer
```json
"puppeteer": "^24.31.0" → "^24.34.0"
```
- **Change**: Patch update (24.31.0 → 24.34.0)
- **Risk**: Low (bug fixes and improvements)
- **Impact**: Better browser automation stability
- **Tested**: ✅ Puppeteer tests pass

#### 2. Selenium WebDriver
```json
"selenium-webdriver": "^4.15.0" → "^4.39.0"
```
- **Change**: Minor update (4.15.0 → 4.39.0)
- **Risk**: Low (backward compatible)
- **Impact**: Improved WebDriver compatibility
- **Tested**: ✅ All tests pass

#### 3. Express
```json
"express": "^4.18.2" → "^4.22.1"
```
- **Change**: Minor update (4.18.2 → 4.22.1)
- **Risk**: Low (security fixes)
- **Impact**: Security improvements
- **Tested**: ✅ API tests pass

#### 4. dotenv
```json
"dotenv": "^16.3.1" → "^16.6.1"
```
- **Change**: Patch update (16.3.1 → 16.6.1)
- **Risk**: Low (bug fixes)
- **Impact**: Better environment variable handling
- **Tested**: ✅ Configuration loads correctly

#### 5. ESLint
```json
"eslint": "^8.52.0" → "^8.57.1"
```
- **Change**: Patch update (8.52.0 → 8.57.1)
- **Risk**: Low (bug fixes in linter)
- **Impact**: Better linting rules
- **Tested**: ✅ Linting passes

#### 6. Concurrently
```json
"concurrently": "^8.2.1" → "^8.2.2"
```
- **Change**: Patch update
- **Risk**: Low
- **Impact**: Better concurrent process handling
- **Tested**: ✅ Dev mode works

#### 7. Supertest
```json
"supertest": "^6.3.3" → "^6.3.4"
```
- **Change**: Patch update
- **Risk**: Low
- **Impact**: Better API testing
- **Tested**: ✅ Integration tests pass

### Update Summary

| Package | Old Version | New Version | Type | Risk | Status |
|---------|-------------|-------------|------|------|--------|
| puppeteer | 24.31.0 | 24.34.0 | Patch | Low | ✅ |
| selenium-webdriver | 4.15.0 | 4.39.0 | Minor | Low | ✅ |
| express | 4.18.2 | 4.22.1 | Minor | Low | ✅ |
| dotenv | 16.3.1 | 16.6.1 | Patch | Low | ✅ |
| eslint | 8.52.0 | 8.57.1 | Patch | Low | ✅ |
| concurrently | 8.2.1 | 8.2.2 | Patch | Low | ✅ |
| supertest | 6.3.3 | 6.3.4 | Patch | Low | ✅ |

**Results**:
- ✅ 7 packages updated
- ✅ 0 vulnerabilities
- ✅ All tests passing
- ✅ No breaking changes

## Automated Dependency Management

### Dependabot Configuration

**File**: `.github/dependabot.yml`

**Features**:
1. **Weekly Schedule**: Monday at 9:00 AM
2. **PR Limits**: Max 5 open PRs at once
3. **Grouping**: Minor/patch updates grouped together
4. **Labels**: Auto-labeled as "dependencies"
5. **Assignees**: Auto-assigned to maintainers
6. **Commit Prefix**: `chore(deps):` for consistency

**Update Strategy**:
```yaml
groups:
  development-dependencies:
    dependency-type: "development"
    update-types: ["minor", "patch"]
  production-dependencies:
    dependency-type: "production"
    update-types: ["minor", "patch"]
```

**Ignored Major Updates**:
Major version updates are ignored for manual review:
- ESLint 8 → 9 (config rewrite needed)
- Jest 29 → 30 (low risk, planned)
- Express 4 → 5 (breaking changes)
- Concurrently 8 → 9 (evaluate impact)
- Supertest 6 → 7 (API changes)

### Why Ignore Major Updates?

1. **ESLint 9**: Requires flat config migration
2. **Express 5**: Still stabilizing, breaking changes
3. **Jest 30**: Low risk but needs testing
4. **Others**: Require evaluation for breaking changes

## Next Sprint - Planned Updates 📋

### 1. ESLint 9 Migration (Priority: Medium)

**Current**: ESLint 8.57.1  
**Target**: ESLint 9.x  
**Effort**: 2-4 hours

**Requirements**:
- Migrate to flat config format
- Update ESLint plugins
- Test all linting rules
- Update CI/CD scripts

**Migration Steps**:
```bash
# 1. Install ESLint 9
npm install -D eslint@9

# 2. Create eslint.config.js (flat config)
# Replace .eslintrc.json

# 3. Update plugins
npm install -D @eslint/js

# 4. Test
npm run lint

# 5. Fix any issues
npm run lint:fix
```

**Resources**:
- [ESLint v9 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- [Flat Config Guide](https://eslint.org/docs/latest/use/configure/configuration-files-new)

### 2. Jest 30 Upgrade (Priority: Low)

**Current**: Jest 29.7.0  
**Target**: Jest 30.x  
**Effort**: 1-2 hours  
**Risk**: Low

**Changes Expected**:
- Minor API improvements
- Better ES modules support
- Performance improvements

**Migration Steps**:
```bash
# 1. Update Jest
npm install -D jest@30

# 2. Run tests
npm test

# 3. Check for deprecation warnings
npm test 2>&1 | grep -i deprecat

# 4. Fix if needed
```

### 3. Dependabot Automation Setup (Priority: High)

**Status**: ✅ COMPLETE  
**File**: `.github/dependabot.yml`

**Configuration**:
- Weekly checks on Monday
- Auto-labeled PRs
- Grouped updates
- Major versions ignored

**Monitoring**:
- Check Dependabot PRs weekly
- Review and merge safe updates
- Test before merging

## Long-term Strategy 🎯

### 1. Express 5 Migration

**Timeline**: Q2 2025 or when stable  
**Current**: Express 4.22.1  
**Target**: Express 5.x

**Evaluation Criteria**:
- [ ] Express 5 reaches stable release
- [ ] Major plugins support Express 5
- [ ] Breaking changes documented
- [ ] Migration guide available
- [ ] Community adoption > 50%

**Preparation**:
- Monitor Express 5 changelogs
- Test in development branch
- Update middleware as needed
- Document breaking changes

### 2. Selenium Evaluation

**Question**: Do we still need Selenium WebDriver?

**Current Usage**:
```bash
grep -r "selenium" src/ tests/
# Check actual usage
```

**Options**:
1. **Keep**: If heavily used for E2E testing
2. **Replace**: Use Puppeteer exclusively (already using it)
3. **Remove**: If not used at all

**Decision Factors**:
- Current test coverage with Selenium
- Puppeteer capabilities vs Selenium
- Maintenance burden
- Cross-browser testing needs

**Action**:
```bash
# 1. Audit usage
npm ls selenium-webdriver

# 2. Check test dependencies
grep -r "selenium" tests/

# 3. Evaluate alternatives
# If not needed: npm uninstall selenium-webdriver
```

### 3. CI/CD Security Scanning

**Goal**: Integrate security scanning into deployment pipeline

**Tools to Evaluate**:
1. **npm audit**: Already using ✅
2. **Snyk**: Vulnerability scanning
3. **Dependabot Security**: GitHub native
4. **OWASP Dependency Check**: OWASP tool
5. **Socket.dev**: Supply chain security

**Implementation Plan**:

#### Phase 1: Basic Security (✅ DONE)
- [x] npm audit in deploy script
- [x] Automatic vulnerability fixes
- [x] Dependabot configuration

#### Phase 2: Enhanced Security (Next Sprint)
- [ ] Add npm audit to CI/CD
- [ ] Fail builds on critical vulnerabilities
- [ ] Security badge in README
- [ ] Automated security reports

#### Phase 3: Advanced Security (Long-term)
- [ ] Snyk integration
- [ ] SAST scanning
- [ ] License compliance checking
- [ ] Supply chain verification

**GitHub Actions Example**:
```yaml
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run security audit
        run: npm audit --audit-level=moderate
      
      - name: Check for vulnerabilities
        run: |
          VULN_COUNT=$(npm audit --json | jq '.metadata.vulnerabilities.total')
          if [ "$VULN_COUNT" -gt 0 ]; then
            echo "Found $VULN_COUNT vulnerabilities"
            exit 1
          fi
```

## Update Procedures

### Weekly Maintenance

**Every Monday**:
1. Review Dependabot PRs
2. Check npm outdated: `npm outdated`
3. Review security advisories
4. Merge safe updates
5. Run full test suite

### Monthly Review

**First Monday of Month**:
1. Review all dependencies
2. Check for major updates
3. Evaluate new tools
4. Update documentation
5. Plan migrations

### Quarterly Planning

**Start of Quarter**:
1. Review long-term strategy
2. Plan major updates
3. Evaluate dependencies
4. Remove unused packages
5. Update roadmap

## Testing Requirements

### Before Merging Updates

**Required Checks**:
```bash
# 1. Security audit
npm audit

# 2. Linting
npm run lint

# 3. Unit tests
npm run test:unit

# 4. Integration tests
npm run test:integration

# 5. E2E tests (if time permits)
npm run test:e2e

# 6. Application start
npm start
# Verify API responds
curl http://localhost:3000/api/health
```

### After Deployment

**Production Verification**:
```bash
# 1. Health check
curl https://api.example.com/api/health

# 2. Monitor logs
./deploy.sh logs -f

# 3. Check service status
./deploy.sh status

# 4. Run production validator
npm run test:prod
```

## Rollback Procedure

If an update causes issues:

### Quick Rollback
```bash
# 1. Revert package.json and package-lock.json
git checkout HEAD~1 package*.json

# 2. Reinstall dependencies
npm ci

# 3. Redeploy
./deploy.sh reload
```

### Detailed Rollback
```bash
# 1. Identify problematic package
npm ls <package-name>

# 2. Downgrade specific package
npm install <package-name>@<previous-version>

# 3. Test
npm test

# 4. Commit fix
git add package*.json
git commit -m "fix(deps): rollback <package-name> to <version>"

# 5. Deploy
./deploy.sh reload
```

## Best Practices

### 1. Version Pinning Strategy

**Production Dependencies**: Pin exact versions
```json
"express": "4.22.1"  // Exact version
```

**Development Dependencies**: Allow patch updates
```json
"jest": "^29.7.0"  // Allow 29.7.x
```

### 2. Update Frequency

| Update Type | Frequency | Auto-merge |
|------------|-----------|------------|
| Security patches | Immediate | Yes |
| Patch updates | Weekly | Yes* |
| Minor updates | Bi-weekly | No |
| Major updates | Planned | No |

*After passing tests

### 3. Documentation

**Always Document**:
- Major version updates
- Breaking changes
- Migration procedures
- Rollback steps
- Testing results

### 4. Communication

**Notify Team**:
- Before major updates
- After security patches
- If issues occur
- When planning migrations

## Monitoring and Alerts

### Tools

1. **Dependabot**: Automated PRs
2. **npm outdated**: CLI checking
3. **GitHub Security**: Security advisories
4. **npm audit**: Vulnerability scanning

### Metrics to Track

- Number of outdated packages
- Time to update
- Failed updates
- Security vulnerabilities
- Test failures from updates

## Resources

### Documentation
- [npm Version Guidelines](https://docs.npmjs.com/about-semantic-versioning)
- [Dependabot Configuration](https://docs.github.com/en/code-security/dependabot)
- [Node.js LTS Schedule](https://nodejs.org/en/about/releases/)

### Tools
- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)
- [depcheck](https://www.npmjs.com/package/depcheck)
- [snyk](https://snyk.io/)

## Summary

### Implemented ✅
- [x] Node.js version pinning (.nvmrc)
- [x] Engines field in package.json
- [x] Safe minor/patch updates
- [x] Dependabot configuration
- [x] Security scanning in deploy script

### Planned 📋
- [ ] ESLint 9 migration
- [ ] Jest 30 upgrade
- [ ] Selenium evaluation
- [ ] CI/CD security scanning
- [ ] Express 5 monitoring

### Status
- **Security**: ✅ 0 vulnerabilities
- **Dependencies**: ✅ Up to date
- **Automation**: ✅ Configured
- **Documentation**: ✅ Complete
- **Ready for**: Production 🚀

---

**Last Updated**: 2025-12-22  
**Next Review**: 2025-12-29 (Weekly)  
**Maintainer**: Busca Vagas Team
