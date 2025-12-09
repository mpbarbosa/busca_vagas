/**
 * Unit tests for pure functions in vagasService
 * These tests demonstrate referential transparency
 */

import { describe, expect, test } from '@jest/globals';
import * as vagasService from '../../src/services/vagasService.js';

describe('vagasService - Pure Functions (Referentially Transparent)', () => {
  const sampleVagas = [
    {
      id: 1,
      titulo: 'Vaga Hotel A',
      descricao: 'Descrição da vaga A',
      hotel: 'Hotel A',
      hotelId: '4001',
      sindicato: 'Sindicato 1',
      sindicatoId: 'S001',
      dataInicio: '2025-01-01',
      dataFim: '2025-01-07',
      vagas: 5,
      status: 'disponivel'
    },
    {
      id: 2,
      titulo: 'Vaga Hotel B',
      descricao: 'Descrição da vaga B',
      hotel: 'Hotel B',
      hotelId: '4002',
      sindicato: 'Sindicato 2',
      sindicatoId: 'S002',
      dataInicio: '2025-01-15',
      dataFim: '2025-01-22',
      vagas: 3,
      status: 'disponivel'
    },
    {
      id: 3,
      titulo: 'Vaga Hotel A - Fim de Semana',
      descricao: 'Vaga especial para fim de semana',
      hotel: 'Hotel A',
      hotelId: '4001',
      sindicato: 'Sindicato 1',
      sindicatoId: 'S001',
      dataInicio: '2025-02-01',
      dataFim: '2025-02-03',
      vagas: 2,
      status: 'disponivel'
    }
  ];

  describe('validateVagaData', () => {
    test('should be deterministic - same input produces same output', () => {
      const vagaData = { titulo: 'Test', hotel: 'Hotel A', sindicato: 'Sindicato 1' };
      
      const result1 = vagasService.validateVagaData(vagaData);
      const result2 = vagasService.validateVagaData(vagaData);
      const result3 = vagasService.validateVagaData(vagaData);
      
      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });

    test('should return empty array for valid data', () => {
      const vagaData = {
        titulo: 'Vaga Teste',
        hotel: 'Hotel A',
        sindicato: 'Sindicato 1'
      };
      
      const erros = vagasService.validateVagaData(vagaData);
      
      expect(erros).toEqual([]);
      expect(erros.length).toBe(0);
    });

    test('should return error when titulo is missing', () => {
      const vagaData = {
        hotel: 'Hotel A',
        sindicato: 'Sindicato 1'
      };
      
      const erros = vagasService.validateVagaData(vagaData);
      
      expect(erros).toContain('Título é obrigatório');
      expect(erros.length).toBeGreaterThan(0);
    });

    test('should return error when hotel is missing', () => {
      const vagaData = {
        titulo: 'Vaga Teste',
        sindicato: 'Sindicato 1'
      };
      
      const erros = vagasService.validateVagaData(vagaData);
      
      expect(erros).toContain('Hotel é obrigatório');
    });

    test('should return error when sindicato is missing', () => {
      const vagaData = {
        titulo: 'Vaga Teste',
        hotel: 'Hotel A'
      };
      
      const erros = vagasService.validateVagaData(vagaData);
      
      expect(erros).toContain('Sindicato é obrigatório');
    });

    test('should return multiple errors when multiple fields are missing', () => {
      const vagaData = {};
      
      const erros = vagasService.validateVagaData(vagaData);
      
      expect(erros.length).toBe(3);
      expect(erros).toContain('Título é obrigatório');
      expect(erros).toContain('Hotel é obrigatório');
      expect(erros).toContain('Sindicato é obrigatório');
    });

    test('should handle invalid input gracefully', () => {
      const erros1 = vagasService.validateVagaData(null);
      const erros2 = vagasService.validateVagaData(undefined);
      const erros3 = vagasService.validateVagaData('invalid');
      
      expect(erros1).toContain('Dados da vaga são inválidos');
      expect(erros2).toContain('Dados da vaga são inválidos');
      expect(erros3).toContain('Dados da vaga são inválidos');
    });

    test('should not mutate input object', () => {
      const vagaData = { titulo: 'Test', hotel: 'Hotel A', sindicato: 'Sindicato 1' };
      const original = { ...vagaData };
      
      vagasService.validateVagaData(vagaData);
      
      expect(vagaData).toEqual(original);
    });
  });

  describe('isValidVagaData', () => {
    test('should be deterministic', () => {
      const vagaData = { titulo: 'Test', hotel: 'Hotel A', sindicato: 'Sindicato 1' };
      
      const result1 = vagasService.isValidVagaData(vagaData);
      const result2 = vagasService.isValidVagaData(vagaData);
      
      expect(result1).toBe(result2);
    });

    test('should return true for valid data', () => {
      const vagaData = {
        titulo: 'Vaga Teste',
        hotel: 'Hotel A',
        sindicato: 'Sindicato 1'
      };
      
      expect(vagasService.isValidVagaData(vagaData)).toBe(true);
    });

    test('should return false for invalid data', () => {
      const vagaData = { titulo: 'Test' };
      
      expect(vagasService.isValidVagaData(vagaData)).toBe(false);
    });
  });

  describe('filterVagasByHotel', () => {
    test('should be deterministic', () => {
      const result1 = vagasService.filterVagasByHotel(sampleVagas, '4001');
      const result2 = vagasService.filterVagasByHotel(sampleVagas, '4001');
      
      expect(result1).toEqual(result2);
    });

    test('should filter vacancies by hotel ID', () => {
      const result = vagasService.filterVagasByHotel(sampleVagas, '4001');
      
      expect(result.length).toBe(2);
      expect(result.every(v => v.hotelId === '4001')).toBe(true);
    });

    test('should return all vacancies when hotelId is "all"', () => {
      const result = vagasService.filterVagasByHotel(sampleVagas, 'all');
      
      expect(result).toEqual(sampleVagas);
    });

    test('should return all vacancies when hotelId is "-1"', () => {
      const result = vagasService.filterVagasByHotel(sampleVagas, '-1');
      
      expect(result).toEqual(sampleVagas);
    });

    test('should return empty array when no matches', () => {
      const result = vagasService.filterVagasByHotel(sampleVagas, '9999');
      
      expect(result).toEqual([]);
    });

    test('should not mutate input array', () => {
      const original = [...sampleVagas];
      
      vagasService.filterVagasByHotel(sampleVagas, '4001');
      
      expect(sampleVagas).toEqual(original);
    });
  });

  describe('filterVagasBySindicato', () => {
    test('should be deterministic', () => {
      const result1 = vagasService.filterVagasBySindicato(sampleVagas, 'S001');
      const result2 = vagasService.filterVagasBySindicato(sampleVagas, 'S001');
      
      expect(result1).toEqual(result2);
    });

    test('should filter vacancies by sindicato ID', () => {
      const result = vagasService.filterVagasBySindicato(sampleVagas, 'S001');
      
      expect(result.length).toBe(2);
      expect(result.every(v => v.sindicatoId === 'S001')).toBe(true);
    });

    test('should return all vacancies when sindicatoId is "all"', () => {
      const result = vagasService.filterVagasBySindicato(sampleVagas, 'all');
      
      expect(result).toEqual(sampleVagas);
    });

    test('should not mutate input array', () => {
      const original = [...sampleVagas];
      
      vagasService.filterVagasBySindicato(sampleVagas, 'S001');
      
      expect(sampleVagas).toEqual(original);
    });
  });

  describe('applyFilters', () => {
    test('should be deterministic', () => {
      const filtros = { hotelId: '4001' };
      
      const result1 = vagasService.applyFilters(sampleVagas, filtros);
      const result2 = vagasService.applyFilters(sampleVagas, filtros);
      
      expect(result1).toEqual(result2);
    });

    test('should filter by hotel ID only', () => {
      const result = vagasService.applyFilters(sampleVagas, { hotelId: '4001' });
      
      expect(result.length).toBe(2);
      expect(result.every(v => v.hotelId === '4001')).toBe(true);
    });

    test('should filter by sindicato ID only', () => {
      const result = vagasService.applyFilters(sampleVagas, { sindicatoId: 'S002' });
      
      expect(result.length).toBe(1);
      expect(result[0].sindicatoId).toBe('S002');
    });

    test('should filter by search term in title', () => {
      const result = vagasService.applyFilters(sampleVagas, { searchTerm: 'fim de semana' });
      
      expect(result.length).toBe(1);
      expect(result[0].titulo).toContain('Fim de Semana');
    });

    test('should filter by search term in description', () => {
      const result = vagasService.applyFilters(sampleVagas, { searchTerm: 'especial' });
      
      expect(result.length).toBe(1);
      expect(result[0].descricao).toContain('especial');
    });

    test('should apply multiple filters together', () => {
      const result = vagasService.applyFilters(sampleVagas, {
        hotelId: '4001',
        searchTerm: 'semana'
      });
      
      expect(result.length).toBe(1);
      expect(result[0].hotelId).toBe('4001');
      expect(result[0].titulo).toContain('Semana');
    });

    test('should return all when no filters provided', () => {
      const result = vagasService.applyFilters(sampleVagas, {});
      
      expect(result).toEqual(sampleVagas);
    });

    test('should not mutate input array', () => {
      const original = [...sampleVagas];
      
      vagasService.applyFilters(sampleVagas, { hotelId: '4001' });
      
      expect(sampleVagas).toEqual(original);
    });

    test('should handle empty search term', () => {
      const result = vagasService.applyFilters(sampleVagas, { searchTerm: '   ' });
      
      expect(result).toEqual(sampleVagas);
    });
  });

  describe('sortVagas', () => {
    test('should be deterministic', () => {
      const result1 = vagasService.sortVagas(sampleVagas, 'titulo', 'asc');
      const result2 = vagasService.sortVagas(sampleVagas, 'titulo', 'asc');
      
      expect(result1).toEqual(result2);
    });

    test('should sort by titulo ascending', () => {
      const result = vagasService.sortVagas(sampleVagas, 'titulo', 'asc');
      
      expect(result[0].titulo).toBe('Vaga Hotel A');
      expect(result[2].titulo).toBe('Vaga Hotel B');
    });

    test('should sort by titulo descending', () => {
      const result = vagasService.sortVagas(sampleVagas, 'titulo', 'desc');
      
      expect(result[0].titulo).toBe('Vaga Hotel B');
      expect(result[2].titulo).toBe('Vaga Hotel A');
    });

    test('should sort by hotel', () => {
      const result = vagasService.sortVagas(sampleVagas, 'hotel', 'asc');
      
      expect(result[0].hotel).toBe('Hotel A');
      expect(result[2].hotel).toBe('Hotel B');
    });

    test('should not mutate input array', () => {
      const original = [...sampleVagas];
      
      vagasService.sortVagas(sampleVagas, 'titulo', 'asc');
      
      expect(sampleVagas).toEqual(original);
    });

    test('should create new array', () => {
      const result = vagasService.sortVagas(sampleVagas, 'titulo', 'asc');
      
      expect(result).not.toBe(sampleVagas);
    });
  });

  describe('transformVagaData', () => {
    test('should be deterministic', () => {
      const rawVaga = { titulo: 'Test', hotel: 'Hotel A' };
      
      const result1 = vagasService.transformVagaData(rawVaga);
      const result2 = vagasService.transformVagaData(rawVaga);
      
      expect(result1).toEqual(result2);
    });

    test('should transform raw data to standard format', () => {
      const rawVaga = {
        id: 1,
        titulo: 'Test Vaga',
        hotel: 'Hotel A',
        hotelId: '4001',
        sindicato: 'Sindicato 1',
        sindicatoId: 'S001'
      };
      
      const result = vagasService.transformVagaData(rawVaga);
      
      expect(result).toEqual({
        id: 1,
        titulo: 'Test Vaga',
        descricao: '',
        hotel: 'Hotel A',
        hotelId: '4001',
        sindicato: 'Sindicato 1',
        sindicatoId: 'S001',
        dataInicio: null,
        dataFim: null,
        vagas: 0,
        status: 'disponivel'
      });
    });

    test('should handle alternative field names', () => {
      const rawVaga = {
        title: 'Test Title',
        description: 'Test Description',
        hotel_id: '4001',
        sindicato_id: 'S001',
        data_inicio: '2025-01-01',
        data_fim: '2025-01-07',
        quantidade: 5
      };
      
      const result = vagasService.transformVagaData(rawVaga);
      
      expect(result.titulo).toBe('Test Title');
      expect(result.descricao).toBe('Test Description');
      expect(result.hotelId).toBe('4001');
      expect(result.sindicatoId).toBe('S001');
      expect(result.dataInicio).toBe('2025-01-01');
      expect(result.dataFim).toBe('2025-01-07');
      expect(result.vagas).toBe(5);
    });

    test('should provide default values for missing fields', () => {
      const rawVaga = {};
      
      const result = vagasService.transformVagaData(rawVaga);
      
      expect(result.id).toBeNull();
      expect(result.titulo).toBe('');
      expect(result.descricao).toBe('');
      expect(result.vagas).toBe(0);
      expect(result.status).toBe('disponivel');
    });

    test('should not mutate input object', () => {
      const rawVaga = { titulo: 'Test', hotel: 'Hotel A' };
      const original = { ...rawVaga };
      
      vagasService.transformVagaData(rawVaga);
      
      expect(rawVaga).toEqual(original);
    });
  });

  describe('transformVagasData', () => {
    test('should be deterministic', () => {
      const rawVagas = [
        { titulo: 'Vaga 1', hotel: 'Hotel A' },
        { titulo: 'Vaga 2', hotel: 'Hotel B' }
      ];
      
      const result1 = vagasService.transformVagasData(rawVagas);
      const result2 = vagasService.transformVagasData(rawVagas);
      
      expect(result1).toEqual(result2);
    });

    test('should transform multiple vacancy records', () => {
      const rawVagas = [
        { titulo: 'Vaga 1', hotel: 'Hotel A', hotelId: '4001' },
        { titulo: 'Vaga 2', hotel: 'Hotel B', hotelId: '4002' }
      ];
      
      const result = vagasService.transformVagasData(rawVagas);
      
      expect(result.length).toBe(2);
      expect(result[0].titulo).toBe('Vaga 1');
      expect(result[1].titulo).toBe('Vaga 2');
    });

    test('should return empty array for invalid input', () => {
      expect(vagasService.transformVagasData(null)).toEqual([]);
      expect(vagasService.transformVagasData(undefined)).toEqual([]);
      expect(vagasService.transformVagasData('invalid')).toEqual([]);
    });

    test('should not mutate input array', () => {
      const rawVagas = [
        { titulo: 'Vaga 1', hotel: 'Hotel A' }
      ];
      const original = JSON.parse(JSON.stringify(rawVagas));
      
      vagasService.transformVagasData(rawVagas);
      
      expect(rawVagas).toEqual(original);
    });
  });

  describe('Referential Transparency Properties', () => {
    test('pure functions can be composed', () => {
      const rawVaga = { titulo: 'Test', hotel: 'Hotel A', sindicato: 'Sindicato 1' };
      
      // Compose: transform then validate
      const transformed = vagasService.transformVagaData(rawVaga);
      const isValid = vagasService.isValidVagaData(transformed);
      
      expect(isValid).toBe(true);
    });

    test('pure functions can be chained for complex operations', () => {
      // Filter by hotel, then sort, then filter by search term
      const filtered = vagasService.filterVagasByHotel(sampleVagas, '4001');
      const sorted = vagasService.sortVagas(filtered, 'titulo', 'asc');
      const searched = vagasService.applyFilters(sorted, { searchTerm: 'vaga' });
      
      expect(searched.length).toBeGreaterThan(0);
      expect(searched[0].hotelId).toBe('4001');
    });

    test('pure functions can be tested without mocks', () => {
      const vagas = [
        { id: 1, titulo: 'Vaga A', hotelId: '001', sindicatoId: 'S1' },
        { id: 2, titulo: 'Vaga B', hotelId: '002', sindicatoId: 'S2' }
      ];
      
      const result = vagasService.filterVagasByHotel(vagas, '001');
      
      expect(result.length).toBe(1);
      expect(result[0].titulo).toBe('Vaga A');
    });

    test('pure functions are memoization-safe', () => {
      const cache = new Map();
      
      const memoizedFilter = (vagas, hotelId) => {
        const key = JSON.stringify([vagas, hotelId]);
        if (cache.has(key)) {
          return cache.get(key);
        }
        const result = vagasService.filterVagasByHotel(vagas, hotelId);
        cache.set(key, result);
        return result;
      };
      
      const result1 = memoizedFilter(sampleVagas, '4001');
      const result2 = memoizedFilter(sampleVagas, '4001'); // From cache
      
      expect(result1).toEqual(result2);
    });
  });
});
