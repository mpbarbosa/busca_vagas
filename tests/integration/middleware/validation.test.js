/**
 * Integration Tests - Validation Middleware
 */
import { jest } from '@jest/globals';

// Import middleware functions
let validarVaga, validateBookingRules;

describe('Validation Middleware', () => {
  beforeAll(async () => {
    const validationModule = await import('../../../src/middlewares/validation.js');
    validarVaga = validationModule.validarVaga;
    validateBookingRules = validationModule.validateBookingRules;
  });

  describe('validarVaga()', () => {
    let req, res, next;

    beforeEach(() => {
      req = { body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
    });

    test('should call next() for valid vaga data', () => {
      req.body = { titulo: 'Test', hotel: 'Hotel', sindicato: 'Union' };
      validarVaga(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should return 400 for missing titulo', () => {
      req.body = { hotel: 'Hotel', sindicato: 'Union' };
      validarVaga(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 400 for missing hotel', () => {
      req.body = { titulo: 'Test', sindicato: 'Union' };
      validarVaga(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('should return 400 for missing sindicato', () => {
      req.body = { titulo: 'Test', hotel: 'Hotel' };
      validarVaga(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateBookingRules()', () => {
    let req, res, next;

    beforeEach(() => {
      req = { query: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
    });

    test('should call next() for valid Christmas dates', () => {
      req.query = { checkin: '2024-12-22', checkout: '2024-12-27' };
      validateBookingRules(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.holidayPackage).toBeDefined();
    });

    test('should return 400 for invalid Christmas dates', () => {
      req.query = { checkin: '2024-12-23', checkout: '2024-12-26' };
      validateBookingRules(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    test('should bypass rules with applyBookingRules=false', () => {
      req.query = {
        checkin: '2024-12-23',
        checkout: '2024-12-26',
        applyBookingRules: 'false'
      };
      validateBookingRules(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.bookingRulesBypassed).toBe(true);
    });

    test('should call next() when no dates provided', () => {
      validateBookingRules(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('should accept valid New Year dates', () => {
      req.query = { checkin: '2024-12-27', checkout: '2025-01-02' };
      validateBookingRules(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.holidayPackage).toBeDefined();
    });

    test('should reject invalid New Year dates', () => {
      req.query = { checkin: '2024-12-28', checkout: '2025-01-01' };
      validateBookingRules(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('should reject invalid date format', () => {
      req.query = { checkin: 'invalid-date', checkout: '2024-12-27' };
      validateBookingRules(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('should reject checkout before checkin', () => {
      req.query = { checkin: '2024-12-27', checkout: '2024-12-22' };
      validateBookingRules(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
