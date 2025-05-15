// redisClient.js
const redis = require("redis");

const client = redis.createClient({
  port: 6379,
  password: "1111",
});

module.exports = client;
