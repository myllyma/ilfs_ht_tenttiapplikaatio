const {Pool} = require("pg");

const connectionString = process.env.DATABASE_URL;
let pool;

switch (process.env.NODE_ENV) {
  case "production":
    pool = new Pool({connectionString, ssl: { rejectUnauthorized: false }})
    break;
  case "development":
    pool = new Pool({connectionString})
    break;
  default:
}

const query = (queryString, params, callback) => {
  return pool.query(queryString, params, callback);
}

module.exports = {query};