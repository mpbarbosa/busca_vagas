/**
 * Validation Middleware
 * Validates input data for API requests
 * 
 * @module middlewares/validation
 * @version 1.4.0
 * @since 1.0.0
 */

import { validateBookingDates, getHolidayPackageInfo } from '../utils/bookingRules.js';

export const validarVaga = (req, res, next) => {
  const { titulo, hotel, sindicato } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: 'Título é obrigatório' });
  }

  if (!hotel) {
    return res.status(400).json({ error: 'Hotel é obrigatório' });
  }

  if (!sindicato) {
    return res.status(400).json({ error: 'Sindicato é obrigatório' });
  }

  next();
};

/**
 * Validate booking dates according to holiday package rules (BR-18, BR-19)
 * 
 * This middleware validates that:
 * - Christmas package (Dec 22-27) requires exact dates
 * - New Year package (Dec 27-Jan 2) requires exact dates
 * - No partial or custom dates during holiday periods
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const validateBookingRules = (req, res, next) => {
  const { checkin, checkout } = req.query;
  
  // Skip validation if dates are not provided (will be caught by other validation)
  if (!checkin || !checkout) {
    return next();
  }
  
  // Validate booking dates
  const validation = validateBookingDates(checkin, checkout);
  
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: validation.error,
      code: validation.code,
      package: validation.package,
      requiredDates: validation.requiredDates,
      providedDates: {
        checkin,
        checkout
      },
      documentation: {
        businessRules: ['BR-18', 'BR-19'],
        reference: 'See docs/api/FUNCTIONAL_REQUIREMENTS.md#631-booking-rules'
      }
    });
  }
  
  // Add holiday package info to request if applicable
  const packageInfo = getHolidayPackageInfo(checkin, checkout);
  if (packageInfo) {
    req.holidayPackage = packageInfo;
  }
  
  next();
};
