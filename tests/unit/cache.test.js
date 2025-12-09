/**
 * Tests for cache utility
 */

import cache from '../../src/utils/cache.js';

describe('Cache Utility', () => {
  beforeEach(() => {
    cache.clear();
  });

  afterAll(() => {
    cache.clear();
  });

  describe('set and get', () => {
    it('should store and retrieve a value', () => {
      cache.set('test', 'value', 1000);
      expect(cache.get('test')).toBe('value');
    });

    it('should return null for non-existent key', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    it('should store complex objects', () => {
      const obj = { name: 'Test', value: 123 };
      cache.set('obj', obj, 1000);
      expect(cache.get('obj')).toEqual(obj);
    });

    it('should store arrays', () => {
      const arr = [1, 2, 3, 4, 5];
      cache.set('arr', arr, 1000);
      expect(cache.get('arr')).toEqual(arr);
    });
  });

  describe('expiration', () => {
    it('should expire after TTL', async () => {
      cache.set('expire', 'value', 100); // 100ms TTL
      expect(cache.get('expire')).toBe('value');
      
      await new Promise(resolve => setTimeout(resolve, 150));
      
      expect(cache.get('expire')).toBeNull();
    });

    it('should not expire before TTL', async () => {
      cache.set('noexpire', 'value', 200);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(cache.get('noexpire')).toBe('value');
    });
  });

  describe('has', () => {
    it('should return true for existing key', () => {
      cache.set('exists', 'value', 1000);
      expect(cache.has('exists')).toBe(true);
    });

    it('should return false for non-existent key', () => {
      expect(cache.has('notexists')).toBe(false);
    });

    it('should return false for expired key', async () => {
      cache.set('expired', 'value', 50);
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(cache.has('expired')).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete a key', () => {
      cache.set('delete', 'value', 1000);
      expect(cache.has('delete')).toBe(true);
      
      cache.delete('delete');
      expect(cache.has('delete')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all cache', () => {
      cache.set('key1', 'value1', 1000);
      cache.set('key2', 'value2', 1000);
      cache.set('key3', 'value3', 1000);
      
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(true);
      expect(cache.has('key3')).toBe(true);
      
      cache.clear();
      
      expect(cache.has('key1')).toBe(false);
      expect(cache.has('key2')).toBe(false);
      expect(cache.has('key3')).toBe(false);
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', () => {
      cache.set('stat1', 'value1', 1000);
      cache.set('stat2', 'value2', 1000);
      
      const stats = cache.getStats();
      expect(stats.total).toBe(2);
      expect(stats.valid).toBe(2);
      expect(stats.expired).toBe(0);
    });

    it('should count expired entries', async () => {
      cache.set('valid', 'value', 1000);
      cache.set('expired', 'value', 50);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const stats = cache.getStats();
      expect(stats.total).toBe(2);
      expect(stats.valid).toBe(1);
      expect(stats.expired).toBe(1);
    });
  });

  describe('cleanup', () => {
    it('should remove expired entries', async () => {
      cache.set('keep', 'value', 1000);
      cache.set('remove', 'value', 50);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const removed = cache.cleanup();
      expect(removed).toBe(1);
      expect(cache.has('keep')).toBe(true);
      expect(cache.has('remove')).toBe(false);
    });
  });

  describe('getTTL', () => {
    it('should return remaining TTL', () => {
      cache.set('ttl', 'value', 1000);
      const ttl = cache.getTTL('ttl');
      
      expect(ttl).toBeLessThanOrEqual(1000);
      expect(ttl).toBeGreaterThan(900);
    });

    it('should return null for non-existent key', () => {
      expect(cache.getTTL('notexists')).toBeNull();
    });

    it('should return null for expired key', async () => {
      cache.set('expired', 'value', 50);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(cache.getTTL('expired')).toBeNull();
    });
  });
});
