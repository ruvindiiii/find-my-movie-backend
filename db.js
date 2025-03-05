const { Pool } = require("pg");

const pool = new Pool({
  user: "ruvi",
  password: "root",
  host: "rivi", // ip address or domain name
  port: 5432, // default Postgres port
  database: "movies",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
