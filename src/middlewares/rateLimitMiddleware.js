const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per window for auth routes
  message: { message: "Too many requests, please try again later." },
});

module.exports = {
  authLimiter,
};

