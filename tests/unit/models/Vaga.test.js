// tests/unit/models/Vaga.test.js

import Vaga from '../../../src/models/Vaga.js';

describe('Vaga Model', () => {
  describe('constructor', () => {
    test('should create instance with all properties', () => {
      const data = {
        id: 1,
        titulo: 'Manager Position',
        descricao: 'Test description',
        hotel: 'Hotel A',
        hotelId: '4001',
        sindicato: 'Union 1',
        sindicatoId: 'S001',
        localizacao: 'São Paulo',
        salario: 5000,
        requisitos: ['Experience', 'Portuguese'],
        dataInicio: '2025-01-01',
        dataFim: '2025-01-07'
      };
      
      const vaga = new Vaga(data);
      expect(vaga.id).toBe(1);
      expect(vaga.titulo).toBe('Manager Position');
      expect(vaga.hotel).toBe('Hotel A');
      expect(vaga.sindicato).toBe('Union 1');
      expect(vaga.requisitos).toEqual(['Experience', 'Portuguese']);
    });

    test('should set default dataCriacao if not provided', () => {
      const vaga = new Vaga({ titulo: 'Test' });
      expect(vaga.dataCriacao).toBeInstanceOf(Date);
    });

    test('should use provided dataCriacao', () => {
      const customDate = new Date('2024-01-01');
      const vaga = new Vaga({ 
        titulo: 'Test',
        dataCriacao: customDate 
      });
      expect(vaga.dataCriacao).toBe(customDate);
    });

    test('should handle minimal data', () => {
      const vaga = new Vaga({
        titulo: 'Minimal Vaga'
      });
      expect(vaga.titulo).toBe('Minimal Vaga');
      expect(vaga.id).toBeUndefined();
    });

    test('should store all optional properties', () => {
      const data = {
        titulo: 'Test',
        hotel: 'Hotel A',
        descricao: 'Description',
        localizacao: 'Location',
        salario: 1000,
        requisitos: ['Requirement 1']
      };
      
      const vaga = new Vaga(data);
      expect(vaga.descricao).toBe('Description');
      expect(vaga.localizacao).toBe('Location');
      expect(vaga.salario).toBe(1000);
      expect(vaga.requisitos).toEqual(['Requirement 1']);
    });
  });

  describe('validar', () => {
    test('should pass validation for valid data', () => {
      const vaga = new Vaga({
        titulo: 'Manager Position',
        hotel: 'Hotel A',
        sindicato: 'Union 1'
      });
      
      expect(vaga.validar()).toBe(true);
    });

    test('should throw error for missing titulo', () => {
      const vaga = new Vaga({ 
        hotel: 'Hotel A', 
        sindicato: 'Union 1' 
      });
      expect(() => vaga.validar()).toThrow('Título é obrigatório');
    });

    test('should throw error for empty titulo', () => {
      const vaga = new Vaga({ 
        titulo: '',
        hotel: 'Hotel A', 
        sindicato: 'Union 1' 
      });
      expect(() => vaga.validar()).toThrow('Título é obrigatório');
    });

    test('should throw error for missing hotel', () => {
      const vaga = new Vaga({ 
        titulo: 'Test', 
        sindicato: 'Union 1' 
      });
      expect(() => vaga.validar()).toThrow('Hotel é obrigatório');
    });

    test('should throw error for empty hotel', () => {
      const vaga = new Vaga({ 
        titulo: 'Test',
        hotel: '',
        sindicato: 'Union 1' 
      });
      expect(() => vaga.validar()).toThrow('Hotel é obrigatório');
    });

    test('should throw error for missing sindicato', () => {
      const vaga = new Vaga({ 
        titulo: 'Test', 
        hotel: 'Hotel A' 
      });
      expect(() => vaga.validar()).toThrow('Sindicato é obrigatório');
    });

    test('should throw error for empty sindicato', () => {
      const vaga = new Vaga({ 
        titulo: 'Test',
        hotel: 'Hotel A',
        sindicato: ''
      });
      expect(() => vaga.validar()).toThrow('Sindicato é obrigatório');
    });

    test('should throw descriptive error messages', () => {
      const vaga = new Vaga({});
      
      try {
        vaga.validar();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toContain('obrigatório');
      }
    });
  });

  describe('toJSON', () => {
    test('should serialize to JSON', () => {
      const data = {
        id: 1,
        titulo: 'Test',
        hotel: 'Hotel A',
        sindicato: 'Union 1'
      };
      
      const vaga = new Vaga(data);
      const json = JSON.stringify(vaga);
      const parsed = JSON.parse(json);
      
      expect(parsed.id).toBe(1);
      expect(parsed.titulo).toBe('Test');
      expect(parsed.hotel).toBe('Hotel A');
    });

    test('should include all properties in JSON', () => {
      const vaga = new Vaga({
        titulo: 'Test',
        hotel: 'Hotel A',
        sindicato: 'Union 1',
        descricao: 'Description'
      });
      
      const parsed = JSON.parse(JSON.stringify(vaga));
      expect(parsed.descricao).toBe('Description');
    });
  });
});
