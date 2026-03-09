require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  openWeatherMap: {
    apiKey: process.env.OPENWEATHER_API_KEY,
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  auth0: {
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  },
  cache: {
    weatherTTL: 300, // 5 minutes in seconds
    processedTTL: 300,
  },
};
