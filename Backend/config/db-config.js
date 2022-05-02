const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
   user: process.env.DB_CONFIG_USER,
   password: process.env.DB_CONFIG_PASSWORD,
   host: process.env.DB_CONFIG_HOST,
   port: process.env.DB_CONFIG_PORT,
   database: process.env.DB_CONFIG_DATABASE,
});

module.exports = pool;
