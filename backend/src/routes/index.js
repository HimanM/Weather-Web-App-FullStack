const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const checkJwt = require('../middleware/auth');

// All routes require authentication
router.get('/weather', checkJwt, weatherController.getWeather);
router.get('/weather/:cityCode', checkJwt, weatherController.getWeatherByCity);
router.get('/cache-status', checkJwt, weatherController.getCacheStatus);

// Health check (no auth required)
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
