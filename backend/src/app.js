const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const routes = require('./routes');
const redis = require('./config/redis');

const app = express();

// Security & utility middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());

// API routes
app.use('/api', routes);

// Global error handler
app.use((err, req, res, _next) => {
  if (err.status === 401) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or missing token' });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

async function start() {
  try {
    await redis.connect();
    console.log('Redis connected');
  } catch (err) {
    console.warn('Redis unavailable – caching disabled:', err.message);
  }

  app.listen(config.port, () => {
    console.log(`Backend server running on port ${config.port}`);
  });
}

start();

module.exports = app;
