/**
 * Utilitários para formatação de dados
 */

/**
 * Formata data para o padrão brasileiro
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data formatada
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

/**
 * Formata valor monetário para o padrão brasileiro
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
