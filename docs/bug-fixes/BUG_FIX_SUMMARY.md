# Vacancy Search Bug Fix - Summary

## Issue Description

The API endpoint `/api/vagas/search` was returning incomplete results compared to the AFPESP website. When searching for dates 2025-12-03 to 2025-12-05:

- **API was returning**: Only 4 hotels (Amparo, Appenzell, Areado, Avaré)
- **AFPESP website shows**: 15+ hotels with availability

## Root Cause Analysis

Two main issues were identified:

### 1. Insufficient Wait Time for Dynamic Content Loading

The AFPESP website loads hotel results progressively over time:
- After 2 seconds: ~5 hotels loaded
- After 10 seconds: ~16 hotels loaded
- After 15 seconds: ~24 hotels loaded (complete)

The original code only waited 2 seconds, causing it to miss most hotels.

### 2. Limited Vacancy Pattern Matching

The regex patterns used to extract vacancy information were:
1. Too restrictive - didn't match all room name formats
2. Only captured first date entry when rooms had multiple availability entries

For example, "JURUMIRIM" has two separate entries:
- 03/12 - 05/12 (2 dias livres) - 1 Quarto(s)
- 03/12 - 05/12 (2 dias livres) - 2 Quarto(s) - adaptado

But only the first was being captured.

## Solution Implemented

### Changes to `src/controllers/puppeteer-script.js`

1. **Increased wait time** (Line ~467):
   ```javascript
   // Changed from 2 seconds to 15 seconds
   await new Promise(resolve => setTimeout(resolve, 15000));
   ```

2. **Updated vacancy regex pattern** (Line ~510):
   ```javascript
   // New pattern captures all consecutive date entries for a room type
   /<b>([^<]+)<\/b>\s*<br>\s*((?:\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\([^)]+\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?\s*<br>\s*)+)/gim
   ```

3. **Enhanced parsing logic** (Lines ~514-532):
   - Now splits multiple date entries for the same room type
   - Creates separate vacancy entries for each date/availability combination

## Results After Fix

### Before
- Hotels found: 4
- Room vacancies: 8

### After
- Hotels found: 15
- Room vacancies: 46

### Hotels Now Captured
1. Amparo (2 room types)
2. Appenzell (2 room types)
3. Areado (2 room types)
4. Avaré (3 room types) ✨ Now includes both JURUMIRIM entries
5. Boraceia (3 room types) ✨ NEW
6. Campos do Jordão (4 room types) ✨ NEW
7. Fazenda Ibirá (8 room types) ✨ NEW
8. Lindóia (1 room type) ✨ NEW
9. Peruíbe I (1 room type) ✨ NEW
10. Poços de Caldas (2 room types) ✨ NEW
11. Saha (3 room types) ✨ NEW
12. São Lourenço (4 room types) ✨ NEW
13. Socorro (2 room types) ✨ NEW
14. Termas de Ibirá (7 room types) ✨ NEW
15. Unidade Capital (2 room types) ✨ NEW

## Verification

The fix has been verified to:
- ✅ Capture all 15 hotels with availability
- ✅ Capture 46 individual room/date entries
- ✅ Handle multiple date entries for same room type
- ✅ Include adapted (accessibility) rooms
- ✅ Match the complete data shown on AFPESP website

## API Usage

The endpoint continues to work the same way:

```bash
GET /api/vagas/search?checkin=2025-12-03&checkout=2025-12-05&hotel=Todas
```

Response now includes complete hotel and room data matching the AFPESP website.

## Performance Note

The 15-second wait time is necessary to ensure all hotels are loaded. This is a tradeoff between completeness and response time. The progressive loading is controlled by the AFPESP website, not our code.

## Date

2025-12-03

## Files Modified

- `src/controllers/puppeteer-script.js` - Main fix implementation
