# Vagas Service Refactoring for Referential Transparency

## Overview

The `vagasService.js` has been refactored to separate **pure functions** (referentially transparent) from **impure functions** (side effects), following the same pattern used in `hoteisService.js` and principles outlined in [REFERENTIAL_TRANSPARENCY.md](./REFERENTIAL_TRANSPARENCY.md).

## Date
2025-12-09

## Motivation

The original service had limited functionality with placeholder TODOs, but mixed validation logic with service class methods. The refactoring:
- Extracts pure business logic into standalone functions
- Makes validation, filtering, and transformation testable
- Prepares the service for future I/O operations
- Follows functional programming principles

## Changes Made

### Pure Functions (Referentially Transparent)

These functions always return the same output for the same input and have no side effects:

#### 1. `validateVagaData(vagaData)`
```javascript
// PURE: Validation logic without side effects
export const validateVagaData = (vagaData) => {
  const erros = [];
  
  if (!vagaData || typeof vagaData !== 'object') {
    erros.push('Dados da vaga são inválidos');
    return erros;
  }
  
  if (!vagaData.titulo) erros.push('Título é obrigatório');
  if (!vagaData.hotel) erros.push('Hotel é obrigatório');
  if (!vagaData.sindicato) erros.push('Sindicato é obrigatório');
  
  return erros;
};
```

**Benefits:**
- Pure validation - no side effects
- Easy to test all validation rules
- Can be composed with other validators
- Returns errors instead of throwing

#### 2. `isValidVagaData(vagaData)`
```javascript
// PURE: Boolean validator
export const isValidVagaData = (vagaData) => {
  const erros = validateVagaData(vagaData);
  return erros.length === 0;
};
```

**Benefits:**
- Convenient boolean check
- Composes with `validateVagaData()`
- No external dependencies

#### 3. `filterVagasByHotel(vagas, hotelId)`
```javascript
// PURE: Filter by hotel without mutations
export const filterVagasByHotel = (vagas, hotelId) => {
  if (!hotelId || hotelId === '-1' || hotelId === 'all') {
    return vagas;
  }
  return vagas.filter(vaga => vaga.hotelId === hotelId || vaga.hotel === hotelId);
};
```

**Benefits:**
- No mutations - returns new array
- Deterministic filtering
- Handles special "all" cases
- Testable without database

#### 4. `filterVagasBySindicato(vagas, sindicatoId)`
```javascript
// PURE: Filter by sindicato
export const filterVagasBySindicato = (vagas, sindicatoId) => {
  if (!sindicatoId || sindicatoId === '-1' || sindicatoId === 'all') {
    return vagas;
  }
  return vagas.filter(vaga => vaga.sindicatoId === sindicatoId || vaga.sindicato === sindicatoId);
};
```

**Benefits:**
- Consistent with hotel filter
- Pure filtering logic
- Reusable across the application

#### 5. `applyFilters(vagas, filtros)`
```javascript
// PURE: Apply multiple filters composably
export const applyFilters = (vagas, filtros = {}) => {
  let result = [...vagas];
  
  if (filtros.hotelId) {
    result = filterVagasByHotel(result, filtros.hotelId);
  }
  
  if (filtros.sindicatoId) {
    result = filterVagasBySindicato(result, filtros.sindicatoId);
  }
  
  if (filtros.searchTerm && filtros.searchTerm.trim()) {
    const term = filtros.searchTerm.toLowerCase().trim();
    result = result.filter(vaga => 
      (vaga.titulo && vaga.titulo.toLowerCase().includes(term)) ||
      (vaga.descricao && vaga.descricao.toLowerCase().includes(term))
    );
  }
  
  return result;
};
```

**Benefits:**
- Composes multiple filters
- Pure function - no mutations
- Flexible filter combinations
- Text search included

#### 6. `sortVagas(vagas, field, order)`
```javascript
// PURE: Sort vacancies by field
export const sortVagas = (vagas, field = 'titulo', order = 'asc') => {
  const sorted = [...vagas].sort((a, b) => {
    const aVal = a[field] || '';
    const bVal = b[field] || '';
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
};
```

**Benefits:**
- Pure sorting - creates new array
- Configurable field and order
- Handles missing values gracefully

#### 7. `transformVagaData(rawVaga)`
```javascript
// PURE: Transform raw data to standard format
export const transformVagaData = (rawVaga) => {
  return {
    id: rawVaga.id || null,
    titulo: rawVaga.titulo || rawVaga.title || '',
    descricao: rawVaga.descricao || rawVaga.description || '',
    hotel: rawVaga.hotel || '',
    hotelId: rawVaga.hotelId || rawVaga.hotel_id || '',
    sindicato: rawVaga.sindicato || '',
    sindicatoId: rawVaga.sindicatoId || rawVaga.sindicato_id || '',
    dataInicio: rawVaga.dataInicio || rawVaga.data_inicio || null,
    dataFim: rawVaga.dataFim || rawVaga.data_fim || null,
    vagas: rawVaga.vagas || rawVaga.quantidade || 0,
    status: rawVaga.status || 'disponivel'
  };
};
```

**Benefits:**
- Normalizes different data formats
- Handles alternative field names
- Provides default values
- Pure transformation

#### 8. `transformVagasData(rawVagas)`
```javascript
// PURE: Transform array of raw data
export const transformVagasData = (rawVagas) => {
  if (!Array.isArray(rawVagas)) {
    return [];
  }
  return rawVagas.map(transformVagaData);
};
```

**Benefits:**
- Batch transformation
- Safe handling of invalid input
- Composes with single transformation

### Impure Functions (Side Effects)

The `VagasService` class maintains backward compatibility while using pure functions internally:

#### 1. `buscarVagasComFiltros(filtros)`
- **Side Effect:** Would fetch from database/API
- **Pure Core:** Uses `applyFilters()` for filtering logic

#### 2. `buscarVagasPorSindicato(sindicatoId)`
- **Side Effect:** Would fetch from database/API
- **Pure Core:** Uses `filterVagasBySindicato()` for filtering

#### 3. `buscarVagasPorHotel(hotelId)`
- **Side Effect:** Would fetch from database/API
- **Pure Core:** Uses `filterVagasByHotel()` for filtering

#### 4. `validarDadosVaga(vagaData)`
- **Delegates** to pure `validateVagaData()` function

## Architecture Pattern

```
┌─────────────────────────────────────────────┐
│      IMPURE LAYER (VagasService)            │
│  (I/O, Database, API Calls)                 │
│  - buscarVagasComFiltros()                  │
│  - buscarVagasPorSindicato()                │
│  - buscarVagasPorHotel()                    │
│  - validarDadosVaga() → delegates           │
└─────────────────┬───────────────────────────┘
                  │ Uses
                  ▼
┌─────────────────────────────────────────────┐
│           PURE LAYER                        │
│  (Business Logic, Validation, Filters)      │
│  - validateVagaData()                       │
│  - isValidVagaData()                        │
│  - filterVagasByHotel()                     │
│  - filterVagasBySindicato()                 │
│  - applyFilters()                           │
│  - sortVagas()                              │
│  - transformVagaData()                      │
│  - transformVagasData()                     │
└─────────────────────────────────────────────┘
```

## Testing Improvements

### Before Refactoring
```javascript
// Limited testing - validation tied to class
test('validarDadosVaga', () => {
  const service = new VagasService();
  const erros = service.validarDadosVaga({});
  expect(erros.length).toBeGreaterThan(0);
});
```

### After Refactoring
```javascript
// Pure functions - comprehensive testing
test('validateVagaData is deterministic', () => {
  const vagaData = { titulo: 'Test', hotel: 'Hotel A', sindicato: 'Sindicato 1' };
  
  const result1 = validateVagaData(vagaData);
  const result2 = validateVagaData(vagaData);
  const result3 = validateVagaData(vagaData);
  
  expect(result1).toEqual(result2);
  expect(result2).toEqual(result3);
});

test('applyFilters composes multiple filters', () => {
  const vagas = [/* sample data */];
  const filtros = { hotelId: '4001', searchTerm: 'weekend' };
  
  const result = applyFilters(vagas, filtros);
  
  expect(result.every(v => v.hotelId === '4001')).toBe(true);
  expect(result.every(v => v.titulo.includes('weekend'))).toBe(true);
});
```

## Benefits Achieved

### 1. **Comprehensive Testability**
- 49 tests covering all pure functions
- No mocks needed for business logic
- Tests run fast (no I/O)

### 2. **Business Logic Isolation**
- Validation, filtering, sorting all pure
- Can be used independently
- Easy to reason about behavior

### 3. **Composability**
```javascript
// Chain operations
const filtered = filterVagasByHotel(vagas, '4001');
const sorted = sortVagas(filtered, 'titulo', 'asc');
const validated = sorted.filter(v => isValidVagaData(v));
```

### 4. **Flexibility**
- Pure functions can be used outside the service
- Controllers can call them directly
- Reusable across different contexts

### 5. **Future-Ready**
- When I/O is implemented, pure logic stays the same
- Easy to add caching (functions are deterministic)
- Can optimize with memoization

## Code Organization

The service is now clearly divided into sections:

```javascript
// ============================================================================
// PURE FUNCTIONS (Referentially Transparent)
// ============================================================================

export const validateVagaData = (vagaData) => { /* ... */ };
export const isValidVagaData = (vagaData) => { /* ... */ };
export const filterVagasByHotel = (vagas, hotelId) => { /* ... */ };
export const filterVagasBySindicato = (vagas, sindicatoId) => { /* ... */ };
export const applyFilters = (vagas, filtros) => { /* ... */ };
export const sortVagas = (vagas, field, order) => { /* ... */ };
export const transformVagaData = (rawVaga) => { /* ... */ };
export const transformVagasData = (rawVagas) => { /* ... */ };

// ============================================================================
// IMPURE FUNCTIONS (Side Effects)
// ============================================================================

export class VagasService {
  async buscarVagasComFiltros(filtros) { /* ... */ }
  async buscarVagasPorSindicato(sindicatoId) { /* ... */ }
  async buscarVagasPorHotel(hotelId) { /* ... */ }
  validarDadosVaga(vagaData) { /* delegates to pure function */ }
}
```

## Backward Compatibility

✅ **All existing APIs remain unchanged**
- `VagasService` class maintains same interface
- Existing code continues to work
- No breaking changes

The refactoring exports new pure functions while keeping the original class-based API intact.

## Test Coverage

New test file: `tests/unit/vagasService-pure.test.js`
- **49 tests** covering all pure functions
- Demonstrates referential transparency properties:
  - Determinism (same input → same output)
  - No mutations (input data unchanged)
  - No side effects (multiple calls safe)
  - Composability (functions work together)
  - Memoization safety (can be cached)

## Example Usage

### Using Pure Functions Directly
```javascript
import { 
  validateVagaData, 
  applyFilters, 
  sortVagas 
} from './services/vagasService.js';

// Validate
const erros = validateVagaData(vagaData);
if (erros.length > 0) {
  console.error('Validation errors:', erros);
}

// Filter and sort
const filtros = { hotelId: '4001', searchTerm: 'weekend' };
const filtered = applyFilters(vagas, filtros);
const sorted = sortVagas(filtered, 'titulo', 'asc');
```

### Using Service Class (Backward Compatible)
```javascript
import vagasService from './services/vagasService.js';

// Original API still works
const erros = vagasService.validarDadosVaga(vagaData);
const vagas = await vagasService.buscarVagasComFiltros(filtros);
```

## Comparison with HoteisService

Both services now follow the same pattern:

| Aspect | HoteisService | VagasService |
|--------|---------------|--------------|
| Pure Functions | 4 | 8 |
| Test Coverage | 24 tests | 49 tests |
| Pattern | Pure Core, Impure Shell | Pure Core, Impure Shell |
| Backward Compatible | ✅ Yes | ✅ Yes |
| Lint Clean | ✅ Yes | ✅ Yes |

## Future Improvements

### 1. **Implement Database/API Integration**
```javascript
async buscarVagasComFiltros(filtros) {
  const vagas = await database.query('SELECT * FROM vagas');
  const transformed = transformVagasData(vagas);
  return applyFilters(transformed, filtros);
}
```

### 2. **Add More Filters**
- Date range filtering
- Price range
- Availability status
- Region/location

### 3. **Advanced Sorting**
- Multi-field sorting
- Custom sort functions
- Locale-aware sorting

### 4. **Caching**
```javascript
const memoizedFilter = memoize(applyFilters);
```

## Related Services

Apply the same pattern to:
- `vagasServicePuppeteer.js` - Web scraping logic
- Other future services

## References

- [REFERENTIAL_TRANSPARENCY.md](./REFERENTIAL_TRANSPARENCY.md) - Principles
- [HOTEIS_SERVICE_REFACTORING.md](./HOTEIS_SERVICE_REFACTORING.md) - Pattern example
- [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) - Overall strategy

---

**Refactored by:** GitHub Copilot CLI  
**Date:** 2025-12-09  
**Test Status:** ✅ All tests passing (49 pure function tests)  
**Lint Status:** ✅ Clean  
**Backward Compatibility:** ✅ Maintained
