# Hotel Cache Quick Reference

## Quick Start

### Check Cache Status
```bash
curl http://localhost:3005/api/vagas/hoteis/cache
```

### Get Hotels (with cache)
```bash
curl http://localhost:3005/api/vagas/hoteis
```

### Force Cache Refresh
```bash
curl http://localhost:3005/api/vagas/hoteis/scrape?force=true
```

### Clear Cache
```bash
curl -X DELETE http://localhost:3005/api/vagas/hoteis/cache
```

## Configuration

**File:** `.env`
```bash
# Set cache expiration time
HOTEL_CACHE_TTL=86400000  # 24 hours in milliseconds
```

**Common values:**
- 1 hour: `3600000`
- 6 hours: `21600000`
- 12 hours: `43200000`
- 24 hours: `86400000` (default)
- 7 days: `604800000`

## API Endpoints

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/vagas/hoteis` | GET | Get hotel list | `?nocache=true` to bypass |
| `/api/vagas/hoteis/scrape` | GET | Scrape hotels | `?force=true` to refresh |
| `/api/vagas/hoteis/cache` | GET | Cache info | None |
| `/api/vagas/hoteis/cache` | DELETE | Clear cache | None |

## Code Usage

### In Your Service
```javascript
import cache from './utils/cache.js';

// Store data
cache.set('my_key', data, 60000); // 60 seconds

// Retrieve data
const data = cache.get('my_key');

// Check existence
if (cache.has('my_key')) {
  // Cache hit
}

// Clear specific key
cache.delete('my_key');
```

### Hotel Service Methods
```javascript
import * as hoteisService from './services/hoteisService.js';

// Get hotels (uses cache if available)
const hotels = hoteisService.getAllHotels();

// Get hotels (bypass cache)
const hotels = hoteisService.getAllHotels(false);

// Scrape (uses cache if available)
const hotels = await hoteisService.scrapeHotelList();

// Scrape (force refresh)
const hotels = await hoteisService.scrapeHotelList(true);

// Get cache info
const info = hoteisService.getCacheInfo();

// Clear cache
hoteisService.clearCache();
```

## Response Format

```json
{
  "success": true,
  "count": 25,
  "data": [...],
  "cache": {
    "cached": true,
    "ttlMs": 82800000,
    "ttlHours": "23.00",
    "expiresAt": "2025-12-10T22:00:00.000Z",
    "cacheTTLMs": 86400000,
    "cacheTTLHours": 24
  }
}
```

## Testing

```bash
# Run cache tests
npm run test:unit -- tests/unit/cache.test.js

# Run hotel service cache tests
npm run test:unit -- tests/unit/hoteisService-cache.test.js
```

## Troubleshooting

### Cache not working?
1. Check env variable: `echo $HOTEL_CACHE_TTL`
2. Check cache status: `curl http://localhost:3005/api/vagas/hoteis/cache`
3. Clear and rebuild: 
   ```bash
   curl -X DELETE http://localhost:3005/api/vagas/hoteis/cache
   curl http://localhost:3005/api/vagas/hoteis/scrape?force=true
   ```

### Cache expiring too fast?
Increase TTL in `.env`:
```bash
HOTEL_CACHE_TTL=172800000  # 48 hours
```

### Need fresh data?
```bash
curl http://localhost:3005/api/vagas/hoteis/scrape?force=true
```

## Performance Impact

- **Before:** Every scrape = 3-5 seconds
- **After:** First scrape = 3-5 seconds, subsequent = <1ms
- **Improvement:** ~99.9% faster for cached requests

## Files

- **Cache utility:** `src/utils/cache.js`
- **Hotel service:** `src/services/hoteisService.js`
- **Hotel controller:** `src/controllers/hoteisController.js`
- **Routes:** `src/routes/vagasRoutes.js`
- **Documentation:** `docs/HOTEL_CACHE_IMPLEMENTATION.md`

---

**For full documentation:** See `docs/HOTEL_CACHE_IMPLEMENTATION.md`
