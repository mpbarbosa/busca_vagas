import * as hoteisService from '../services/hoteisService.js';

/**
 * List all hotels
 * GET /api/vagas/hoteis
 */
export const listarHoteis = async (req, res) => {
  try {
    const hoteis = hoteisService.getAllHotels();
    
    res.json({
      success: true,
      count: hoteis.length,
      data: hoteis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get hotel by ID
 * GET /api/vagas/hoteis/:id
 */
export const buscarHotelPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = hoteisService.getHotelById(id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Scrape hotel list from AFPESP website
 * GET /api/vagas/hoteis/scrape
 */
export const scrapeHoteis = async (req, res) => {
  try {
    const hoteis = await hoteisService.scrapeHotelList();
    
    res.json({
      success: true,
      count: hoteis.length,
      data: hoteis,
      source: 'AFPESP Website - ddlHoteis dropdown'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
