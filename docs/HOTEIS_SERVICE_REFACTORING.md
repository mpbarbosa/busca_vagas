# Hoteis Service Refactoring for Referential Transparency

## Overview

The `hoteisService.js` has been refactored to separate **pure functions** (referentially transparent) from **impure functions** (side effects), following the principles outlined in [REFERENTIAL_TRANSPARENCY.md](./REFERENTIAL_TRANSPARENCY.md).

## Date
2025-12-09

## Motivation

The original service mixed pure business logic with side effects (cache operations, I/O, Date.now()), making it:
- Harder to test
- Difficult to reason about
- Not suitable for optimization techniques like memoization
- Coupled to external state

## Changes Made

### Pure Functions (Referentially Transparent)

These functions always return the same output for the same input and have no side effects:

#### 1. `findHotelById(hotels, id)`
```javascript
// PURE: Same input → same output, no side effects
export const findHotelById = (hotels, id) => {
  return hotels.find(hotel => hotel.id === parseInt(id)) || null;
};
```

**Benefits:**
- Can be tested without mocks
- Can be memoized safely
- Composable with other pure functions
- No hidden dependencies

#### 2. `findHotelByName(hotels, name)`
```javascript
// PURE: Deterministic search, no mutations
export const findHotelByName = (hotels, name) => {
  return hotels.find(hotel => 
    hotel.name.toLowerCase() === name.toLowerCase()
  ) || null;
};
```

**Benefits:**
- Case-insensitive search logic is isolated
- Easy to test edge cases
- No external dependencies

#### 3. `transformHotelOptions(rawOptions)`
```javascript
// PURE: Data transformation without side effects
export const transformHotelOptions = (rawOptions) => {
  return rawOptions.map((option, index) => ({
    id: index + 1,
    hotelId: option.value,
    name: option.text.trim(),
    type: option.value === '' || option.value === '-1' ? 'All' : 'Hotel'
  }));
};
```

**Benefits:**
- Extracted from web scraping logic
- Can be tested independently
- Reusable for any dropdown transformation
- No DOM dependencies in business logic

#### 4. `calculateCacheInfo(ttl, currentTime, cacheTTL)`
```javascript
// PURE: Calculation with explicit time parameter
export const calculateCacheInfo = (ttl, currentTime, cacheTTL) => {
  return {
    cached: ttl !== null,
    ttlMs: ttl,
    ttlHours: ttl ? (ttl / (60 * 60 * 1000)).toFixed(2) : null,
    expiresAt: ttl ? new Date(currentTime + ttl).toISOString() : null,
    cacheTTLMs: cacheTTL,
    cacheTTLHours: cacheTTL / (60 * 60 * 1000)
  };
};
```

**Benefits:**
- Removed `Date.now()` dependency
- Time is now a parameter (dependency injection)
- Completely deterministic
- Easy to test with fixed timestamps

### Impure Functions (Side Effects)

These functions maintain their role as I/O boundaries but now use pure functions internally:

#### 1. `getAllHotels(useCache)`
- **Side Effect:** Reads from cache
- **Uses:** Returns cached data or default list

#### 2. `getHotelById(id)`
- **Side Effect:** Calls `getAllHotels()` which reads cache
- **Pure Core:** Uses `findHotelById()` for actual search

#### 3. `getHotelByName(name)`
- **Side Effect:** Calls `getAllHotels()` which reads cache
- **Pure Core:** Uses `findHotelByName()` for actual search

#### 4. `scrapeHotelList(forceRefresh)`
- **Side Effects:** Network I/O, DOM access, cache writes
- **Pure Core:** Uses `transformHotelOptions()` for data transformation

#### 5. `getCacheInfo()`
- **Side Effects:** Reads cache, uses `Date.now()`
- **Pure Core:** Uses `calculateCacheInfo()` for calculations

#### 6. `clearCache()`
- **Side Effect:** Mutates cache

## Architecture Pattern

```
┌─────────────────────────────────────────────┐
│           IMPURE LAYER                      │
│  (I/O, Cache, Side Effects)                 │
│  - getAllHotels()                           │
│  - scrapeHotelList()                        │
│  - getCacheInfo()                           │
│  - clearCache()                             │
└─────────────────┬───────────────────────────┘
                  │ Uses
                  ▼
┌─────────────────────────────────────────────┐
│           PURE LAYER                        │
│  (Business Logic, Transformations)          │
│  - findHotelById()                          │
│  - findHotelByName()                        │
│  - transformHotelOptions()                  │
│  - calculateCacheInfo()                     │
└─────────────────────────────────────────────┘
```

## Testing Improvements

### Before Refactoring
```javascript
// Had to deal with cache side effects
test('getHotelById', () => {
  // Setup: Clear cache, seed cache, etc.
  const hotel = hoteisService.getHotelById(1);
  expect(hotel).toBeDefined();
  // Teardown: Clear cache
});
```

### After Refactoring
```javascript
// Pure functions - no setup needed
test('findHotelById', () => {
  const hotels = [{ id: 1, name: 'Test' }];
  const result = findHotelById(hotels, 1);
  expect(result.name).toBe('Test');
});

// Test determinism
test('is deterministic', () => {
  const hotels = [{ id: 1, name: 'Test' }];
  const result1 = findHotelById(hotels, 1);
  const result2 = findHotelById(hotels, 1);
  const result3 = findHotelById(hotels, 1);
  
  expect(result1).toEqual(result2);
  expect(result2).toEqual(result3);
});
```

## Benefits Achieved

### 1. **Better Testability**
- Pure functions require no mocks or setup
- Can test with simple inputs and assertions
- Determinism is easily verifiable

### 2. **Easier Reasoning**
- Pure functions are self-contained
- No hidden dependencies or state
- Function signature tells the whole story

### 3. **Composability**
```javascript
// Pure functions can be composed
const rawOptions = scrapeFromDOM();
const hotels = transformHotelOptions(rawOptions);
const hotel = findHotelByName(hotels, 'Amparo');
```

### 4. **Optimization Opportunities**
```javascript
// Pure functions can be memoized
const memoizedTransform = memoize(transformHotelOptions);
```

### 5. **Parallel Execution Safety**
```javascript
// Pure functions are thread-safe
const results = await Promise.all([
  findHotelById(hotels, 1),
  findHotelById(hotels, 2),
  findHotelById(hotels, 3)
]);
```

## Code Organization

The service is now clearly divided into sections:

```javascript
// ============================================================================
// PURE FUNCTIONS (Referentially Transparent)
// ============================================================================

export const findHotelById = (hotels, id) => { /* ... */ };
export const findHotelByName = (hotels, name) => { /* ... */ };
export const transformHotelOptions = (rawOptions) => { /* ... */ };
export const calculateCacheInfo = (ttl, currentTime, cacheTTL) => { /* ... */ };

// ============================================================================
// IMPURE FUNCTIONS (Side Effects)
// ============================================================================

export const getAllHotels = (useCache = true) => { /* ... */ };
export const scrapeHotelList = async (forceRefresh = false) => { /* ... */ };
// ...
```

## Backward Compatibility

✅ **All existing APIs remain unchanged**
- Controllers continue to work without modifications
- Existing tests still pass
- No breaking changes to the public interface

The refactoring is **purely internal** - new pure functions are exported for testing and potential reuse, but existing impure functions maintain their signatures and behavior.

## Test Coverage

New test file: `tests/unit/hoteisService-pure.test.js`
- 24 tests covering all pure functions
- Demonstrates referential transparency properties:
  - Determinism
  - No mutations
  - No side effects
  - Composability
  - Memoization safety

## Future Improvements

### 1. **Further Separation**
Extract web scraping logic into a separate module:
```javascript
// src/scrapers/afpespScraper.js
export const scrapeHotelDropdown = async () => { /* ... */ };
```

### 2. **Dependency Injection**
Pass cache as a parameter instead of importing:
```javascript
export const getAllHotels = (cacheStore, useCache = true) => {
  // ...
};
```

### 3. **Pure Core, Impure Shell**
Move more logic to pure functions, keeping only essential side effects at boundaries.

## References

- [REFERENTIAL_TRANSPARENCY.md](./REFERENTIAL_TRANSPARENCY.md) - Principles and guidelines
- [Professor Frisby's Mostly Adequate Guide](https://mostly-adequate.gitbook.io/)
- [Functional Programming in JavaScript](https://github.com/getify/Functional-Light-JS)

## Related Documentation

- [CONTRIBUTING.md](./CONTRIBUTING.md) - Immutability guidelines
- [TDD_GUIDE.md](./TDD_GUIDE.md) - Testing pure functions
- [LOW_COUPLING_GUIDE.md](./LOW_COUPLING_GUIDE.md) - Reducing dependencies

---

**Refactored by:** GitHub Copilot CLI  
**Date:** 2025-12-09  
**Test Status:** ✅ All tests passing (24 new pure function tests)
