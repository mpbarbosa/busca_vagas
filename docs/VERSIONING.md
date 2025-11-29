# Semantic Versioning Guide

This project follows [Semantic Versioning 2.0.0](https://semver.org/).

## Current Version

**v1.1.0** (Released: 2025-11-29)

## Version Format

```
MAJOR.MINOR.PATCH
```

### Version Components

- **MAJOR** (1): Incompatible API changes
- **MINOR** (1): Backward-compatible new features
- **PATCH** (0): Backward-compatible bug fixes

## Version History

### v1.1.0 (2025-11-29)

**Minor Release** - Headless Browser & Date Parsing Enhancement

**Features:**
- Added optional `headless` query parameter for browser control
- Chrome headless mode configuration (default: true)
- AWS-ready deployment optimization

**Bug Fixes:**
- Fixed timezone bug in date parsing (`new Date` UTC issue)
- Dates now parse correctly as local time

**Improvements:**
- Enhanced E2E test coverage (2 new tests)
- Updated comprehensive documentation
- Production-ready for AWS deployment

**Breaking Changes:** None

---

### v1.0.0 (Initial Release)

**Major Release** - Initial API Implementation

**Features:**
- RESTful API for hotel vacancy management
- Express.js backend with ES modules
- CORS support
- Environment configuration with dotenv
- Selenium WebDriver integration for automated searches
- Search by date range endpoint
- Jest testing framework
- ESLint code quality

**Endpoints:**
- `GET /` - API information
- `GET /api/health` - Health check
- `GET /api/vagas` - List vacancies
- `GET /api/vagas/search/bydates` - Search by dates

---

## Versioning Rules

### When to Increment MAJOR Version (x.0.0)

Increment when making **incompatible API changes**:

- Removing endpoints
- Changing endpoint URLs
- Modifying request/response formats (breaking)
- Removing required parameters
- Changing authentication methods
- Database schema changes that require migration

**Example:** v1.x.x → v2.0.0

### When to Increment MINOR Version (1.x.0)

Increment when adding **backward-compatible functionality**:

- Adding new endpoints
- Adding optional parameters
- Adding new features
- Enhancing existing features (non-breaking)
- Adding new query options
- Deprecating features (but still supported)

**Example:** v1.0.x → v1.1.0

### When to Increment PATCH Version (1.1.x)

Increment when making **backward-compatible bug fixes**:

- Fixing bugs
- Performance improvements
- Security patches
- Documentation updates
- Internal refactoring
- Dependency updates (patch level)

**Example:** v1.1.0 → v1.1.1

## Version Management

### package.json

The canonical version is stored in `package.json`:

```json
{
  "version": "1.1.0"
}
```

### VERSION File

Plain text file for easy programmatic access:

```
1.1.0
```

### Git Tags

All releases are tagged in git:

```bash
# List all tags
git tag -l

# Create new version tag
git tag -a v1.2.0 -m "Release v1.2.0 - Description"

# Push tag to remote
git push origin v1.2.0
```

### API Responses

Version information is included in API responses:

```bash
# Root endpoint
GET /
{
  "name": "busca_vagas_api",
  "version": "1.1.0",
  "description": "...",
  "message": "Busca Vagas API"
}

# Health endpoint
GET /api/health
{
  "status": "OK",
  "version": "1.1.0",
  "uptime": 1234.56
}
```

## Release Process

### 1. Update Version

```bash
# Update package.json version
npm version minor  # for 1.0.0 → 1.1.0
npm version patch  # for 1.1.0 → 1.1.1
npm version major  # for 1.1.0 → 2.0.0

# Or manually edit package.json and VERSION file
```

### 2. Update Changelog

Update `docs/CHANGELOG_SIMPLESEARCH.md` or create `CHANGELOG.md` with:
- Version number and date
- Features added
- Bug fixes
- Breaking changes (if any)
- Migration notes (if needed)

### 3. Commit Changes

```bash
git add package.json VERSION CHANGELOG.md
git commit -m "chore: bump version to 1.2.0"
```

### 4. Create Git Tag

```bash
git tag -a v1.2.0 -m "Release v1.2.0 - Feature description"
```

### 5. Push to Repository

```bash
git push origin main
git push origin v1.2.0
```

### 6. Create GitHub Release

```bash
gh release create v1.2.0 \
  --title "v1.2.0 - Release Title" \
  --notes "Release notes here"
```

## Pre-release Versions

For alpha, beta, or release candidate versions:

```
1.2.0-alpha.1    # Alpha release
1.2.0-beta.1     # Beta release
1.2.0-rc.1       # Release candidate
```

### Examples

```bash
# Alpha release
npm version 1.2.0-alpha.1

# Beta release
npm version 1.2.0-beta.1

# Release candidate
npm version 1.2.0-rc.1
```

## Version Compatibility

### Node.js Version Support

Current minimum: **Node.js 14.x**

Update `package.json` engines field:

```json
{
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  }
}
```

### API Version Deprecation

When deprecating API features:

1. Announce in advance (preferably 1+ MINOR version)
2. Document in changelog
3. Add deprecation warnings in responses
4. Maintain backward compatibility until MAJOR version bump
5. Remove in next MAJOR version

### Dependency Versions

Follow semantic versioning in dependencies:

```json
{
  "dependencies": {
    "express": "^4.18.2",     // Allow MINOR and PATCH updates
    "dotenv": "~16.3.1",      // Allow PATCH updates only
    "cors": "2.8.5"           // Pin to exact version
  }
}
```

## Automation

### npm version Command

```bash
# Automatically updates package.json, creates commit and tag
npm version patch -m "chore: release v%s"
npm version minor -m "feat: release v%s"
npm version major -m "breaking: release v%s"
```

### Version Check Script

```bash
# Get current version
node -p "require('./package.json').version"

# Or
cat VERSION
```

## Best Practices

1. ✅ **Always update version before release**
2. ✅ **Keep CHANGELOG.md up to date**
3. ✅ **Tag releases in git**
4. ✅ **Use conventional commits** (feat:, fix:, breaking:)
5. ✅ **Test before releasing**
6. ✅ **Document breaking changes clearly**
7. ✅ **Maintain backward compatibility** in MINOR/PATCH
8. ✅ **Include version in API responses**
9. ✅ **Announce deprecations early**
10. ✅ **Follow semantic versioning strictly**

## References

- [Semantic Versioning 2.0.0](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [npm version](https://docs.npmjs.com/cli/v8/commands/npm-version)

## Version Checking

### From Command Line

```bash
# Check package.json version
npm version

# Check installed version
npm list busca_vagas_api

# Check VERSION file
cat VERSION
```

### From API

```bash
# Get version from API
curl http://localhost:3005/ | jq '.version'
curl http://localhost:3005/api/health | jq '.version'
```

### In Code

```javascript
import { readFileSync } from 'fs';
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
console.log(`API Version: ${packageJson.version}`);
```

---

**Last Updated:** 2025-11-29  
**Current Version:** 1.1.0  
**Next Planned Version:** TBD
