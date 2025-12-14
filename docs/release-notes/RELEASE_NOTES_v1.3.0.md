# Release Notes - Version 1.3.0

**Release Date:** December 2, 2025  
**Type:** Minor Release (Feature Addition)

---

## 🎉 What's New

### Hotel Filter Parameter

Added a new optional `hotel` parameter to the `/api/vagas/search` endpoint, allowing users to filter vacancy searches by specific hotel names.

#### Key Features:
- ✨ **Smart Matching** - Case-insensitive partial name matching for hotel names
- 🔄 **Backward Compatible** - Defaults to "Todas" (all hotels) when not specified
- 🛡️ **Graceful Fallback** - Automatically falls back to "Todas" if hotel not found
- 📊 **Transparent Response** - Includes `hotelFilter` field in API responses

---

## 🚀 Usage

### Basic Search (All Hotels)
```bash
GET /api/vagas/search?checkin=2024-12-25&checkout=2024-12-26
```

### Search Specific Hotel
```bash
GET /api/vagas/search?checkin=2024-12-25&checkout=2024-12-26&hotel=Appenzell
```

### Response Example
```json
{
  "success": true,
  "method": "puppeteer",
  "headlessMode": true,
  "resourceSavings": "40-60% compared to Selenium",
  "hotelFilter": "Appenzell",
  "data": {
    "success": true,
    "date": "12/25/2024",
    "hasAvailability": true,
    "result": { ... }
  }
}
```

---

## 📝 Changes

### Added
- `hotel` query parameter to `/api/vagas/search` endpoint
- `hotelFilter` field in API responses
- Smart hotel name matching with case-insensitive partial matching
- Enhanced logging for hotel selection
- Comprehensive documentation updates

### Modified
- `searchVacanciesByDay()` function signature to accept hotel parameter
- `openVagasPage()` function to implement intelligent hotel selection
- API response structure to include hotel filter information
- Documentation in `API_CLIENT_DOCUMENTATION.md` and `PUPPETEER_README.md`

### Technical Details
- **Files Changed:**
  - `src/controllers/vagasControllerPuppeteer.js`
  - `src/controllers/puppeteer-script.js`
  - `docs/API_CLIENT_DOCUMENTATION.md`
  - `docs/PUPPETEER_README.md`
  - `package.json`
  - `VERSION`

---

## 🔄 Migration Guide

### No Breaking Changes

This release is **fully backward compatible**. Existing integrations will continue to work without any modifications.

### Optional Enhancement

If you want to take advantage of the new hotel filtering feature:

**Before (still works):**
```javascript
const response = await fetch(
  `${API_URL}/api/vagas/search?checkin=2024-12-25&checkout=2024-12-26`
);
```

**After (with hotel filter):**
```javascript
const response = await fetch(
  `${API_URL}/api/vagas/search?checkin=2024-12-25&checkout=2024-12-26&hotel=Appenzell`
);
```

---

## 📋 Available Hotels

To get the complete list of available hotels, use:
```bash
GET /api/vagas/hoteis/scrape
```

Common hotels include:
- Todas (all hotels - default)
- Amparo
- Appenzell
- Areado
- Avaré
- Campos do Jordão
- Caraguatatuba
- Guarujá
- Ubatuba
- And 15+ more...

---

## ✅ Testing

All changes have been thoroughly tested:
- ✅ Default behavior (Todas) verified
- ✅ Specific hotel selection verified
- ✅ Smart matching verified
- ✅ Fallback behavior verified
- ✅ ESLint passed with no new errors
- ✅ Backward compatibility confirmed

---

## 📚 Documentation

Updated documentation includes:
- API Client Documentation with parameter details
- Puppeteer README with usage examples
- Semantic versioning added to documentation
- Comprehensive changelog with version history

---

## 🐛 Bug Fixes

None - This is a feature release with no bug fixes.

---

## ⚠️ Known Issues

None

---

## 🔮 Coming Soon

Potential features for future releases:
- Multiple hotel selection support
- Date range expansion for multi-week searches
- Caching mechanism for improved performance
- Export functionality for search results

---

## 📞 Support

For questions, issues, or feedback:
- 📖 Check the [documentation](docs/)
- 🐛 Report bugs via [GitHub Issues](https://github.com/mpbarbosa/busca_vagas/issues)
- 💡 Request features via [GitHub Issues](https://github.com/mpbarbosa/busca_vagas/issues)

---

## 🙏 Acknowledgments

Thanks to all contributors and users who provided feedback and suggestions for this release.

---

**Full Changelog:** v1.2.1...v1.3.0
