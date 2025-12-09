/**
 * Tests for hotel service cache functionality
 */

import * as hoteisService from '../../src/services/hoteisService.js';
import cache from '../../src/utils/cache.js';

describe('HoteisService - Cache', () => {
  beforeEach(() => {
    cache.clear();
  });

  afterAll(() => {
    cache.clear();
  });

  describe('getAllHotels', () => {
    it('should return default hotels when cache is empty', () => {
      const hotels = hoteisService.getAllHotels();
      expect(Array.isArray(hotels)).toBe(true);
      expect(hotels.length).toBeGreaterThan(0);
      expect(hotels[0]).toHaveProperty('id');
      expect(hotels[0]).toHaveProperty('hotelId');
      expect(hotels[0]).toHaveProperty('name');
    });

    it('should return cached hotels when available', () => {
      const cachedHotels = [
        { id: 1, hotelId: '999', name: 'Cached Hotel', type: 'Hotel' }
      ];
      
      cache.set('hotel_list', cachedHotels, 60000);
      
      const hotels = hoteisService.getAllHotels(true);
      expect(hotels).toEqual(cachedHotels);
    });

    it('should bypass cache when useCache is false', () => {
      const cachedHotels = [
        { id: 1, hotelId: '999', name: 'Cached Hotel', type: 'Hotel' }
      ];
      
      cache.set('hotel_list', cachedHotels, 60000);
      
      const hotels = hoteisService.getAllHotels(false);
      expect(hotels).not.toEqual(cachedHotels);
      expect(hotels.length).toBeGreaterThan(1);
    });
  });

  describe('getHotelById', () => {
    it('should find hotel from default list', () => {
      const hotel = hoteisService.getHotelById(1);
      expect(hotel).toBeTruthy();
      expect(hotel.id).toBe(1);
    });

    it('should find hotel from cached list', () => {
      const cachedHotels = [
        { id: 99, hotelId: '999', name: 'Cached Hotel', type: 'Hotel' }
      ];
      
      cache.set('hotel_list', cachedHotels, 60000);
      
      const hotel = hoteisService.getHotelById(99);
      expect(hotel).toBeTruthy();
      expect(hotel.name).toBe('Cached Hotel');
    });

    it('should return null for non-existent ID', () => {
      const hotel = hoteisService.getHotelById(9999);
      expect(hotel).toBeNull();
    });
  });

  describe('getHotelByName', () => {
    it('should find hotel by name (case insensitive)', () => {
      const hotel = hoteisService.getHotelByName('amparo');
      expect(hotel).toBeTruthy();
      expect(hotel.name).toBe('Amparo');
    });

    it('should return null for non-existent name', () => {
      const hotel = hoteisService.getHotelByName('NonExistent');
      expect(hotel).toBeNull();
    });
  });

  describe('getCacheInfo', () => {
    it('should return cache info when not cached', () => {
      const info = hoteisService.getCacheInfo();
      expect(info).toHaveProperty('cached');
      expect(info).toHaveProperty('ttlMs');
      expect(info).toHaveProperty('cacheTTLMs');
      expect(info.cached).toBe(false);
      expect(info.ttlMs).toBeNull();
    });

    it('should return cache info when cached', () => {
      const cachedHotels = [
        { id: 1, hotelId: '999', name: 'Test', type: 'Hotel' }
      ];
      
      cache.set('hotel_list', cachedHotels, 60000);
      
      const info = hoteisService.getCacheInfo();
      expect(info.cached).toBe(true);
      expect(info.ttlMs).toBeLessThanOrEqual(60000);
      expect(info.ttlMs).toBeGreaterThan(0);
    });
  });

  describe('clearCache', () => {
    it('should clear the hotel cache', () => {
      const cachedHotels = [
        { id: 1, hotelId: '999', name: 'Test', type: 'Hotel' }
      ];
      
      cache.set('hotel_list', cachedHotels, 60000);
      expect(cache.has('hotel_list')).toBe(true);
      
      hoteisService.clearCache();
      expect(cache.has('hotel_list')).toBe(false);
    });
  });

  describe('scrapeHotelList - cache behavior', () => {
    it('should return cached hotels if available and not forced', async () => {
      const cachedHotels = [
        { id: 1, hotelId: '999', name: 'Cached', type: 'Hotel' }
      ];
      
      cache.set('hotel_list', cachedHotels, 60000);
      
      const hotels = await hoteisService.scrapeHotelList(false);
      expect(hotels).toEqual(cachedHotels);
    });
  });
});
