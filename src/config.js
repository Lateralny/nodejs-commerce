const { config } = require("dotenv");
config();

const COINBASE_API_KEY = '1234ae9d-0ca4-40f6-b863-8e9e1b1f3590';
// process.env.COINBASE_API_KEY;
const COINBASE_WEBHOOK_SECRET = 'e1a657b3-ba9f-4da4-9007-a4b4a0ac9feb';
//process.env.COINBASE_WEBHOOK_SECRET;
const DOMAIN = 'http://localhost:3001';
//process.env.DOMAIN;

module.exports = {
  COINBASE_API_KEY,
  COINBASE_WEBHOOK_SECRET,
  DOMAIN
};
