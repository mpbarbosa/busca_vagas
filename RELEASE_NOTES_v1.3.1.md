# Release Notes - Version 1.3.1

**Release Date:** December 3, 2025  
**Release Type:** Patch Release (Bug Fixes + Enhancements)

## 🎯 Overview

Version 1.3.1 is a critical patch release that fixes a major vacancy search bug and updates the hotel static list with complete AFPESP data. This release significantly improves search accuracy and data completeness.

## 🐛 Bug Fixes

### Critical: Vacancy Search Progressive Loading Fix

**Issue:** The API was only returning 4 hotels instead of all available hotels from the AFPESP website due to insufficient wait time for dynamic content loading.

**Fix:** 
- Increased wait time from 2 seconds to 15 seconds to accommodate progressive hotel loading
- Updated vacancy regex pattern to capture multiple date entries per room type
- Enhanced parsing logic to split and process all room availability variations

**Impact:**
- Hotels found: **4 → 15** (375% increase)
- Room vacancies: **8 → 46** (575% increase)
- Now captures all hotels matching the AFPESP website exactly

**Files Modified:**
- `src/controllers/puppeteer-script.js`

**Documentation:**
- [BUG_FIX_SUMMARY.md](BUG_FIX_SUMMARY.md)
- [verify-bug-fix.js](verify-bug-fix.js) - Automated verification test

**Hotels Now Captured:**
1. Amparo (2 room types)
2. Appenzell (2 room types)
3. Areado (2 room types)
4. Avaré (3 room types) - Now includes all JURUMIRIM entries
5. Boraceia (3 room types) ⭐ NEW
6. Campos do Jordão (4 room types) ⭐ NEW
7. Fazenda Ibirá (8 room types) ⭐ NEW
8. Lindóia (1 room type) ⭐ NEW
9. Peruíbe I (1 room type) ⭐ NEW
10. Poços de Caldas (2 room types) ⭐ NEW
11. Saha (3 room types) ⭐ NEW
12. São Lourenço (4 room types) ⭐ NEW
13. Socorro (2 room types) ⭐ NEW
14. Termas de Ibirá (7 room types) ⭐ NEW
15. Unidade Capital (2 room types) ⭐ NEW

## ✨ Features & Enhancements

### Hotel Static List Update

**Enhancement:** Updated the static hotel list with complete, current data from AFPESP.

**Changes:**
- Hotels: **4 → 25** (525% increase)
- Added `hotelId` field matching AFPESP system values
- Includes "Todas" (All) option
- Complete hotel reference for all AFPESP union hotels

**Files Modified:**
- `src/services/hoteisService.js`

**Documentation:**
- [HOTEL_LIST_UPDATE.md](HOTEL_LIST_UPDATE.md)
- [verify-hotel-list.js](verify-hotel-list.js) - Automated verification test

**Complete Hotel List (25 hotels):**
1. Todas (All) - ID: -1
2. Amparo - ID: 4007
3. Appenzell - ID: 4003
4. Areado - ID: 4001
5. Avaré - ID: 4002
6. Boraceia - ID: 4024
7. Campos do Jordão - ID: 4004
8. Caraguatatuba - ID: 4013
9. Fazenda Ibirá - ID: 4023
10. Guarujá - ID: 4014
11. Itanhaém - ID: 4015
12. Lindoia - ID: 4008
13. Maresias - ID: 4018
14. Monte Verde - ID: 4005
15. Peruíbe I - ID: 4021
16. Peruíbe II - ID: 4022
17. Poços de Caldas - ID: 4006
18. Saha - ID: 4020
19. São Lourenço - ID: 4019
20. São Pedro - ID: 4011
21. Serra Negra - ID: 4009
22. Socorro - ID: 4010
23. Termas de Ibirá - ID: 4012
24. Ubatuba - ID: 4016
25. Unidade Capital - ID: 4017

**Benefits:**
- Accurate static fallback data
- Fast response for `/api/vagas/hoteis` endpoint
- Consistency with AFPESP website
- Complete hotel reference for developers

## 📝 Documentation Updates

- Updated [README.md](README.md) with Technical Fixes section
- Updated [docs/DOCUMENTATION_INDEX.md](docs/DOCUMENTATION_INDEX.md) with new documentation references
- Updated [docs/PUPPETEER_SUMMARY.md](docs/PUPPETEER_SUMMARY.md) with Recent Updates section
- Added [BUG_FIX_SUMMARY.md](BUG_FIX_SUMMARY.md) - Complete bug fix documentation
- Added [HOTEL_LIST_UPDATE.md](HOTEL_LIST_UPDATE.md) - Hotel list update documentation

## 🧪 Testing & Verification

New verification scripts added:
- `verify-bug-fix.js` - Comprehensive bug fix verification (✅ All tests pass)
- `verify-hotel-list.js` - Hotel list validation (✅ All tests pass)

## 🔄 Migration Notes

### For API Consumers

No breaking changes. The API endpoints remain the same:
- `GET /api/vagas/search?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&hotel=Todas`
- `GET /api/vagas/hoteis` - Now returns 25 hotels instead of 4

### For Developers

- The progressive loading fix requires **15 seconds** for complete results
- This is a necessary tradeoff for data completeness
- Static hotel list now includes `hotelId` field for all hotels

## ⚡ Performance Impact

### Vacancy Search
- **Wait time:** 2s → 15s (necessary for complete data)
- **Data completeness:** 25% → 100%
- **Hotels captured:** 4 → 15 (375% improvement)
- **Room entries:** 8 → 46 (575% improvement)

### Hotel List
- **Static list size:** 4 → 25 hotels
- **Response time:** No change (fast static response)
- **Data accuracy:** 100% match with AFPESP

## 🔧 Technical Details

### Bug Fix Implementation
- **Root Cause:** AFPESP website loads hotels progressively over 15 seconds
- **Solution:** Increased wait time and improved parsing logic
- **Verification:** Automated test confirms all 15+ hotels captured

### Hotel List Update
- **Data Source:** Production API `/api/vagas/hoteis/scrape` endpoint
- **Update Method:** Puppeteer web scraping from AFPESP dropdown
- **Validation:** All 25 hotels verified with correct IDs

## 📦 Commits Included

1. `8bc8877` - fix(puppeteer): resolve incomplete hotel results due to progressive loading
2. `6348cfe` - feat(hotels): update static hotel list with latest AFPESP data

## 🔗 Related Documentation

- [BUG_FIX_SUMMARY.md](BUG_FIX_SUMMARY.md) - Progressive loading bug fix details
- [HOTEL_LIST_UPDATE.md](HOTEL_LIST_UPDATE.md) - Hotel list update details
- [PUPPETEER_SUMMARY.md](docs/PUPPETEER_SUMMARY.md) - Puppeteer implementation overview
- [API.md](docs/API.md) - API endpoint documentation

## 🎓 Lessons Learned

1. **Dynamic Content Loading:** Always account for progressive/lazy loading on target websites
2. **Data Validation:** Automated verification tests are essential for data accuracy
3. **Static vs Dynamic Data:** Maintain updated static fallback data for reliability
4. **Testing:** End-to-end testing reveals real-world issues that unit tests may miss

## ⚠️ Known Issues

None identified in this release.

## 🚀 Next Steps

Recommended actions for future releases:
1. Consider implementing a hotel list auto-update mechanism
2. Add monitoring for AFPESP website structure changes
3. Implement caching for frequently searched date ranges
4. Consider reducing wait time through more efficient loading detection

## 📞 Support

For issues or questions:
- Review documentation in [docs/](docs/)
- Check [BUG_FIX_SUMMARY.md](BUG_FIX_SUMMARY.md) for bug fix details
- Review [HOTEL_LIST_UPDATE.md](HOTEL_LIST_UPDATE.md) for hotel data

---

**Version:** 1.3.1  
**Released:** December 3, 2025  
**Type:** Patch Release  
**Status:** ✅ Production Ready

**Previous Version:** [1.3.0](RELEASE_NOTES_v1.3.0.md)
