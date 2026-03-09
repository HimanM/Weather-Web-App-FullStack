const redis = require('../config/redis');
const config = require('../config');

const WEATHER_PREFIX = 'weather:';
const PROCESSED_PREFIX = 'processed:';

/**
 * Get cached raw weather data for a city.
 */
async function getCachedWeather(cityCode) {
  try {
    const data = await redis.get(`${WEATHER_PREFIX}${cityCode}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Set cached raw weather data for a city.
 */
async function setCachedWeather(cityCode, data) {
  try {
    await redis.set(
      `${WEATHER_PREFIX}${cityCode}`,
      JSON.stringify(data),
      'EX',
      config.cache.weatherTTL
    );
  } catch (err) {
    console.error('Redis set error:', err.message);
  }
}

/**
 * Get cached processed results (all cities ranked).
 */
async function getCachedProcessed() {
  try {
    const data = await redis.get(`${PROCESSED_PREFIX}all`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Set cached processed results.
 */
async function setCachedProcessed(data) {
  try {
    await redis.set(
      `${PROCESSED_PREFIX}all`,
      JSON.stringify(data),
      'EX',
      config.cache.processedTTL
    );
  } catch (err) {
    console.error('Redis set error:', err.message);
  }
}

/**
 * Return debug info about cache keys: TTL, HIT/MISS for each city.
 */
async function getCacheStatus(cityCodes) {
  const results = [];

  for (const code of cityCodes) {
    const key = `${WEATHER_PREFIX}${code}`;
    const ttl = await redis.ttl(key);
    results.push({
      key,
      status: ttl > 0 ? 'HIT' : 'MISS',
      ttl: ttl > 0 ? ttl : 0,
    });
  }

  // Processed cache
  const processedKey = `${PROCESSED_PREFIX}all`;
  const processedTTL = await redis.ttl(processedKey);
  results.push({
    key: processedKey,
    status: processedTTL > 0 ? 'HIT' : 'MISS',
    ttl: processedTTL > 0 ? processedTTL : 0,
  });

  return results;
}

module.exports = {
  getCachedWeather,
  setCachedWeather,
  getCachedProcessed,
  setCachedProcessed,
  getCacheStatus,
};
