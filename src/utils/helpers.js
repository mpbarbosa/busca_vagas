/**
 * Utilitários gerais
 */

/**
 * Gera um ID único
 */
const gerarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Formata resposta de sucesso
 */
const respostaSucesso = (data, mensagem = 'Sucesso') => {
  return {
    sucesso: true,
    mensagem,
    data
  };
};

/**
 * Formata resposta de erro
 */
const respostaErro = (mensagem, erros = []) => {
  return {
    sucesso: false,
    mensagem,
    erros
  };
};

/**
 * Valida email
 */
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

module.exports = {
  gerarId,
  respostaSucesso,
  respostaErro,
  validarEmail
};
