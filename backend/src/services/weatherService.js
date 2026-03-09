const axios = require('axios');
const config = require('../config');
const cities = require('../data/cities.json');
const { computeComfortIndex } = require('../utils/comfortIndex');
const cacheService = require('./cacheService');

/**
 * Fetch weather data for a single city (with cache).
 */
async function fetchWeatherForCity(cityCode) {
  // Check cache first
  const cached = await cacheService.getCachedWeather(cityCode);
  if (cached) return cached;

  const url = `${config.openWeatherMap.baseUrl}?id=${encodeURIComponent(cityCode)}&appid=${encodeURIComponent(config.openWeatherMap.apiKey)}`;
  const { data } = await axios.get(url, { timeout: 10000 });

  // Store in cache
  await cacheService.setCachedWeather(cityCode, data);
  return data;
}

/**
 * Fetch and process weather for all cities.
 * Returns sorted array (most comfortable first).
 */
async function getAllCityWeather() {
  // Check processed cache
  const cachedProcessed = await cacheService.getCachedProcessed();
  if (cachedProcessed) return cachedProcessed;

  const results = [];

  // Fetch all cities in parallel (batched)
  const promises = cities.map(async (city) => {
    try {
      const weather = await fetchWeatherForCity(city.CityCode);
      const comfortScore = computeComfortIndex(weather);
      const tempC = weather.main.temp - 273.15;

      return {
        cityCode: city.CityCode,
        cityName: weather.name || city.CityName,
        country: weather.sys?.country || '',
        weatherDescription: weather.weather?.[0]?.description || 'N/A',
        weatherIcon: weather.weather?.[0]?.icon || '',
        weatherMain: weather.weather?.[0]?.main || '',
        temperature: Math.round(tempC * 10) / 10,
        feelsLike: Math.round((weather.main.feels_like - 273.15) * 10) / 10,
        tempMin: Math.round((weather.main.temp_min - 273.15) * 10) / 10,
        tempMax: Math.round((weather.main.temp_max - 273.15) * 10) / 10,
        humidity: weather.main.humidity,
        pressure: weather.main.pressure,
        windSpeed: weather.wind.speed,
        windDeg: weather.wind.deg,
        cloudiness: weather.clouds.all,
        visibility: weather.visibility || 10000,
        comfortScore,
        dt: weather.dt,
        timezone: weather.timezone,
        coord: weather.coord,
      };
    } catch (err) {
      console.error(`Failed to fetch weather for ${city.CityName} (${city.CityCode}):`, err.message);
      return null;
    }
  });

  const settled = await Promise.all(promises);
  settled.forEach((r) => { if (r) results.push(r); });

  // Sort by comfort score descending (most comfortable first)
  results.sort((a, b) => b.comfortScore - a.comfortScore);

  // Assign rank
  results.forEach((city, idx) => { city.rank = idx + 1; });

  // Cache processed results
  await cacheService.setCachedProcessed(results);

  return results;
}

/**
 * Return city codes array.
 */
function getCityCodes() {
  return cities.map((c) => c.CityCode);
}

module.exports = {
  getAllCityWeather,
  fetchWeatherForCity,
  getCityCodes,
};
