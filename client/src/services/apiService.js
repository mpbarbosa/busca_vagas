import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

/**
 * Serviço para comunicação com a API
 */
const apiService = {
  /**
   * Exemplo de método GET
   */
  getVagas: async () => {
    try {
      const response = await axios.get(`${API_URL}/vagas`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
      throw error;
    }
  },

  /**
   * Exemplo de método POST
   */
  createVaga: async (vagaData) => {
    try {
      const response = await axios.post(`${API_URL}/vagas`, vagaData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar vaga:', error);
      throw error;
    }
  }
};

export default apiService;
