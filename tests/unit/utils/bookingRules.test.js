// tests/unit/utils/bookingRules.test.js

import { 
  validateBookingDates, 
  getHolidayPackageInfo, 
  isHolidayPackage,
  HOLIDAY_PACKAGES 
} from '../../../src/utils/bookingRules.js';

describe('bookingRules - Date Validation', () => {
  // Happy Path Tests
  describe('Valid Booking Dates', () => {
    test('should accept valid Christmas package (Dec 22-27)', () => {
      const result = validateBookingDates('2024-12-22', '2024-12-27');
      expect(result.valid).toBe(true);
    });

    test('should accept valid New Year package (Dec 27 - Jan 2)', () => {
      const result = validateBookingDates('2024-12-27', '2025-01-02');
      expect(result.valid).toBe(true);
    });

    test('should accept regular dates outside holiday periods', () => {
      const result = validateBookingDates('2024-11-15', '2024-11-18');
      expect(result.valid).toBe(true);
    });
  });

  // Business Rule Tests (BR-18, BR-19)
  describe('Holiday Package Restrictions', () => {
    test('should reject partial Christmas period (BR-19)', () => {
      const result = validateBookingDates('2024-12-23', '2024-12-26');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_CHRISTMAS_PACKAGE');
      expect(result.package).toBe('Christmas Package');
    });

    test('should reject custom dates during Christmas (Dec 24-25)', () => {
      const result = validateBookingDates('2024-12-24', '2024-12-25');
      expect(result.valid).toBe(false);
    });

    test('should reject partial New Year period', () => {
      const result = validateBookingDates('2024-12-28', '2024-12-31');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_NEW_YEAR_PACKAGE');
    });

    test('should reject New Year dates without year boundary', () => {
      const result = validateBookingDates('2024-12-27', '2024-12-30');
      expect(result.valid).toBe(false);
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    test('should reject invalid date format', () => {
      const result = validateBookingDates('24-12-2024', '27-12-2024');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_DATE_FORMAT');
    });

    test('should reject checkout before checkin', () => {
      const result = validateBookingDates('2024-12-27', '2024-12-22');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_DATE_RANGE');
    });

    test('should reject same checkin and checkout', () => {
      const result = validateBookingDates('2024-12-25', '2024-12-25');
      expect(result.valid).toBe(false);
    });

    test('should handle Dec 27 overlap correctly (Christmas checkout)', () => {
      const result = validateBookingDates('2024-12-22', '2024-12-27');
      expect(result.valid).toBe(true); // Valid Christmas
    });

    test('should handle Dec 27 overlap correctly (New Year checkin)', () => {
      const result = validateBookingDates('2024-12-27', '2025-01-02');
      expect(result.valid).toBe(true); // Valid New Year
    });

    test('should handle null or undefined inputs', () => {
      const result1 = validateBookingDates(null, '2024-12-27');
      expect(result1.valid).toBe(false);
      
      const result2 = validateBookingDates('2024-12-22', undefined);
      expect(result2.valid).toBe(false);
    });

    test('should handle empty string inputs', () => {
      const result = validateBookingDates('', '2024-12-27');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_DATE_FORMAT');
    });
  });

  // Boundary Tests
  describe('Boundary Testing', () => {
    test('should accept Dec 21 checkout (before Christmas)', () => {
      const result = validateBookingDates('2024-12-18', '2024-12-21');
      expect(result.valid).toBe(true);
    });

    test('should accept Jan 3 checkin (after New Year)', () => {
      const result = validateBookingDates('2025-01-03', '2025-01-05');
      expect(result.valid).toBe(true);
    });

    test('should reject Dec 22 checkin with early checkout', () => {
      const result = validateBookingDates('2024-12-22', '2024-12-24');
      expect(result.valid).toBe(false);
    });

    test('should reject checkout on Dec 21 if checkin during Christmas', () => {
      const result = validateBookingDates('2024-12-20', '2024-12-23');
      expect(result.valid).toBe(false);
    });

    test('should reject Jan 3 checkout if checkin during New Year', () => {
      const result = validateBookingDates('2024-12-30', '2025-01-03');
      expect(result.valid).toBe(false);
    });
  });

  // Multiple Year Testing
  describe('Multi-Year Scenarios', () => {
    test('should validate Christmas 2025 correctly', () => {
      const result = validateBookingDates('2025-12-22', '2025-12-27');
      expect(result.valid).toBe(true);
    });

    test('should validate New Year 2025-2026 correctly', () => {
      const result = validateBookingDates('2025-12-27', '2026-01-02');
      expect(result.valid).toBe(true);
    });

    test('should validate Christmas 2026 correctly', () => {
      const result = validateBookingDates('2026-12-22', '2026-12-27');
      expect(result.valid).toBe(true);
    });

    test('should reject partial Christmas 2025', () => {
      const result = validateBookingDates('2025-12-23', '2025-12-26');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_CHRISTMAS_PACKAGE');
    });
  });
});

describe('getHolidayPackageInfo', () => {
  test('should return Christmas package info for valid dates', () => {
    const info = getHolidayPackageInfo('2024-12-22', '2024-12-27');
    expect(info).not.toBeNull();
    expect(info.name).toBe('Christmas Package');
    expect(info.type).toBe('CHRISTMAS');
    expect(info.isHolidayPackage).toBe(true);
  });

  test('should return New Year package info for valid dates', () => {
    const info = getHolidayPackageInfo('2024-12-27', '2025-01-02');
    expect(info).not.toBeNull();
    expect(info.name).toBe('New Year Package');
    expect(info.type).toBe('NEW_YEAR');
  });

  test('should return null for non-holiday dates', () => {
    const info = getHolidayPackageInfo('2024-11-15', '2024-11-18');
    expect(info).toBeNull();
  });

  test('should return null for invalid Christmas dates', () => {
    const info = getHolidayPackageInfo('2024-12-23', '2024-12-26');
    expect(info).toBeNull();
  });

  test('should return null for invalid New Year dates', () => {
    const info = getHolidayPackageInfo('2024-12-28', '2024-12-31');
    expect(info).toBeNull();
  });
});

describe('isHolidayPackage', () => {
  test('should return true for Christmas package', () => {
    expect(isHolidayPackage('2024-12-22', '2024-12-27')).toBe(true);
  });

  test('should return true for New Year package', () => {
    expect(isHolidayPackage('2024-12-27', '2025-01-02')).toBe(true);
  });

  test('should return false for regular dates', () => {
    expect(isHolidayPackage('2024-11-15', '2024-11-18')).toBe(false);
  });

  test('should return false for invalid Christmas dates', () => {
    expect(isHolidayPackage('2024-12-23', '2024-12-26')).toBe(false);
  });

  test('should return false for invalid New Year dates', () => {
    expect(isHolidayPackage('2024-12-28', '2024-12-31')).toBe(false);
  });
});

describe('HOLIDAY_PACKAGES constant', () => {
  test('should export HOLIDAY_PACKAGES object', () => {
    expect(HOLIDAY_PACKAGES).toBeDefined();
    expect(typeof HOLIDAY_PACKAGES).toBe('object');
    expect(HOLIDAY_PACKAGES.CHRISTMAS).toBeDefined();
    expect(HOLIDAY_PACKAGES.NEW_YEAR).toBeDefined();
  });

  test('should have Christmas package details', () => {
    const christmas = HOLIDAY_PACKAGES.CHRISTMAS;
    expect(christmas).toBeDefined();
    expect(christmas.name).toBe('Christmas Package');
    expect(christmas.startDay).toBe(22);
    expect(christmas.endDay).toBe(27);
  });

  test('should have New Year package details', () => {
    const newYear = HOLIDAY_PACKAGES.NEW_YEAR;
    expect(newYear).toBeDefined();
    expect(newYear.name).toBe('New Year Package');
    expect(newYear.startDay).toBe(27);
    expect(newYear.endDay).toBe(2);
  });
});
