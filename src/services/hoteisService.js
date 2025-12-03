/**
 * Service for hotel data
 */

import puppeteer from 'puppeteer';

/**
 * List of available hotels
 * Based on AFPESP union hotel system
 * Last updated: 2025-12-03 (via /api/vagas/hoteis/scrape)
 */
const hotels = [
  {
    id: 1,
    hotelId: '-1',
    name: 'Todas',
    type: 'All',
    description: 'All hotels'
  },
  {
    id: 2,
    hotelId: '4007',
    name: 'Amparo',
    type: 'Hotel',
    description: 'Hotel Amparo'
  },
  {
    id: 3,
    hotelId: '4003',
    name: 'Appenzell',
    type: 'Hotel',
    description: 'Hotel Appenzell'
  },
  {
    id: 4,
    hotelId: '4001',
    name: 'Areado',
    type: 'Hotel',
    description: 'Hotel Areado'
  },
  {
    id: 5,
    hotelId: '4002',
    name: 'Avaré',
    type: 'Hotel',
    description: 'Hotel Avaré'
  },
  {
    id: 6,
    hotelId: '4024',
    name: 'Boraceia',
    type: 'Hotel',
    description: 'Hotel Boraceia'
  },
  {
    id: 7,
    hotelId: '4004',
    name: 'Campos do Jordão',
    type: 'Hotel',
    description: 'Hotel Campos do Jordão'
  },
  {
    id: 8,
    hotelId: '4013',
    name: 'Caraguatatuba',
    type: 'Hotel',
    description: 'Hotel Caraguatatuba'
  },
  {
    id: 9,
    hotelId: '4023',
    name: 'Fazenda Ibirá',
    type: 'Hotel',
    description: 'Hotel Fazenda Ibirá'
  },
  {
    id: 10,
    hotelId: '4014',
    name: 'Guarujá',
    type: 'Hotel',
    description: 'Hotel Guarujá'
  },
  {
    id: 11,
    hotelId: '4015',
    name: 'Itanhaém',
    type: 'Hotel',
    description: 'Hotel Itanhaém'
  },
  {
    id: 12,
    hotelId: '4008',
    name: 'Lindoia',
    type: 'Hotel',
    description: 'Hotel Lindoia'
  },
  {
    id: 13,
    hotelId: '4018',
    name: 'Maresias',
    type: 'Hotel',
    description: 'Hotel Maresias'
  },
  {
    id: 14,
    hotelId: '4005',
    name: 'Monte Verde',
    type: 'Hotel',
    description: 'Hotel Monte Verde'
  },
  {
    id: 15,
    hotelId: '4021',
    name: 'Peruíbe I',
    type: 'Hotel',
    description: 'Hotel Peruíbe I'
  },
  {
    id: 16,
    hotelId: '4022',
    name: 'Peruíbe II',
    type: 'Hotel',
    description: 'Hotel Peruíbe II'
  },
  {
    id: 17,
    hotelId: '4006',
    name: 'Poços de Caldas',
    type: 'Hotel',
    description: 'Hotel Poços de Caldas'
  },
  {
    id: 18,
    hotelId: '4020',
    name: 'Saha',
    type: 'Hotel',
    description: 'Hotel Saha'
  },
  {
    id: 19,
    hotelId: '4019',
    name: 'São Lourenço',
    type: 'Hotel',
    description: 'Hotel São Lourenço'
  },
  {
    id: 20,
    hotelId: '4011',
    name: 'São Pedro',
    type: 'Hotel',
    description: 'Hotel São Pedro'
  },
  {
    id: 21,
    hotelId: '4009',
    name: 'Serra Negra',
    type: 'Hotel',
    description: 'Hotel Serra Negra'
  },
  {
    id: 22,
    hotelId: '4010',
    name: 'Socorro',
    type: 'Hotel',
    description: 'Hotel Socorro'
  },
  {
    id: 23,
    hotelId: '4012',
    name: 'Termas de Ibirá',
    type: 'Hotel',
    description: 'Hotel Termas de Ibirá'
  },
  {
    id: 24,
    hotelId: '4016',
    name: 'Ubatuba',
    type: 'Hotel',
    description: 'Hotel Ubatuba'
  },
  {
    id: 25,
    hotelId: '4017',
    name: 'Unidade Capital',
    type: 'Hotel',
    description: 'Unidade Capital'
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
