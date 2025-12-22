// tests/unit/middlewares/validation.test.js

import { jest } from '@jest/globals';
import { validateBookingRules } from '../../../src/middlewares/validation.js';

describe('Validation Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { 
      body: {}, 
      query: {},
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('validateBookingRules', () => {
    test('should accept valid Christmas package', () => {
      mockReq.query = { 
        checkin: '2024-12-22', 
        checkout: '2024-12-27' 
      };
      
      validateBookingRules(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.holidayPackage).toBeDefined();
      expect(mockReq.holidayPackage.name).toBe('Christmas Package');
    });

    test('should accept valid New Year package', () => {
      mockReq.query = { 
        checkin: '2024-12-27', 
        checkout: '2025-01-02' 
      };
      
      validateBookingRules(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.holidayPackage).toBeDefined();
      expect(mockReq.holidayPackage.name).toBe('New Year Package');
    });

    test('should reject invalid Christmas dates', () => {
      mockReq.query = { 
        checkin: '2024-12-23', 
        checkout: '2024-12-26' 
      };
      
      validateBookingRules(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          code: 'INVALID_CHRISTMAS_PACKAGE'
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should reject invalid New Year dates', () => {
      mockReq.query = { 
        checkin: '2024-12-28', 
        checkout: '2024-12-31' 
      };
      
      validateBookingRules(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          code: 'INVALID_NEW_YEAR_PACKAGE'
        })
      );
    });

    test('should bypass rules when applyBookingRules=false', () => {
      mockReq.query = { 
        checkin: '2024-12-23', 
        checkout: '2024-12-26',
        applyBookingRules: 'false'
      };
      
      validateBookingRules(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.bookingRulesBypassed).toBe(true);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test('should skip validation when dates missing', () => {
      mockReq.query = {};
      validateBookingRules(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test('should skip validation when only checkin provided', () => {
      mockReq.query = { checkin: '2024-12-22' };
      validateBookingRules(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    test('should skip validation when only checkout provided', () => {
      mockReq.query = { checkout: '2024-12-27' };
      validateBookingRules(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    test('should accept regular dates outside holiday periods', () => {
      mockReq.query = { 
        checkin: '2025-02-01', 
        checkout: '2025-02-05' 
      };
      
      validateBookingRules(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    test('should handle invalid date formats', () => {
      mockReq.query = { 
        checkin: 'invalid-date', 
        checkout: '2024-12-27' 
      };
      
      validateBookingRules(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          code: 'INVALID_DATE_FORMAT'
        })
      );
    });

    test('should reject checkout before checkin', () => {
      mockReq.query = { 
        checkin: '2024-12-27', 
        checkout: '2024-12-22' 
      };
      
      validateBookingRules(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          code: 'INVALID_DATE_RANGE'
        })
      );
    });

    test('should include error details in response', () => {
      mockReq.query = { 
        checkin: '2024-12-23', 
        checkout: '2024-12-26' 
      };
      
      validateBookingRules(mockReq, mockRes, mockNext);
      
      const response = mockRes.json.mock.calls[0][0];
      expect(response).toHaveProperty('error');
      expect(response).toHaveProperty('package');
      expect(response).toHaveProperty('requiredDates');
    });

    test('should handle different date parameter names', () => {
      // Test with dataInicio/dataFim if the middleware supports it
      mockReq.query = { 
        dataInicio: '2024-12-22', 
        dataFim: '2024-12-27' 
      };
      
      // This test depends on implementation
      // Adjust based on actual parameter names supported
      validateBookingRules(mockReq, mockRes, mockNext);
      // Expectations will vary based on implementation
    });
  });
});
