# Hotel List Cache Implementation

## Overview

The hotel list cache system reduces unnecessary web scraping by caching hotel data in memory. Since the hotel list rarely changes, this optimization significantly improves API performance and reduces load on the AFPESP website.

## Features

- ✅ **In-memory caching** - Fast access with no external dependencies
- ✅ **Configurable TTL** - Set cache expiration via environment variable
- ✅ **Automatic expiration** - Cached data expires automatically
- ✅ **Force refresh** - Option to bypass cache when needed
- ✅ **Cache inspection** - API endpoints to check cache status
- ✅ **Fallback support** - Returns default hotel list if cache/scraping fails

## Configuration

### Environment Variable

Add to your `.env` file:

```bash
# Cache TTL in milliseconds
# Default: 86400000 (24 hours)
HOTEL_CACHE_TTL=86400000
```

**Common TTL values:**
- 1 hour: `3600000`
- 12 hours: `43200000`
- 24 hours: `86400000` (default)
- 7 days: `604800000`
- 30 days: `2592000000`

## How It Works

### Cache Flow

```
┌─────────────────────────────────────────────────────────┐
│               Client Request                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│          GET /api/vagas/hoteis                         │
└────────────────────┬───────────────────────────────────┘
                     │
                     ▼
              ┌──────────────┐
              │ Check Cache  │
              └──────┬───────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    Cache Hit                Cache Miss
         │                       │
         ▼                       ▼
  ┌─────────────┐        ┌──────────────┐
  │Return Cached│        │Return Default│
  │   Hotels    │        │   Hotels     │
  └─────────────┘        └──────────────┘
```

### Scrape with Cache

```
┌─────────────────────────────────────────────────────────┐
│        GET /api/vagas/hoteis/scrape                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
              ┌──────────────┐
              │ force=true?  │
              └──────┬───────┘
                     │
         ┌───────────┴───────────┐
         │                       │
       Yes                      No
         │                       │
         │                  ┌────────────┐
         │                  │Check Cache │
         │                  └─────┬──────┘
         │                        │
         │              ┌─────────┴────────┐
         │              │                  │
         │         Cache Hit          Cache Miss
         │              │                  │
         ▼              ▼                  ▼
  ┌──────────────┐  ┌────────────┐  ┌──────────────┐
  │Scrape Website│  │Return Cache│  │Scrape Website│
  └──────┬───────┘  └────────────┘  └──────┬───────┘
         │                                  │
         ▼                                  ▼
  ┌──────────────┐                   ┌──────────────┐
  │ Update Cache │                   │ Update Cache │
  └──────┬───────┘                   └──────┬───────┘
         │                                  │
         └──────────────┬───────────────────┘
                        │
                        ▼
                 ┌──────────────┐
                 │Return Hotels │
                 └──────────────┘
```

## API Endpoints

### 1. Get All Hotels (with cache)

```http
GET /api/vagas/hoteis
```

**Query Parameters:**
- `nocache` (optional) - Set to `true` to bypass cache

**Response:**
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

**Examples:**
```bash
# Get hotels (uses cache if available)
curl http://localhost:3005/api/vagas/hoteis

# Get hotels (bypass cache)
curl http://localhost:3005/api/vagas/hoteis?nocache=true
```

### 2. Scrape Hotel List

```http
GET /api/vagas/hoteis/scrape
```

**Query Parameters:**
- `force` (optional) - Set to `true` to force refresh cache

**Response:**
```json
{
  "success": true,
  "count": 25,
  "data": [...],
  "source": "AFPESP Website - ddlHoteis dropdown",
  "cached": false,
  "cache": {
    "cached": true,
    "ttlMs": 86400000,
    "ttlHours": "24.00",
    "expiresAt": "2025-12-10T22:09:10.000Z",
    "cacheTTLMs": 86400000,
    "cacheTTLHours": 24
  }
}
```

**Examples:**
```bash
# Scrape (uses cache if available)
curl http://localhost:3005/api/vagas/hoteis/scrape

# Force refresh cache
curl http://localhost:3005/api/vagas/hoteis/scrape?force=true
```

### 3. Get Cache Information

```http
GET /api/vagas/hoteis/cache
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cached": true,
    "ttlMs": 82800000,
    "ttlHours": "23.00",
    "expiresAt": "2025-12-10T22:00:00.000Z",
    "cacheTTLMs": 86400000,
    "cacheTTLHours": 24
  }
}
```

**Example:**
```bash
curl http://localhost:3005/api/vagas/hoteis/cache
```

### 4. Clear Cache

```http
DELETE /api/vagas/hoteis/cache
```

**Response:**
```json
{
  "success": true,
  "message": "Hotel list cache cleared successfully"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:3005/api/vagas/hoteis/cache
```

## Cache Utility

### Location
`src/utils/cache.js`

### Methods

#### `set(key, value, ttl)`
Store a value with expiration time.

```javascript
import cache from './utils/cache.js';

cache.set('my_key', { data: 'value' }, 60000); // 60 seconds
```

#### `get(key)`
Retrieve cached value (returns null if expired/not found).

```javascript
const value = cache.get('my_key');
```

#### `has(key)`
Check if key exists and is not expired.

```javascript
if (cache.has('my_key')) {
  console.log('Cache hit!');
}
```

#### `delete(key)`
Remove a specific key.

```javascript
cache.delete('my_key');
```

#### `clear()`
Clear all cached data.

```javascript
cache.clear();
```

#### `getTTL(key)`
Get remaining time until expiration (in milliseconds).

```javascript
const ttl = cache.getTTL('my_key');
console.log(`Expires in ${ttl}ms`);
```

#### `getStats()`
Get cache statistics.

```javascript
const stats = cache.getStats();
// { total: 10, valid: 8, expired: 2 }
```

#### `cleanup()`
Remove all expired entries.

```javascript
const removed = cache.cleanup();
console.log(`Removed ${removed} expired entries`);
```

## Usage Examples

### Basic Usage

```javascript
import * as hoteisService from './services/hoteisService.js';

// Get hotels (uses cache if available)
const hotels = hoteisService.getAllHotels();

// Get hotels (bypass cache)
const freshHotels = hoteisService.getAllHotels(false);
```

### Scraping with Cache

```javascript
// Scrape (uses cache if available, scrapes only if needed)
const hotels = await hoteisService.scrapeHotelList();

// Force refresh (always scrapes, updates cache)
const freshHotels = await hoteisService.scrapeHotelList(true);
```

### Cache Management

```javascript
// Check cache status
const cacheInfo = hoteisService.getCacheInfo();
console.log('Cached:', cacheInfo.cached);
console.log('Expires in:', cacheInfo.ttlHours, 'hours');

// Clear cache
hoteisService.clearCache();
```

## Performance Benefits

### Without Cache
- Every `/api/vagas/hoteis` request: **Reads static array** (~1ms)
- Every `/api/vagas/hoteis/scrape` request: **Launches browser, scrapes website** (~3-5 seconds)

### With Cache
- First scrape: **3-5 seconds** (scrapes + caches)
- Subsequent requests (24h): **< 1ms** (memory read)
- Reduction: **~99.9% faster** for cached requests

### Example Metrics

| Scenario | Without Cache | With Cache | Improvement |
|----------|---------------|------------|-------------|
| Get hotels (API call) | 1ms | 0.1ms | 10x faster |
| First scrape | 4000ms | 4000ms | Same |
| Subsequent scrape (cached) | 4000ms | 0.1ms | 40,000x faster |
| 100 scrape calls/day | 400 seconds | 4 seconds | 99% reduction |

## Best Practices

### 1. Set Appropriate TTL

```bash
# For stable hotel lists (recommended)
HOTEL_CACHE_TTL=86400000  # 24 hours

# For frequently changing data
HOTEL_CACHE_TTL=3600000   # 1 hour

# For very stable data
HOTEL_CACHE_TTL=604800000 # 7 days
```

### 2. Monitor Cache Status

```bash
# Check cache regularly
curl http://localhost:3005/api/vagas/hoteis/cache

# Response shows if cache is still valid
{
  "cached": true,
  "ttlHours": "12.5"  # Still 12.5 hours until expiration
}
```

### 3. Force Refresh When Needed

```bash
# When you know hotels have changed
curl http://localhost:3005/api/vagas/hoteis/scrape?force=true
```

### 4. Implement Monitoring

```javascript
// Log cache hits/misses
const cacheInfo = hoteisService.getCacheInfo();
console.log('Cache status:', cacheInfo.cached ? 'HIT' : 'MISS');
```

## Testing

Run cache-specific tests:

```bash
# Test cache utility
npm run test:unit -- tests/unit/cache.test.js

# Test hotel service cache
npm run test:unit -- tests/unit/hoteisService-cache.test.js
```

## Troubleshooting

### Cache Not Working

1. **Check environment variable:**
   ```bash
   echo $HOTEL_CACHE_TTL
   ```

2. **Verify cache status:**
   ```bash
   curl http://localhost:3005/api/vagas/hoteis/cache
   ```

3. **Clear and rebuild cache:**
   ```bash
   curl -X DELETE http://localhost:3005/api/vagas/hoteis/cache
   curl http://localhost:3005/api/vagas/hoteis/scrape?force=true
   ```

### Cache Expiring Too Soon

Increase TTL in `.env`:
```bash
HOTEL_CACHE_TTL=172800000  # 48 hours
```

### Memory Concerns

The hotel list cache is minimal (~5KB). For production with high traffic, consider:
- Using Redis for distributed caching
- Implementing cache size limits
- Adding cache eviction policies

## Migration Notes

### Upgrading from Non-Cached Version

No breaking changes. The API works exactly the same:

- `/api/vagas/hoteis` - Still returns hotel list (now faster with cache)
- `/api/vagas/hoteis/scrape` - Still scrapes (now caches result)

New optional features:
- Add `?nocache=true` to bypass cache
- Add `?force=true` to force refresh
- Use new cache management endpoints

### Backward Compatibility

✅ All existing endpoints work unchanged
✅ No code changes needed in clients
✅ Cache is transparent to consumers
✅ Falls back to default hotel list if scraping fails

---

**Version:** 1.0.0  
**Last Updated:** 2025-12-09  
**Related Documentation:**
- [API Documentation](./API.md)
- [Architecture](./ARCHITECTURE.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
