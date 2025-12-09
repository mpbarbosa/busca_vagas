/**
 * Unit tests for pure functions in hoteisService
 * These tests demonstrate referential transparency
 */

import { describe, expect, test } from '@jest/globals';
import * as hoteisService from '../../src/services/hoteisService.js';

describe('hoteisService - Pure Functions (Referentially Transparent)', () => {
  const sampleHotels = [
    { id: 1, hotelId: '-1', name: 'Todas', type: 'All' },
    { id: 2, hotelId: '4007', name: 'Amparo', type: 'Hotel' },
    { id: 3, hotelId: '4003', name: 'Appenzell', type: 'Hotel' }
  ];

  describe('findHotelById', () => {
    test('should be deterministic - same input produces same output', () => {
      const result1 = hoteisService.findHotelById(sampleHotels, 2);
      const result2 = hoteisService.findHotelById(sampleHotels, 2);
      const result3 = hoteisService.findHotelById(sampleHotels, 2);
      
      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result1.name).toBe('Amparo');
    });

    test('should not mutate input array', () => {
      const originalHotels = [...sampleHotels];
      const result = hoteisService.findHotelById(sampleHotels, 1);
      
      expect(sampleHotels).toEqual(originalHotels);
      expect(result).toBeDefined();
    });

    test('should handle string IDs by converting to number', () => {
      const result = hoteisService.findHotelById(sampleHotels, '3');
      expect(result.name).toBe('Appenzell');
    });

    test('should return null when hotel not found', () => {
      const result = hoteisService.findHotelById(sampleHotels, 999);
      expect(result).toBeNull();
    });

    test('should be referentially transparent - can replace call with result', () => {
      // The function call can be replaced with its result value
      const functionCall = hoteisService.findHotelById(sampleHotels, 2);
      const expectedResult = { id: 2, hotelId: '4007', name: 'Amparo', type: 'Hotel' };
      
      expect(functionCall).toEqual(expectedResult);
      
      // Using the result directly should work the same
      const usingResult = expectedResult;
      expect(functionCall).toEqual(usingResult);
    });
  });

  describe('findHotelByName', () => {
    test('should be deterministic - same input produces same output', () => {
      const result1 = hoteisService.findHotelByName(sampleHotels, 'Amparo');
      const result2 = hoteisService.findHotelByName(sampleHotels, 'Amparo');
      const result3 = hoteisService.findHotelByName(sampleHotels, 'Amparo');
      
      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });

    test('should be case insensitive', () => {
      const lower = hoteisService.findHotelByName(sampleHotels, 'amparo');
      const upper = hoteisService.findHotelByName(sampleHotels, 'AMPARO');
      const mixed = hoteisService.findHotelByName(sampleHotels, 'AmPaRo');
      
      expect(lower).toEqual(upper);
      expect(upper).toEqual(mixed);
      expect(lower.name).toBe('Amparo');
    });

    test('should not mutate input array', () => {
      const originalHotels = [...sampleHotels];
      hoteisService.findHotelByName(sampleHotels, 'Appenzell');
      
      expect(sampleHotels).toEqual(originalHotels);
    });

    test('should return null when hotel not found', () => {
      const result = hoteisService.findHotelByName(sampleHotels, 'Nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('transformHotelOptions', () => {
    const rawOptions = [
      { value: '-1', text: '  Todas  ' },
      { value: '4007', text: 'Amparo' },
      { value: '4003', text: '  Appenzell  ' }
    ];

    test('should be deterministic - same input produces same output', () => {
      const result1 = hoteisService.transformHotelOptions(rawOptions);
      const result2 = hoteisService.transformHotelOptions(rawOptions);
      const result3 = hoteisService.transformHotelOptions(rawOptions);
      
      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });

    test('should transform raw options to hotel objects', () => {
      const result = hoteisService.transformHotelOptions(rawOptions);
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        id: 1,
        hotelId: '-1',
        name: 'Todas',
        type: 'All'
      });
      expect(result[1]).toEqual({
        id: 2,
        hotelId: '4007',
        name: 'Amparo',
        type: 'Hotel'
      });
    });

    test('should trim whitespace from names', () => {
      const result = hoteisService.transformHotelOptions(rawOptions);
      
      expect(result[0].name).toBe('Todas');
      expect(result[2].name).toBe('Appenzell');
    });

    test('should assign "All" type for special values', () => {
      const specialOptions = [
        { value: '', text: 'All Hotels' },
        { value: '-1', text: 'Todas' }
      ];
      
      const result = hoteisService.transformHotelOptions(specialOptions);
      
      expect(result[0].type).toBe('All');
      expect(result[1].type).toBe('All');
    });

    test('should assign "Hotel" type for regular values', () => {
      const result = hoteisService.transformHotelOptions(rawOptions);
      
      expect(result[1].type).toBe('Hotel');
      expect(result[2].type).toBe('Hotel');
    });

    test('should not mutate input array', () => {
      const originalOptions = JSON.parse(JSON.stringify(rawOptions));
      hoteisService.transformHotelOptions(rawOptions);
      
      expect(rawOptions).toEqual(originalOptions);
    });

    test('should create new array (not same reference)', () => {
      const result = hoteisService.transformHotelOptions(rawOptions);
      
      expect(result).not.toBe(rawOptions);
    });
  });

  describe('calculateCacheInfo', () => {
    test('should be deterministic - same input produces same output', () => {
      const ttl = 86400000; // 24 hours
      const currentTime = 1702000000000; // Fixed timestamp
      const cacheTTL = 86400000;
      
      const result1 = hoteisService.calculateCacheInfo(ttl, currentTime, cacheTTL);
      const result2 = hoteisService.calculateCacheInfo(ttl, currentTime, cacheTTL);
      const result3 = hoteisService.calculateCacheInfo(ttl, currentTime, cacheTTL);
      
      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });

    test('should calculate cache info correctly when cached', () => {
      const ttl = 86400000; // 24 hours in ms
      const currentTime = 1702000000000;
      const cacheTTL = 86400000;
      
      const result = hoteisService.calculateCacheInfo(ttl, currentTime, cacheTTL);
      
      expect(result.cached).toBe(true);
      expect(result.ttlMs).toBe(ttl);
      expect(result.ttlHours).toBe('24.00');
      expect(result.expiresAt).toBe(new Date(currentTime + ttl).toISOString());
      expect(result.cacheTTLMs).toBe(cacheTTL);
    });

    test('should handle null TTL (not cached)', () => {
      const ttl = null;
      const currentTime = 1702000000000;
      const cacheTTL = 86400000;
      
      const result = hoteisService.calculateCacheInfo(ttl, currentTime, cacheTTL);
      
      expect(result.cached).toBe(false);
      expect(result.ttlMs).toBeNull();
      expect(result.ttlHours).toBeNull();
      expect(result.expiresAt).toBeNull();
    });

    test('should be pure - no side effects', () => {
      const ttl = 3600000;
      const currentTime = Date.now();
      const cacheTTL = 86400000;
      
      // Call multiple times - should not affect external state
      hoteisService.calculateCacheInfo(ttl, currentTime, cacheTTL);
      hoteisService.calculateCacheInfo(ttl, currentTime, cacheTTL);
      hoteisService.calculateCacheInfo(ttl, currentTime, cacheTTL);
      
      // All calls should produce identical results
      const result = hoteisService.calculateCacheInfo(ttl, currentTime, cacheTTL);
      expect(result.cached).toBe(true);
    });

    test('should handle different time values deterministically', () => {
      const ttl = 3600000; // 1 hour
      const time1 = 1702000000000;
      const time2 = 1702086400000; // 24 hours later
      const cacheTTL = 86400000;
      
      const result1 = hoteisService.calculateCacheInfo(ttl, time1, cacheTTL);
      const result2 = hoteisService.calculateCacheInfo(ttl, time2, cacheTTL);
      
      // Different inputs should produce different but predictable outputs
      expect(result1.expiresAt).not.toBe(result2.expiresAt);
      expect(result1.ttlMs).toBe(result2.ttlMs); // TTL should be same
    });
  });

  describe('Referential Transparency Properties', () => {
    test('pure functions can be memoized safely', () => {
      // Simulate memoization
      const cache = new Map();
      
      const memoizedFindById = (hotels, id) => {
        const key = JSON.stringify([hotels, id]);
        if (cache.has(key)) {
          return cache.get(key);
        }
        const result = hoteisService.findHotelById(hotels, id);
        cache.set(key, result);
        return result;
      };
      
      const result1 = memoizedFindById(sampleHotels, 2);
      const result2 = memoizedFindById(sampleHotels, 2); // From cache
      
      expect(result1).toEqual(result2);
      expect(result1.name).toBe('Amparo');
    });

    test('pure functions are composable', () => {
      const rawOptions = [
        { value: '4007', text: 'Amparo' },
        { value: '4003', text: 'Appenzell' }
      ];
      
      // Compose: transform then find
      const transformed = hoteisService.transformHotelOptions(rawOptions);
      const found = hoteisService.findHotelByName(transformed, 'Amparo');
      
      expect(found).toBeDefined();
      expect(found.hotelId).toBe('4007');
    });

    test('pure functions can be tested without mocks', () => {
      // No mocks needed - just test with direct inputs
      const hotels = [
        { id: 1, name: 'Hotel A', hotelId: '001', type: 'Hotel' },
        { id: 2, name: 'Hotel B', hotelId: '002', type: 'Hotel' }
      ];
      
      const result = hoteisService.findHotelById(hotels, 1);
      
      expect(result.name).toBe('Hotel A');
    });
  });
});
