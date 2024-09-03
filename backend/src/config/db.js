const { Pool } = require("pg");

const cleanCertString = (cert) => {
  return cert
    .replace(/\\n/g, "\n")
    .replace(/(BEGIN|END) CERTIFICATE-----/g, `$1 CERTIFICATE-----\n`);
};
require("dotenv").config();
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
    ca: cleanCertString(process.env.DB_SSL_CA),
  },
});

module.exports = pool;
