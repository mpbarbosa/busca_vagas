/**
 * Service for hotel data
 */

import puppeteer from 'puppeteer';

/**
 * List of available hotels
 * Based on AFPESP union hotel system
 */
const hotels = [
  {
    id: 1,
    name: 'BLUES Appenzell',
    location: 'Appenzell',
    type: 'Hotel',
    description: 'Hotel BLUES Appenzell'
  },
  {
    id: 2,
    name: 'Homem de Melo',
    location: 'Homem de Melo',
    type: 'Location',
    description: 'Unidade Homem de Melo'
  },
  {
    id: 3,
    name: 'Perdizes',
    location: 'Perdizes',
    type: 'Location',
    description: 'Unidade Perdizes'
  },
  {
    id: 4,
    name: 'Sumaré',
    location: 'Sumaré',
    type: 'Location',
    description: 'Unidade Sumaré'
  }
];

/**
 * Get all hotels
 * @returns {Array} List of all hotels
 */
export const getAllHotels = () => {
  return hotels;
};

/**
 * Get hotel by ID
 * @param {number} id - Hotel ID
 * @returns {Object|null} Hotel object or null if not found
 */
export const getHotelById = (id) => {
  return hotels.find(hotel => hotel.id === parseInt(id)) || null;
};

/**
 * Get hotel by name
 * @param {string} name - Hotel name
 * @returns {Object|null} Hotel object or null if not found
 */
export const getHotelByName = (name) => {
  return hotels.find(hotel => 
    hotel.name.toLowerCase() === name.toLowerCase()
  ) || null;
};

/**
 * Scrape hotel list from AFPESP website dropdown
 * @returns {Promise<Array>} List of hotels from the website
 */
export const scrapeHotelList = async () => {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: '/usr/bin/google-chrome-stable',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
      defaultViewport: {
        width: 1280,
        height: 800
      }
    });

    const page = await browser.newPage();
    await page.goto('https://associadoh.afpesp.org.br/Servicos/Reservas/Vagas-disponiveis.aspx', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    const hotelOptions = await page.evaluate(() => {
      // eslint-disable-next-line no-undef
      const dropdown = document.getElementById('ddlHoteis');
      if (!dropdown) {
        throw new Error('Dropdown element ddlHoteis not found');
      }

      const options = Array.from(dropdown.options);
      return options.map((option, index) => ({
        id: index + 1,
        hotelId: option.value,
        name: option.text.trim(),
        type: option.value === '' || option.value === '-1' ? 'All' : 'Hotel'
      }));
    });

    await browser.close();
    return hotelOptions;

  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw new Error(`Failed to scrape hotel list: ${error.message}`);
  }
};
