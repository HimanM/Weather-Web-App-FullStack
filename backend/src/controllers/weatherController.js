const weatherService = require('../services/weatherService');
const cacheService = require('../services/cacheService');

/**
 * GET /api/weather
 * Returns all cities with weather data, comfort score, and ranking.
 */
async function getWeather(req, res) {
  try {
    const data = await weatherService.getAllCityWeather();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('Error fetching weather:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch weather data' });
  }
}

/**
 * GET /api/weather/:cityCode
 * Returns weather for a single city.
 */
async function getWeatherByCity(req, res) {
  try {
    const { cityCode } = req.params;
    const allData = await weatherService.getAllCityWeather();
    const city = allData.find((c) => c.cityCode === cityCode);
    if (!city) {
      return res.status(404).json({ success: false, error: 'City not found' });
    }
    res.json({ success: true, data: city });
  } catch (err) {
    console.error('Error fetching city weather:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch weather data' });
  }
}

/**
 * GET /api/cache-status
 * Debug endpoint showing cache HIT/MISS for each key.
 */
async function getCacheStatus(req, res) {
  try {
    const cityCodes = weatherService.getCityCodes();
    const status = await cacheService.getCacheStatus(cityCodes);
    res.json({ success: true, data: status });
  } catch (err) {
    console.error('Error getting cache status:', err.message);
    res.status(500).json({ success: false, error: 'Failed to retrieve cache status' });
  }
}

module.exports = {
  getWeather,
  getWeatherByCity,
  getCacheStatus,
};
