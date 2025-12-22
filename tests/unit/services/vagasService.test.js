// tests/unit/services/vagasService.test.js

import {
  validateVagaData,
  isValidVagaData,
  filterVagasByHotel,
  filterVagasBySindicato,
  applyFilters,
  sortVagas,
  transformVagaData,
  transformVagasData
} from '../../../src/services/vagasService.js';

describe('vagasService - Business Logic Functions', () => {
  const sampleVagas = [
    {
      id: 1,
      titulo: 'Manager Position',
      hotel: 'Hotel A',
      hotelId: '4001',
      sindicato: 'Union 1',
      dataInicio: '2025-01-01'
    },
    {
      id: 2,
      titulo: 'Chef Position',
      hotel: 'Hotel B',
      hotelId: '4002',
      sindicato: 'Union 2',
      dataInicio: '2025-02-01'
    },
    {
      id: 3,
      titulo: 'Receptionist',
      hotel: 'Hotel A',
      hotelId: '4001',
      sindicato: 'Union 1',
      dataInicio: '2025-03-01'
    }
  ];

  describe('filterVagasByHotel', () => {
    test('should filter by hotel name', () => {
      const result = filterVagasByHotel(sampleVagas, 'Hotel A');
      expect(result).toHaveLength(2);
      expect(result.every(v => v.hotel === 'Hotel A')).toBe(true);
    });

    test('should return all vagas for "all" filter', () => {
      expect(filterVagasByHotel(sampleVagas, 'all')).toHaveLength(3);
      expect(filterVagasByHotel(sampleVagas, '-1')).toHaveLength(3);
    });

    test('should filter by hotelId', () => {
      const result = filterVagasByHotel(sampleVagas, '4002');
      expect(result).toHaveLength(1);
      expect(result[0].hotel).toBe('Hotel B');
    });

    test('should return empty array if no matches', () => {
      const result = filterVagasByHotel(sampleVagas, 'NonExistent');
      expect(result).toHaveLength(0);
    });

    test('should not mutate original array', () => {
      const original = [...sampleVagas];
      filterVagasByHotel(sampleVagas, 'Hotel A');
      expect(sampleVagas).toEqual(original);
    });
  });

  describe('filterVagasBySindicato', () => {
    test('should filter by sindicato name', () => {
      const result = filterVagasBySindicato(sampleVagas, 'Union 1');
      expect(result).toHaveLength(2);
      expect(result.every(v => v.sindicato === 'Union 1')).toBe(true);
    });

    test('should return all vagas for "all" filter', () => {
      expect(filterVagasBySindicato(sampleVagas, 'all')).toHaveLength(3);
    });

    test('should return empty array if no matches', () => {
      const result = filterVagasBySindicato(sampleVagas, 'NonExistent');
      expect(result).toHaveLength(0);
    });
  });

  describe('applyFilters', () => {
    test('should apply hotel filter', () => {
      const result = applyFilters(sampleVagas, { hotelId: '4001' });
      expect(result).toHaveLength(2);
      expect(result.every(v => v.hotelId === '4001')).toBe(true);
    });

    test('should apply search term filter on titulo', () => {
      const result = applyFilters(sampleVagas, { searchTerm: 'manager' });
      expect(result).toHaveLength(1);
      expect(result[0].titulo).toBe('Manager Position');
    });

    test('should apply case-insensitive search', () => {
      const result = applyFilters(sampleVagas, { searchTerm: 'CHEF' });
      expect(result).toHaveLength(1);
      expect(result[0].titulo).toBe('Chef Position');
    });

    test('should apply multiple filters', () => {
      const result = applyFilters(sampleVagas, { 
        hotelId: '4001', 
        searchTerm: 'recep' 
      });
      expect(result).toHaveLength(1);
      expect(result[0].titulo).toBe('Receptionist');
    });

    test('should return all vagas when no filters applied', () => {
      const result = applyFilters(sampleVagas, {});
      expect(result).toHaveLength(3);
    });
  });

  describe('sortVagas', () => {
    test('should sort by titulo ascending', () => {
      const result = sortVagas(sampleVagas, 'titulo', 'asc');
      expect(result[0].titulo).toBe('Chef Position');
      expect(result[2].titulo).toBe('Receptionist');
    });

    test('should sort by titulo descending', () => {
      const result = sortVagas(sampleVagas, 'titulo', 'desc');
      expect(result[0].titulo).toBe('Receptionist');
      expect(result[2].titulo).toBe('Chef Position');
    });

    test('should sort by dataInicio ascending', () => {
      const result = sortVagas(sampleVagas, 'dataInicio', 'asc');
      expect(result[0].dataInicio).toBe('2025-01-01');
      expect(result[2].dataInicio).toBe('2025-03-01');
    });

    test('should sort by dataInicio descending', () => {
      const result = sortVagas(sampleVagas, 'dataInicio', 'desc');
      expect(result[0].dataInicio).toBe('2025-03-01');
      expect(result[2].dataInicio).toBe('2025-01-01');
    });

    test('should not mutate original array', () => {
      const original = [...sampleVagas];
      sortVagas(sampleVagas, 'titulo', 'asc');
      expect(sampleVagas).toEqual(original);
    });

    test('should handle invalid sort field gracefully', () => {
      const result = sortVagas(sampleVagas, 'nonExistentField', 'asc');
      expect(result).toHaveLength(3);
    });
  });

  describe('transformVagaData', () => {
    test('should transform raw data to standard format', () => {
      const raw = {
        titulo: 'Test Job',
        hotel: 'Hotel A',
        hotelId: '4001',
        descricao: 'Test description'
      };
      
      const result = transformVagaData(raw);
      expect(result.titulo).toBe('Test Job');
      expect(result.hotel).toBe('Hotel A');
      expect(result.hotelId).toBe('4001');
    });

    test('should handle missing fields with defaults', () => {
      const result = transformVagaData({});
      expect(result).toBeDefined();
    });

    test('should not mutate original data', () => {
      const raw = { titulo: 'Test', hotel: 'Hotel A' };
      const original = { ...raw };
      transformVagaData(raw);
      expect(raw).toEqual(original);
    });
  });

  describe('validateVagaData', () => {
    test('should return empty array for valid data', () => {
      const data = {
        titulo: 'Test',
        hotel: 'Hotel A',
        sindicato: 'Union 1'
      };
      const errors = validateVagaData(data);
      expect(Array.isArray(errors)).toBe(true);
      expect(errors.length).toBe(0);
    });

    test('should return errors for missing titulo', () => {
      const data = { hotel: 'Hotel A', sindicato: 'Union 1' };
      const errors = validateVagaData(data);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('isValidVagaData', () => {
    test('should return true for valid data', () => {
      const data = {
        titulo: 'Test',
        hotel: 'Hotel A',
        sindicato: 'Union 1'
      };
      expect(isValidVagaData(data)).toBe(true);
    });

    test('should return false for invalid data', () => {
      expect(isValidVagaData({})).toBe(false);
    });
  });
});
