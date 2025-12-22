/**
 * Validation Middleware Unit Tests
 * Tests for applyBookingRules parameter handling (BR-20)
 * 
 * @module tests/unit/validation.middleware
 * @version 1.5.0
 * @since 1.5.0
 */

import { validateBookingRules } from '../../src/middlewares/validation.js';

describe('Validation Middleware - applyBookingRules Parameter (BR-20)', () => {
  
  describe('Parameter Handling', () => {
    
    test('should skip validation when dates are not provided', () => {
      const req = { query: {} };
      let statusCalled = false;
      let nextCalled = false;
      
      const res = {
        status: () => { statusCalled = true; return res; },
        json: () => res
      };
      const next = () => { nextCalled = true; };
      
      validateBookingRules(req, res, next);
      
      expect(nextCalled).toBe(true);
      expect(statusCalled).toBe(false);
    });
    
    test('should enforce rules by default (applyBookingRules omitted)', () => {
      const req = {
        query: {
          checkin: '2024-12-23',
          checkout: '2024-12-26'
        }
      };
      
      let statusCode = null;
      let jsonResponse = null;
      let nextCalled = false;
      
      const res = {
        status: (code) => { statusCode = code; return res; },
        json: (data) => { jsonResponse = data; return res; }
      };
      const next = () => { nextCalled = true; };
      
      validateBookingRules(req, res, next);
      
      expect(statusCode).toBe(400);
      expect(jsonResponse).toBeDefined();
      expect(jsonResponse.code).toBe('INVALID_CHRISTMAS_PACKAGE');
      expect(nextCalled).toBe(false);
    });
    
    test('should enforce rules when applyBookingRules=true', () => {
      const req = {
        query: {
          checkin: '2024-12-23',
          checkout: '2024-12-26',
          applyBookingRules: 'true'
        }
      };
      
      let statusCode = null;
      let nextCalled = false;
      
      const res = {
        status: (code) => { statusCode = code; return res; },
        json: () => res
      };
      const next = () => { nextCalled = true; };
      
      validateBookingRules(req, res, next);
      
      expect(statusCode).toBe(400);
      expect(nextCalled).toBe(false);
    });
    
    test('should bypass rules when applyBookingRules=false', () => {
      const req = {
        query: {
          checkin: '2024-12-23',
          checkout: '2024-12-26',
          applyBookingRules: 'false'
        }
      };
      
      let statusCalled = false;
      let nextCalled = false;
      
      const res = {
        status: () => { statusCalled = true; return res; },
        json: () => res
      };
      const next = () => { nextCalled = true; };
      
      validateBookingRules(req, res, next);
      
      expect(nextCalled).toBe(true);
      expect(statusCalled).toBe(false);
      expect(req.bookingRulesBypassed).toBe(true);
    });
    
  });
  
  describe('Christmas Package - Rules Bypassed', () => {
    
    test('should allow partial Christmas dates when rules bypassed', () => {
      const req = {
        query: {
          checkin: '2024-12-23',
          checkout: '2024-12-26',
          applyBookingRules: 'false'
        }
      };
      
      let nextCalled = false;
      const res = {
        status: () => res,
        json: () => res
      };
      const next = () => { nextCalled = true; };
      
      validateBookingRules(req, res, next);
      
      expect(nextCalled).toBe(true);
      expect(req.bookingRulesBypassed).toBe(true);
    });
    
    test('should allow single day in Christmas period when rules bypassed', () => {
      const req = {
        query: {
          checkin: '2024-12-24',
          checkout: '2024-12-25',
          applyBookingRules: 'false'
        }
      };
      
      let nextCalled = false;
      const res = {
        status: () => res,
        json: () => res
      };
      const next = () => { nextCalled = true; };
      
      validateBookingRules(req, res, next);
      
      expect(nextCalled).toBe(true);
      expect(req.bookingRulesBypassed).toBe(true);
    });
    
  });
  
  describe('New Year Package - Rules Bypassed', () => {
    
    test('should allow partial New Year dates when rules bypassed', () => {
      const req = {
        query: {
          checkin: '2024-12-28',
          checkout: '2025-01-01',
          applyBookingRules: 'false'
        }
      };
      
      let nextCalled = false;
      const res = {
        status: () => res,
        json: () => res
      };
      const next = () => { nextCalled = true; };
      
      validateBookingRules(req, res, next);
      
      expect(nextCalled).toBe(true);
      expect(req.bookingRulesBypassed).toBe(true);
    });
    
  });
  
  describe('Valid Holiday Packages', () => {
    
    test('should accept valid Christmas package with rules enforced', () => {
      const req = {
        query: {
          checkin: '2024-12-22',
          checkout: '2024-12-27',
          applyBookingRules: 'true'
        }
      };
      
      let nextCalled = false;
      let statusCalled = false;
      const res = {
        status: () => { statusCalled = true; return res; },
        json: () => res
      };
      const next = () => { nextCalled = true; };
      
      validateBookingRules(req, res, next);
      
      expect(nextCalled).toBe(true);
      expect(statusCalled).toBe(false);
      expect(req.holidayPackage).toBeDefined();
      expect(req.holidayPackage.type).toBe('CHRISTMAS');
    });
    
    test('should accept valid Christmas package with rules bypassed', () => {
      const req = {
        query: {
          checkin: '2024-12-22',
          checkout: '2024-12-27',
          applyBookingRules: 'false'
        }
      };
      
      let nextCalled = false;
      const res = {
        status: () => res,
        json: () => res
      };
      const next = () => { nextCalled = true; };
      
      validateBookingRules(req, res, next);
      
      expect(nextCalled).toBe(true);
      expect(req.bookingRulesBypassed).toBe(true);
      expect(req.holidayPackage).toBeDefined();
      expect(req.holidayPackage.type).toBe('CHRISTMAS');
    });
    
    test('should accept valid New Year package with rules enforced', () => {
      const req = {
        query: {
          checkin: '2024-12-27',
          checkout: '2025-01-02',
          applyBookingRules: 'true'
        }
      };
      
      let nextCalled = false;
      let statusCalled = false;
      const res = {
        status: () => { statusCalled = true; return res; },
        json: () => res
      };
      const next = () => { nextCalled = true; };
      
      validateBookingRules(req, res, next);
      
      expect(nextCalled).toBe(true);
      expect(statusCalled).toBe(false);
      expect(req.holidayPackage).toBeDefined();
      expect(req.holidayPackage.type).toBe('NEW_YEAR');
    });
    
  });
  
  describe('Non-Holiday Dates', () => {
    
    test('should accept non-holiday dates with rules enforced', () => {
      const req = {
        query: {
          checkin: '2024-11-15',
          checkout: '2024-11-20',
          applyBookingRules: 'true'
        }
      };
      
      let nextCalled = false;
      let statusCalled = false;
      const res = {
        status: () => { statusCalled = true; return res; },
        json: () => res
      };
      const next = () => { nextCalled = true; };
      
      validateBookingRules(req, res, next);
      
      expect(nextCalled).toBe(true);
      expect(statusCalled).toBe(false);
      expect(req.holidayPackage).toBeUndefined();
    });
    
    test('should accept non-holiday dates with rules bypassed', () => {
      const req = {
        query: {
          checkin: '2024-11-15',
          checkout: '2024-11-20',
          applyBookingRules: 'false'
        }
      };
      
      let nextCalled = false;
      const res = {
        status: () => res,
        json: () => res
      };
      const next = () => { nextCalled = true; };
      
      validateBookingRules(req, res, next);
      
      expect(nextCalled).toBe(true);
      expect(req.bookingRulesBypassed).toBe(true);
      expect(req.holidayPackage).toBeUndefined();
    });
    
  });
  
  describe('Error Response Structure', () => {
    
    test('should include bypass option hint in error response', () => {
      const req = {
        query: {
          checkin: '2024-12-23',
          checkout: '2024-12-26',
          applyBookingRules: 'true'
        }
      };
      
      let jsonResponse = null;
      const res = {
        status: () => res,
        json: (data) => { jsonResponse = data; return res; }
      };
      const next = () => {};
      
      validateBookingRules(req, res, next);
      
      expect(jsonResponse.documentation.businessRules).toContain('BR-20');
      expect(jsonResponse.documentation.bypassOption).toContain('applyBookingRules=false');
    });
    
    test('should include all business rules in error response', () => {
      const req = {
        query: {
          checkin: '2024-12-23',
          checkout: '2024-12-26'
        }
      };
      
      let jsonResponse = null;
      const res = {
        status: () => res,
        json: (data) => { jsonResponse = data; return res; }
      };
      const next = () => {};
      
      validateBookingRules(req, res, next);
      
      expect(jsonResponse.documentation.businessRules).toContain('BR-18');
      expect(jsonResponse.documentation.businessRules).toContain('BR-19');
      expect(jsonResponse.documentation.businessRules).toContain('BR-20');
    });
    
  });
  
});

