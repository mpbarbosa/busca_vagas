/**
 * Unit tests for hoteisService
 */

import { describe, expect, test } from '@jest/globals';
import * as hoteisService from '../../src/services/hoteisService.js';

describe('hoteisService', () => {
  describe('getAllHotels', () => {
    test('should return an array of hotels', () => {
      const hotels = hoteisService.getAllHotels();
      
      expect(Array.isArray(hotels)).toBe(true);
      expect(hotels.length).toBeGreaterThan(0);
    });

    test('should return hotels with required properties', () => {
      const hotels = hoteisService.getAllHotels();
      
      hotels.forEach(hotel => {
        expect(hotel).toHaveProperty('id');
        expect(hotel).toHaveProperty('name');
        expect(hotel).toHaveProperty('type');
      });
    });
  });

  describe('getHotelById', () => {
    test('should return hotel when valid ID is provided', () => {
      const hotel = hoteisService.getHotelById(1);
      
      expect(hotel).toBeDefined();
      expect(hotel.id).toBe(1);
    });

    test('should return null when invalid ID is provided', () => {
      const hotel = hoteisService.getHotelById(9999);
      
      expect(hotel).toBeNull();
    });

    test('should handle string ID', () => {
      const hotel = hoteisService.getHotelById('1');
      
      expect(hotel).toBeDefined();
      expect(hotel.id).toBe(1);
    });
  });

  describe('getHotelByName', () => {
    test('should return hotel when valid name is provided', () => {
      const hotel = hoteisService.getHotelByName('BLUES Appenzell');
      
      expect(hotel).toBeDefined();
      expect(hotel.name).toBe('BLUES Appenzell');
    });

    test('should be case insensitive', () => {
      const hotel = hoteisService.getHotelByName('blues appenzell');
      
      expect(hotel).toBeDefined();
      expect(hotel.name).toBe('BLUES Appenzell');
    });

    test('should return null when hotel not found', () => {
      const hotel = hoteisService.getHotelByName('Nonexistent Hotel');
      
      expect(hotel).toBeNull();
    });
  });

  describe('scrapeHotelList', () => {
    test('should be a function', () => {
      expect(typeof hoteisService.scrapeHotelList).toBe('function');
    });

    // Note: Actual scraping test would require browser and network access
    // This is tested in integration tests
  });
});
