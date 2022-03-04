const { config } = require("dotenv");
config();

const COINBASE_API_KEY = '20b93c58-d3b2-4c44-907b-07ad93f294ac';
//process.env.COINBASE_API_KEY;

// process.env.COINBASE_API_KEY;
const COINBASE_WEBHOOK_SECRET = 'daa36526-62c5-419f-9cef-dd83be22bd0f';
//process.env.COINBASE_WEBHOOK_SECRET;

//process.env.COINBASE_WEBHOOK_SECRET;
const DOMAIN = 'http://localhost:3001';
//process.env.DOMAIN;
const DB = 'mongodb+srv://mongoman:EdR3QwG1E3z9Z3cT@cluster0.48she.mongodb.net/coinbase?retryWrites=true&w=majority';
//process.env.DB;
module.exports = {
  COINBASE_API_KEY,
  COINBASE_WEBHOOK_SECRET,
  DB,
  DOMAIN
};
