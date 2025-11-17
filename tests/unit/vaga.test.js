/**
 * Testes unitários para o modelo Vaga
 */
const Vaga = require('../../src/models/Vaga');

describe('Modelo Vaga', () => {
  test('deve criar uma vaga com dados válidos', () => {
    const dadosVaga = {
      id: 1,
      titulo: 'Recepcionista',
      descricao: 'Vaga para recepcionista de hotel',
      hotel: 'Hotel Example',
      sindicato: 'Sindicato dos Hoteleiros',
      localizacao: 'São Paulo, SP',
      salario: 2500,
      requisitos: ['Ensino médio completo', 'Experiência']
    };

    const vaga = new Vaga(dadosVaga);

    expect(vaga.titulo).toBe('Recepcionista');
    expect(vaga.hotel).toBe('Hotel Example');
    expect(vaga.sindicato).toBe('Sindicato dos Hoteleiros');
  });

  test('deve validar vaga com dados completos', () => {
    const vaga = new Vaga({
      titulo: 'Recepcionista',
      hotel: 'Hotel Example',
      sindicato: 'Sindicato dos Hoteleiros'
    });

    expect(() => vaga.validar()).not.toThrow();
  });

  test('deve lançar erro ao validar vaga sem título', () => {
    const vaga = new Vaga({
      hotel: 'Hotel Example',
      sindicato: 'Sindicato dos Hoteleiros'
    });

    expect(() => vaga.validar()).toThrow('Título é obrigatório');
  });

  test('deve lançar erro ao validar vaga sem hotel', () => {
    const vaga = new Vaga({
      titulo: 'Recepcionista',
      sindicato: 'Sindicato dos Hoteleiros'
    });

    expect(() => vaga.validar()).toThrow('Hotel é obrigatório');
  });

  test('deve lançar erro ao validar vaga sem sindicato', () => {
    const vaga = new Vaga({
      titulo: 'Recepcionista',
      hotel: 'Hotel Example'
    });

    expect(() => vaga.validar()).toThrow('Sindicato é obrigatório');
  });
});
