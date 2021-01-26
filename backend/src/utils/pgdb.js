const {Pool} = require("pg");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString});

const query = (queryString, params, callback) => {
  return pool.query(queryString, params, callback);
}

module.exports = {query};