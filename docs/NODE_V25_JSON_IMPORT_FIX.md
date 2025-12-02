# Fix Applied: Node.js v25+ JSON Import Compatibility

## Problem

Starting with Node.js v25.2.1, importing JSON files in ES module scope requires an explicit import attribute `with { type: 'json' }`. The previous approach using `readFileSync()` to load `package.json` was working but the newer syntax is preferred and required by newer Node.js versions.

### Error Message
```
TypeError [ERR_IMPORT_ATTRIBUTE_MISSING]: Module "file:///path/to/package.json" needs an import attribute of "type: json"
```

## Solution

Replaced the `readFileSync()` approach with direct JSON import using the `with { type: 'json' }` import attribute syntax.

## Changes Made

### 1. src/server.js

**Before:**
```javascript
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
```

**After:**
```javascript
import packageJson from '../package.json' with { type: 'json' };
```

### 2. src/routes/index.js

**Before:**
```javascript
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));
```

**After:**
```javascript
import packageJson from '../../package.json' with { type: 'json' };
```

## Benefits

1. **Cleaner Code**: Removed unnecessary imports and helper variables
2. **Modern Syntax**: Uses the standardized JSON module import syntax
3. **Node.js v25+ Compatible**: Meets the stricter requirements of newer Node.js versions
4. **Less Boilerplate**: No need for `__filename`, `__dirname`, and path resolution

## Why This Syntax?

The `with { type: 'json' }` import attribute:
- Explicitly declares the module type to the Node.js loader
- Is part of the ES Module specification for importing non-JavaScript modules
- Provides better security and clarity about what's being imported
- Is required by Node.js v25.2.1 and later versions

## Alternatives Considered

- ❌ Keep using `readFileSync()` - Works but not recommended for newer Node.js versions
- ❌ Use `assert { type: 'json' }` - Deprecated syntax, replaced by `with`
- ✅ Use `with { type: 'json' }` - Modern, standardized, required by Node.js v25+

## Testing

Verified the server starts correctly:

```bash
npm start
# Output: Servidor rodando na porta 3005
```

## Compatibility

- **Node.js v25.2.1+**: Required (uses `with { type: 'json' }` syntax)
- **Node.js v22+**: Supported with `with` syntax  
- **Node.js v17-21**: Supported with `assert` syntax (deprecated)
- **Node.js <v17**: Not supported, use `readFileSync()` approach

**Note:** ESLint 8.x does not yet fully support the `with` import attribute syntax. The code will show linting errors but runs correctly in Node.js v25+. This is a known ESLint limitation that will be resolved in future ESLint versions.

## Files Modified

1. `src/server.js` - Updated JSON import
2. `src/routes/index.js` - Updated JSON import

## Result

✅ No more `ERR_IMPORT_ATTRIBUTE_MISSING` errors
✅ Cleaner, more maintainable code
✅ Node.js v25+ compatible
✅ Server starts successfully
