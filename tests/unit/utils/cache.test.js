// tests/unit/utils/cache.test.js

import cache from '../../../src/utils/cache.js';

describe('Cache Utility', () => {
  beforeEach(() => {
    cache.clear();
  });

  afterEach(() => {
    cache.clear();
  });

  describe('set and get', () => {
    test('should store and retrieve value', () => {
      cache.set('key1', 'value1', 5000);
      expect(cache.get('key1')).toBe('value1');
    });

    test('should return null for non-existent key', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    test('should store objects correctly', () => {
      const obj = { id: 1, name: 'Test' };
      cache.set('obj', obj, 5000);
      expect(cache.get('obj')).toEqual(obj);
    });

    test('should store arrays correctly', () => {
      const arr = [1, 2, 3];
      cache.set('arr', arr, 5000);
      expect(cache.get('arr')).toEqual(arr);
    });
  });

  describe('TTL expiration', () => {
    test('should return null after TTL expires', async () => {
      cache.set('temp', 'value', 100); // 100ms TTL
      expect(cache.get('temp')).toBe('value');
      
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(cache.get('temp')).toBeNull();
    });

    test('should not expire before TTL', async () => {
      cache.set('temp', 'value', 500);
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(cache.get('temp')).toBe('value');
    });
  });

  describe('has', () => {
    test('should return true for existing key', () => {
      cache.set('key', 'value', 5000);
      expect(cache.has('key')).toBe(true);
    });

    test('should return false for non-existent key', () => {
      expect(cache.has('missing')).toBe(false);
    });

    test('should return false for expired key', async () => {
      cache.set('key', 'value', 50);
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(cache.has('key')).toBe(false);
    });
  });

  describe('delete', () => {
    test('should delete existing key', () => {
      cache.set('key', 'value', 5000);
      cache.delete('key');
      expect(cache.get('key')).toBeNull();
    });

    test('should handle deleting non-existent key', () => {
      expect(() => cache.delete('missing')).not.toThrow();
    });
  });

  describe('clear', () => {
    test('should clear all cache entries', () => {
      cache.set('key1', 'value1', 5000);
      cache.set('key2', 'value2', 5000);
      cache.clear();
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });
  });

  describe('getStats', () => {
    test('should return correct statistics', () => {
      cache.set('key1', 'value1', 5000);
      cache.set('key2', 'value2', 5000);
      const stats = cache.getStats();
      expect(stats.total).toBe(2);
      expect(stats.valid).toBe(2);
      expect(stats.expired).toBe(0);
    });

    test('should count expired entries', async () => {
      cache.set('expired', 'value', 50);
      cache.set('valid', 'value', 5000);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const stats = cache.getStats();
      expect(stats.total).toBe(2);
      expect(stats.valid).toBe(1);
      expect(stats.expired).toBe(1);
    });
  });

  describe('cleanup', () => {
    test('should remove expired entries', async () => {
      cache.set('expired', 'value', 50);
      cache.set('valid', 'value', 5000);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const removed = cache.cleanup();
      expect(removed).toBe(1);
      expect(cache.get('expired')).toBeNull();
      expect(cache.get('valid')).toBe('value');
    });
  });

  describe('getTTL', () => {
    test('should return remaining TTL', () => {
      cache.set('key', 'value', 5000);
      const ttl = cache.getTTL('key');
      expect(ttl).toBeGreaterThan(4000);
      expect(ttl).toBeLessThanOrEqual(5000);
    });

    test('should return null for expired key', async () => {
      cache.set('key', 'value', 50);
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(cache.getTTL('key')).toBeNull();
    });

    test('should return null for non-existent key', () => {
      expect(cache.getTTL('missing')).toBeNull();
    });
  });
});
