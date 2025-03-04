const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost", // ip address or domain name
  port: 5432, // default Postgres port
  database: "find-my-movie",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
