// tests/unit/utils/helpers.test.js

import { 
  gerarId, 
  respostaSucesso, 
  respostaErro, 
  validarEmail 
} from '../../../src/utils/helpers.js';

describe('Helper Utilities', () => {
  describe('gerarId', () => {
    test('should generate unique IDs', () => {
      const id1 = gerarId();
      const id2 = gerarId();
      expect(id1).not.toBe(id2);
    });

    test('should generate non-empty string', () => {
      const id = gerarId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    test('should generate IDs with consistent format', () => {
      const id = gerarId();
      // IDs should be alphanumeric or contain hyphens
      expect(id).toMatch(/^[a-z0-9-]+$/);
    });

    test('should generate multiple unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(gerarId());
      }
      expect(ids.size).toBe(100); // All should be unique
    });
  });

  describe('respostaSucesso', () => {
    test('should format success response with data', () => {
      const data = { id: 1, name: 'Test' };
      const result = respostaSucesso(data, 'Created');
      
      expect(result.sucesso).toBe(true);
      expect(result.mensagem).toBe('Created');
      expect(result.data).toEqual(data);
    });

    test('should use default message', () => {
      const result = respostaSucesso({ id: 1 });
      expect(result.mensagem).toBe('Sucesso');
    });

    test('should handle null data', () => {
      const result = respostaSucesso(null);
      expect(result.sucesso).toBe(true);
      expect(result.data).toBeNull();
    });

    test('should handle array data', () => {
      const data = [1, 2, 3];
      const result = respostaSucesso(data);
      expect(result.data).toEqual(data);
    });
  });

  describe('respostaErro', () => {
    test('should format error response', () => {
      const result = respostaErro('Error message', ['error1', 'error2']);
      
      expect(result.sucesso).toBe(false);
      expect(result.mensagem).toBe('Error message');
      expect(result.erros).toEqual(['error1', 'error2']);
    });

    test('should use empty array as default', () => {
      const result = respostaErro('Error');
      expect(result.erros).toEqual([]);
    });

    test('should handle single error', () => {
      const result = respostaErro('Failed', ['single error']);
      expect(result.erros).toHaveLength(1);
      expect(result.erros[0]).toBe('single error');
    });

    test('should handle empty message', () => {
      const result = respostaErro('');
      expect(result.sucesso).toBe(false);
      expect(result.mensagem).toBe('');
    });
  });

  describe('validarEmail', () => {
    test('should validate correct email', () => {
      expect(validarEmail('test@example.com')).toBe(true);
      expect(validarEmail('user.name@domain.co.uk')).toBe(true);
      expect(validarEmail('user+tag@example.com')).toBe(true);
    });

    test('should reject invalid emails', () => {
      expect(validarEmail('invalid')).toBe(false);
      expect(validarEmail('missing@')).toBe(false);
      expect(validarEmail('@domain.com')).toBe(false);
      expect(validarEmail('no-domain@')).toBe(false);
    });

    test('should reject emails without @', () => {
      expect(validarEmail('nodomain.com')).toBe(false);
    });

    test('should reject emails with spaces', () => {
      expect(validarEmail('test @example.com')).toBe(false);
      expect(validarEmail('test@ example.com')).toBe(false);
    });

    test('should handle null or undefined', () => {
      expect(validarEmail(null)).toBe(false);
      expect(validarEmail(undefined)).toBe(false);
    });

    test('should reject empty string', () => {
      expect(validarEmail('')).toBe(false);
    });
  });
});
