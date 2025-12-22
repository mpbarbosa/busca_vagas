# Booking Rules Implementation Guide

**Version:** 1.5.0  
**Last Updated:** December 21, 2025  
**Business Rules:** BR-18, BR-19, BR-20

---

## Overview

This document describes the implementation of holiday package booking rules in the Busca Vagas API. These rules enforce pre-defined reservation periods for Christmas and New Year holidays.

## Business Rules

### BR-18: Pre-defined Holiday Packages

Holiday reservation periods are pre-defined as closed packages:

- **Christmas Package**
  - Check-in: December 22
  - Check-out: December 27
  - Duration: 5 days / 4 nights

- **New Year Package**
  - Check-in: December 27
  - Check-out: January 2 (next year)
  - Duration: 6 days / 5 nights

### BR-19: Restricted Booking Dates

During holiday package periods, reservations **cannot** be made on different dates (by default). Only the exact package dates are allowed.

### BR-20: Optional Booking Rules

The booking rules (BR-18 and BR-19) can be optionally disabled using the `applyBookingRules` query parameter:

- **Default behavior** (`applyBookingRules=true` or omitted): Holiday package restrictions are enforced
- **Rules disabled** (`applyBookingRules=false`): Allows custom date ranges during holiday periods, bypassing package restrictions
- **Availability**: This option is available on all search endpoints (`/api/vagas/search`, `/api/vagas/search/selenium`, `/api/vagas/search/bydates`)

---

## Implementation Architecture

### 1. Utility Module (`src/utils/bookingRules.js`)

Core validation logic for booking rules.

**Key Functions:**
- `validateBookingDates(checkin, checkout)` - Main validation function
- `getHolidayPackageInfo(checkin, checkout)` - Get package details
- `isHolidayPackage(checkin, checkout)` - Check if dates are a holiday package

**Constants:**
- `HOLIDAY_PACKAGES.CHRISTMAS` - Christmas package definition
- `HOLIDAY_PACKAGES.NEW_YEAR` - New Year package definition

### 2. Validation Middleware (`src/middlewares/validation.js`)

Express middleware that validates booking dates before processing requests.

**Function:**
- `validateBookingRules(req, res, next)` - Validates query parameters

**Behavior:**
- Checks `applyBookingRules` query parameter (default: true)
- If `applyBookingRules=false`, skips validation and proceeds
- If `applyBookingRules=true` or omitted, validates dates against holiday packages
- Returns 400 error with details if validation fails
- Adds `req.holidayPackage` property if dates match a valid package
- Calls `next()` if validation passes or rules are disabled

### 3. Route Integration (`src/routes/vagasRoutes.js`)

Middleware applied to search endpoints:
- `/api/vagas/search` (Puppeteer)
- `/api/vagas/search/selenium` (Legacy)
- `/api/vagas/search/bydates` (Alias)

### 4. Controller Enhancement (`src/controllers/vagasControllerPuppeteer.js`)

Enhanced to include holiday package information in responses when applicable.

---

## API Behavior

### Valid Requests

#### Christmas Package
```bash
GET /api/vagas/search?checkin=2024-12-22&checkout=2024-12-27
```

**Response:**
```json
{
  "success": true,
  "method": "puppeteer",
  "holidayPackage": {
    "name": "Christmas Package",
    "duration": "5 days/4 nights",
    "type": "CHRISTMAS"
  },
  "data": { ... }
}
```

#### New Year Package
```bash
GET /api/vagas/search?checkin=2024-12-27&checkout=2025-01-02
```

**Response:**
```json
{
  "success": true,
  "method": "puppeteer",
  "holidayPackage": {
    "name": "New Year Package",
    "duration": "6 days/5 nights",
    "type": "NEW_YEAR"
  },
  "data": { ... }
}
```

### Invalid Requests (with applyBookingRules=true)

#### Partial Christmas Period
```bash
GET /api/vagas/search?checkin=2024-12-23&checkout=2024-12-26
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Christmas package requires check-in on December 22 and check-out on December 27. Custom dates are not allowed during this period.",
  "code": "INVALID_CHRISTMAS_PACKAGE",
  "package": "Christmas Package",
  "requiredDates": {
    "checkin": "December 22",
    "checkout": "December 27",
    "format": "YYYY-12-22 to YYYY-12-27"
  },
  "providedDates": {
    "checkin": "2024-12-23",
    "checkout": "2024-12-26"
  },
  "documentation": {
    "businessRules": ["BR-18", "BR-19"],
    "reference": "See docs/api/FUNCTIONAL_REQUIREMENTS.md#631-booking-rules"
  }
}
```

#### Partial New Year Period
```bash
GET /api/vagas/search?checkin=2024-12-28&checkout=2025-01-01
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "New Year package requires check-in on December 27 and check-out on January 2. Custom dates are not allowed during this period.",
  "code": "INVALID_NEW_YEAR_PACKAGE",
  "package": "New Year Package",
  "requiredDates": {
    "checkin": "December 27",
    "checkout": "January 2 (next year)",
    "format": "YYYY-12-27 to YYYY+1-01-02"
  },
  "providedDates": {
    "checkin": "2024-12-28",
    "checkout": "2025-01-01"
  },
  "documentation": {
    "businessRules": ["BR-18", "BR-19"],
    "reference": "See docs/api/FUNCTIONAL_REQUIREMENTS.md#631-booking-rules"
  }
}
```

### Valid Requests (with applyBookingRules=false)

#### Custom Dates During Christmas Period
```bash
GET /api/vagas/search?checkin=2024-12-23&checkout=2024-12-26&applyBookingRules=false
```

**Response:**
```json
{
  "success": true,
  "method": "puppeteer",
  "query": {
    "checkin": "2024-12-23",
    "checkout": "2024-12-26",
    "applyBookingRules": false
  },
  "note": "Booking rules bypassed - custom date range allowed during holiday period",
  "data": { ... }
}
```

#### Custom Dates During New Year Period
```bash
GET /api/vagas/search?checkin=2024-12-28&checkout=2025-01-01&applyBookingRules=false
```

**Response:**
```json
{
  "success": true,
  "method": "puppeteer",
  "query": {
    "checkin": "2024-12-28",
    "checkout": "2025-01-01",
    "applyBookingRules": false
  },
  "note": "Booking rules bypassed - custom date range allowed during holiday period",
  "data": { ... }
}
```

---

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_CHRISTMAS_PACKAGE` | Dates fall within Christmas period but don't match package | 400 |
| `INVALID_NEW_YEAR_PACKAGE` | Dates fall within New Year period but don't match package | 400 |
| `INVALID_DATE_FORMAT` | Date format is not YYYY-MM-DD | 400 |
| `INVALID_DATE_RANGE` | Check-out is not after check-in | 400 |

---

## Testing

### Unit Tests

Location: `tests/unit/bookingRules.test.js`

**Coverage:**
- Christmas package validation (5 tests)
- New Year package validation (5 tests)
- Non-holiday period validation (3 tests)
- Date format validation (4 tests)
- Holiday package information (4 tests)
- Helper functions (4 tests)
- Edge cases (3 tests)
- Error response structure (2 tests)
- Constants validation (2 tests)

**Total:** 32 unit tests

**Run tests:**
```bash
npm test -- tests/unit/bookingRules.test.js
```

### Integration Tests

Location: `tests/integration/bookingRules.integration.test.js`

**Note:** Integration tests require the full API to be running and may take longer due to Puppeteer scraping. Use unit tests for quick validation.

---

## Manual Testing

### Test Christmas Package

```bash
# Valid Christmas package
curl "http://localhost:3000/api/vagas/search?checkin=2024-12-22&checkout=2024-12-27"

# Invalid - wrong check-in (with rules enabled)
curl "http://localhost:3000/api/vagas/search?checkin=2024-12-23&checkout=2024-12-27"

# Invalid - wrong check-out (with rules enabled)
curl "http://localhost:3000/api/vagas/search?checkin=2024-12-22&checkout=2024-12-26"

# Valid - custom dates with rules disabled
curl "http://localhost:3000/api/vagas/search?checkin=2024-12-23&checkout=2024-12-26&applyBookingRules=false"
```

### Test New Year Package

```bash
# Valid New Year package
curl "http://localhost:3000/api/vagas/search?checkin=2024-12-27&checkout=2025-01-02"

# Invalid - wrong check-in (with rules enabled)
curl "http://localhost:3000/api/vagas/search?checkin=2024-12-28&checkout=2025-01-02"

# Invalid - wrong check-out (with rules enabled)
curl "http://localhost:3000/api/vagas/search?checkin=2024-12-27&checkout=2025-01-01"

# Valid - custom dates with rules disabled
curl "http://localhost:3000/api/vagas/search?checkin=2024-12-28&checkout=2025-01-01&applyBookingRules=false"
```

# Invalid - wrong check-in
curl "http://localhost:3000/api/vagas/search?checkin=2024-12-28&checkout=2025-01-02"

# Invalid - wrong check-out
curl "http://localhost:3000/api/vagas/search?checkin=2024-12-27&checkout=2025-01-01"
```

### Test Non-Holiday Dates

```bash
# Normal dates - should work
curl "http://localhost:3000/api/vagas/search?checkin=2024-11-15&checkout=2024-11-20"

# Dates after New Year package - should work
curl "http://localhost:3000/api/vagas/search?checkin=2025-01-10&checkout=2025-01-15"
```

---

## Edge Cases Handled

### 1. December 27 Overlap

December 27 is both:
- The check-out date of the Christmas package
- The check-in date of the New Year package

**Resolution:** The validation logic checks the checkout month to determine priority. If checkout is in January, it's New Year package territory.

### 2. Year Boundary

New Year package spans two calendar years (Dec 27, 2024 → Jan 2, 2025).

**Implementation:** Validation correctly handles year transitions and requires the checkout year to be check-in year + 1.

### 3. Multiple Years

The same validation logic applies to any year (2024, 2025, 2026, etc.).

**Implementation:** No hardcoded years - logic based on month and day only.

---

## Client Implementation Example

```javascript
async function bookHoliday(checkin, checkout) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/vagas/search?checkin=${checkin}&checkout=${checkout}`
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      // Handle booking rule validation error
      if (data.code && data.code.includes('INVALID_')) {
        console.error(`Booking Error: ${data.error}`);
        console.error(`Required: ${data.requiredDates.checkin} to ${data.requiredDates.checkout}`);
        console.error(`See: ${data.documentation.reference}`);
        return null;
      }
      throw new Error(data.error);
    }
    
    // Success - check if it's a holiday package
    if (data.holidayPackage) {
      console.log(`✓ ${data.holidayPackage.name} (${data.holidayPackage.duration})`);
    }
    
    return data;
  } catch (error) {
    console.error('Booking failed:', error);
    return null;
  }
}

// Examples
bookHoliday('2024-12-22', '2024-12-27'); // Christmas package ✓
bookHoliday('2024-12-23', '2024-12-26'); // Error: Invalid Christmas package
bookHoliday('2024-12-27', '2025-01-02'); // New Year package ✓
```

---

## Migration Notes

### Backward Compatibility

The booking rules validation is **non-breaking** for existing integrations:

- Applies only to specific holiday periods
- Regular date ranges outside holiday periods work as before
- Error responses follow existing API error format
- All existing endpoints continue to work

### Rollout Strategy

1. ✅ Unit tests verify validation logic
2. ✅ Documentation updated across all files
3. ✅ Middleware integrated into routes
4. ⏳ Manual testing recommended before production
5. ⏳ Monitor API logs for validation errors after deployment

---

## Troubleshooting

### Issue: Validation error for valid dates

**Check:**
- Date format is YYYY-MM-DD
- Check-out is after check-in
- For holiday packages, dates match exactly

### Issue: Normal dates being rejected

**Check:**
- Dates are not within Dec 22-27 or Dec 27-Jan 2
- If dates include Dec 27, ensure they match a valid package

### Issue: Holiday package not detected in response

**Check:**
- Dates must match exactly: Dec 22-27 or Dec 27-Jan 2
- Response only includes `holidayPackage` field for valid packages

---

## Related Documentation

- [Functional Requirements - Section 6.3.1](./FUNCTIONAL_REQUIREMENTS.md#631-booking-rules)
- [API Documentation - Booking Rules](./API.md#booking-rules)
- [Client Documentation - Section 10.8](./API_CLIENT_DOCUMENTATION.md#108-booking-rules-validation)
- [Data Flow Documentation - Business Rules](./DATA_FLOW_DOCUMENTATION.md#business-rules)

---

## Future Enhancements

Potential improvements for future versions:

1. **Configurable Packages**: Store holiday package definitions in configuration/database
2. **Admin API**: Endpoints to manage holiday package dates
3. **Flexible Duration**: Allow variations in package length
4. **Multiple Packages**: Support for additional holiday periods (Easter, etc.)
5. **Partial Availability**: Show which parts of packages are available

---

## Support

For questions or issues related to booking rules:

1. Check this documentation
2. Review unit test cases in `tests/unit/bookingRules.test.js`
3. See [FUNCTIONAL_REQUIREMENTS.md](./FUNCTIONAL_REQUIREMENTS.md#631-booking-rules)
4. Check API error responses for detailed information

---

**Last Updated:** December 14, 2025  
**Version:** 1.4.0  
**Implemented By:** GitHub Copilot CLI
