/**
 * Testes unitários para helpers
 */
import { gerarId, validarEmail, respostaSucesso, respostaErro } from '../../src/utils/helpers.js';

describe('Helpers Utils', () => {
  describe('gerarId', () => {
    test('deve gerar um ID único', () => {
      const id1 = gerarId();
      const id2 = gerarId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });
  });

  describe('validarEmail', () => {
    test('deve validar email correto', () => {
      expect(validarEmail('teste@exemplo.com')).toBe(true);
      expect(validarEmail('usuario@dominio.com.br')).toBe(true);
    });

    test('deve rejeitar email inválido', () => {
      expect(validarEmail('email-invalido')).toBe(false);
      expect(validarEmail('@exemplo.com')).toBe(false);
      expect(validarEmail('teste@')).toBe(false);
    });
  });

  describe('respostaSucesso', () => {
    test('deve formatar resposta de sucesso corretamente', () => {
      const data = { id: 1, nome: 'Teste' };
      const resposta = respostaSucesso(data, 'Operação bem-sucedida');
      
      expect(resposta.sucesso).toBe(true);
      expect(resposta.mensagem).toBe('Operação bem-sucedida');
      expect(resposta.data).toEqual(data);
    });
  });

  describe('respostaErro', () => {
    test('deve formatar resposta de erro corretamente', () => {
      const erros = ['Erro 1', 'Erro 2'];
      const resposta = respostaErro('Falha na operação', erros);
      
      expect(resposta.sucesso).toBe(false);
      expect(resposta.mensagem).toBe('Falha na operação');
      expect(resposta.erros).toEqual(erros);
    });
  });
});
