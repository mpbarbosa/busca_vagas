# Hotel List Update - December 2025

## Overview

Updated the static hotel list in `src/services/hoteisService.js` with the latest data from the AFPESP website via the `/api/vagas/hoteis/scrape` endpoint.

## Changes Made

### Before
- 4 hotels (outdated, incomplete list)
- Missing hotel IDs (hotelId field)
- Hotels: BLUES Appenzell, Homem de Melo, Perdizes, Sumaré

### After
- 25 hotels (complete, current list from AFPESP)
- All hotels have proper hotelId values
- Includes "Todas" (All) option
- Matches the AFPESP dropdown exactly

## Updated Hotel List

| ID | Hotel ID | Name | Type |
|----|----------|------|------|
| 1 | -1 | Todas | All |
| 2 | 4007 | Amparo | Hotel |
| 3 | 4003 | Appenzell | Hotel |
| 4 | 4001 | Areado | Hotel |
| 5 | 4002 | Avaré | Hotel |
| 6 | 4024 | Boraceia | Hotel |
| 7 | 4004 | Campos do Jordão | Hotel |
| 8 | 4013 | Caraguatatuba | Hotel |
| 9 | 4023 | Fazenda Ibirá | Hotel |
| 10 | 4014 | Guarujá | Hotel |
| 11 | 4015 | Itanhaém | Hotel |
| 12 | 4008 | Lindoia | Hotel |
| 13 | 4018 | Maresias | Hotel |
| 14 | 4005 | Monte Verde | Hotel |
| 15 | 4021 | Peruíbe I | Hotel |
| 16 | 4022 | Peruíbe II | Hotel |
| 17 | 4006 | Poços de Caldas | Hotel |
| 18 | 4020 | Saha | Hotel |
| 19 | 4019 | São Lourenço | Hotel |
| 20 | 4011 | São Pedro | Hotel |
| 21 | 4009 | Serra Negra | Hotel |
| 22 | 4010 | Socorro | Hotel |
| 23 | 4012 | Termas de Ibirá | Hotel |
| 24 | 4016 | Ubatuba | Hotel |
| 25 | 4017 | Unidade Capital | Hotel |

## Benefits

1. **Accuracy**: Static list now matches AFPESP website exactly
2. **Completeness**: All 24 hotels + "Todas" option included
3. **Consistency**: Hotel IDs match the AFPESP system values
4. **Reliability**: Fallback data available if scrape endpoint fails

## Data Source

- **Endpoint**: `https://www.mpbarbosa.com/api/vagas/hoteis/scrape`
- **Source**: AFPESP Website - ddlHoteis dropdown
- **Date**: 2025-12-03
- **Method**: Puppeteer web scraping

## Verification

Run `node verify-hotel-list.js` to verify:
- ✅ 25 hotels total
- ✅ All required fields present (id, hotelId, name, type, description)
- ✅ "Todas" option included
- ✅ All expected hotels from bug fix present

## Related Files

- `src/services/hoteisService.js` - Updated hotel list
- `verify-hotel-list.js` - Verification test script
- `src/controllers/hoteisController.js` - API endpoints

## API Endpoints

- `GET /api/vagas/hoteis` - Returns static hotel list (now updated)
- `GET /api/vagas/hoteis/scrape` - Live scrape from AFPESP (dynamic)

## Notes

The static list serves as:
1. Fast response for `/api/vagas/hoteis` endpoint
2. Fallback if scraping fails
3. Reference for hotel IDs and names
4. Documentation of available hotels

Should be updated periodically when AFPESP adds/removes hotels.

## Date

2025-12-03
