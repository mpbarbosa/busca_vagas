/**
 * Booking Rules Unit Tests
 * Tests for holiday package validation (BR-18, BR-19, BR-20)
 * 
 * @module tests/unit/bookingRules
 * @version 1.5.0
 * @since 1.4.0
 * @updated 1.5.0 - Note: This file tests the validation logic only.
 *                   The applyBookingRules parameter is handled at the middleware level.
 */

import {
  validateBookingDates,
  getHolidayPackageInfo,
  isHolidayPackage,
  HOLIDAY_PACKAGES
} from '../../src/utils/bookingRules.js';

describe('Booking Rules - Holiday Packages (BR-18, BR-19, BR-20)', () => {
  
  describe('Christmas Package Validation', () => {
    
    test('should accept valid Christmas package dates (Dec 22-27)', () => {
      const result = validateBookingDates('2024-12-22', '2024-12-27');
      expect(result.valid).toBe(true);
      expect(result.message).toContain('valid');
    });
    
    test('should reject partial Christmas period (Dec 23-26)', () => {
      const result = validateBookingDates('2024-12-23', '2024-12-26');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_CHRISTMAS_PACKAGE');
      expect(result.error).toContain('December 22');
      expect(result.error).toContain('December 27');
    });
    
    test('should reject Christmas period with wrong check-in (Dec 21-27)', () => {
      const result = validateBookingDates('2024-12-21', '2024-12-27');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_CHRISTMAS_PACKAGE');
    });
    
    test('should reject Christmas period with wrong check-out (Dec 22-28)', () => {
      const result = validateBookingDates('2024-12-22', '2024-12-28');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_CHRISTMAS_PACKAGE');
    });
    
    test('should reject single day during Christmas period (Dec 24-25)', () => {
      const result = validateBookingDates('2024-12-24', '2024-12-25');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_CHRISTMAS_PACKAGE');
    });
    
  });
  
  describe('New Year Package Validation', () => {
    
    test('should accept valid New Year package dates (Dec 27-Jan 2)', () => {
      const result = validateBookingDates('2024-12-27', '2025-01-02');
      expect(result.valid).toBe(true);
      expect(result.message).toContain('valid');
    });
    
    test('should reject partial New Year period (Dec 28-Jan 1)', () => {
      const result = validateBookingDates('2024-12-28', '2025-01-01');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_NEW_YEAR_PACKAGE');
      expect(result.error).toContain('December 27');
      expect(result.error).toContain('January 2');
    });
    
    test('should reject New Year period with wrong check-in (Dec 28-Jan 2)', () => {
      const result = validateBookingDates('2024-12-28', '2025-01-02');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_NEW_YEAR_PACKAGE');
    });
    
    test('should reject New Year period with wrong check-out (Dec 27-Jan 1)', () => {
      const result = validateBookingDates('2024-12-27', '2025-01-01');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_NEW_YEAR_PACKAGE');
    });
    
    test('should reject single day during New Year period (Dec 31-Jan 1)', () => {
      const result = validateBookingDates('2024-12-31', '2025-01-01');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_NEW_YEAR_PACKAGE');
    });
    
  });
  
  describe('Non-Holiday Period Validation', () => {
    
    test('should accept normal dates outside holiday periods', () => {
      const result = validateBookingDates('2024-11-15', '2024-11-20');
      expect(result.valid).toBe(true);
    });
    
    test('should accept dates in January after New Year package', () => {
      const result = validateBookingDates('2025-01-10', '2025-01-15');
      expect(result.valid).toBe(true);
    });
    
    test('should accept dates in December before Christmas package', () => {
      const result = validateBookingDates('2024-12-15', '2024-12-20');
      expect(result.valid).toBe(true);
    });
    
  });
  
  describe('Date Format Validation', () => {
    
    test('should reject invalid date format', () => {
      const result = validateBookingDates('12-25-2024', '12-26-2024');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_DATE_FORMAT');
    });
    
    test('should reject malformed dates', () => {
      const result = validateBookingDates('2024-13-01', '2024-13-02');
      expect(result.valid).toBe(false);
    });
    
    test('should reject check-out before check-in', () => {
      const result = validateBookingDates('2024-11-20', '2024-11-15');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_DATE_RANGE');
      expect(result.error).toContain('after');
    });
    
    test('should reject same check-in and check-out', () => {
      const result = validateBookingDates('2024-11-15', '2024-11-15');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_DATE_RANGE');
    });
    
  });
  
  describe('Holiday Package Information', () => {
    
    test('should return Christmas package info for valid dates', () => {
      const info = getHolidayPackageInfo('2024-12-22', '2024-12-27');
      expect(info).not.toBeNull();
      expect(info.type).toBe('CHRISTMAS');
      expect(info.name).toBe('Christmas Package');
      expect(info.isHolidayPackage).toBe(true);
      expect(info.duration).toBe('5 days/4 nights');
    });
    
    test('should return New Year package info for valid dates', () => {
      const info = getHolidayPackageInfo('2024-12-27', '2025-01-02');
      expect(info).not.toBeNull();
      expect(info.type).toBe('NEW_YEAR');
      expect(info.name).toBe('New Year Package');
      expect(info.isHolidayPackage).toBe(true);
      expect(info.duration).toBe('6 days/5 nights');
    });
    
    test('should return null for non-holiday dates', () => {
      const info = getHolidayPackageInfo('2024-11-15', '2024-11-20');
      expect(info).toBeNull();
    });
    
    test('should return null for invalid holiday package dates', () => {
      const info = getHolidayPackageInfo('2024-12-23', '2024-12-26');
      expect(info).toBeNull();
    });
    
  });
  
  describe('isHolidayPackage Helper', () => {
    
    test('should return true for valid Christmas package', () => {
      expect(isHolidayPackage('2024-12-22', '2024-12-27')).toBe(true);
    });
    
    test('should return true for valid New Year package', () => {
      expect(isHolidayPackage('2024-12-27', '2025-01-02')).toBe(true);
    });
    
    test('should return false for non-holiday dates', () => {
      expect(isHolidayPackage('2024-11-15', '2024-11-20')).toBe(false);
    });
    
    test('should return false for invalid holiday dates', () => {
      expect(isHolidayPackage('2024-12-23', '2024-12-26')).toBe(false);
    });
    
  });
  
  describe('Edge Cases', () => {
    
    test('should handle leap year dates correctly', () => {
      const result = validateBookingDates('2024-02-28', '2024-03-01');
      expect(result.valid).toBe(true);
    });
    
    test('should handle year boundary correctly for New Year', () => {
      const result = validateBookingDates('2024-12-27', '2025-01-02');
      expect(result.valid).toBe(true);
      
      const info = getHolidayPackageInfo('2024-12-27', '2025-01-02');
      expect(info.type).toBe('NEW_YEAR');
    });
    
    test('should validate multiple years (2025 Christmas package)', () => {
      const result = validateBookingDates('2025-12-22', '2025-12-27');
      expect(result.valid).toBe(true);
      
      const info = getHolidayPackageInfo('2025-12-22', '2025-12-27');
      expect(info.type).toBe('CHRISTMAS');
    });
    
  });
  
  describe('Error Response Structure', () => {
    
    test('should include required fields in error response for Christmas', () => {
      const result = validateBookingDates('2024-12-23', '2024-12-26');
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('error');
      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('package');
      expect(result).toHaveProperty('requiredDates');
      expect(result.requiredDates).toHaveProperty('checkin');
      expect(result.requiredDates).toHaveProperty('checkout');
      expect(result.requiredDates).toHaveProperty('format');
    });
    
    test('should include required fields in error response for New Year', () => {
      const result = validateBookingDates('2024-12-28', '2025-01-01');
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('error');
      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('package');
      expect(result.requiredDates.format).toContain('YYYY-12-27');
      expect(result.requiredDates.format).toContain('YYYY+1-01-02');
    });
    
  });
  
  describe('HOLIDAY_PACKAGES Constants', () => {
    
    test('should have correct Christmas package definition', () => {
      expect(HOLIDAY_PACKAGES.CHRISTMAS.startMonth).toBe(11); // December
      expect(HOLIDAY_PACKAGES.CHRISTMAS.startDay).toBe(22);
      expect(HOLIDAY_PACKAGES.CHRISTMAS.endMonth).toBe(11);
      expect(HOLIDAY_PACKAGES.CHRISTMAS.endDay).toBe(27);
    });
    
    test('should have correct New Year package definition', () => {
      expect(HOLIDAY_PACKAGES.NEW_YEAR.startMonth).toBe(11); // December
      expect(HOLIDAY_PACKAGES.NEW_YEAR.startDay).toBe(27);
      expect(HOLIDAY_PACKAGES.NEW_YEAR.endMonth).toBe(0); // January
      expect(HOLIDAY_PACKAGES.NEW_YEAR.endDay).toBe(2);
    });
    
  });
  
});
