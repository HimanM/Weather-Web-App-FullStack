const Redis = require('ioredis');
const config = require('./index');

let redis;

try {
  redis = new Redis(config.redis.url, {
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    lazyConnect: true,
  });

  redis.on('error', (err) => {
    console.error('Redis connection error:', err.message);
  });

  redis.on('connect', () => {
    console.log('Connected to Redis');
  });
} catch (err) {
  console.error('Failed to initialize Redis:', err.message);
}

module.exports = redis;
