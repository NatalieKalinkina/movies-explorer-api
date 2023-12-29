const { rateLimit } = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 1000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

module.exports = { rateLimiter };
