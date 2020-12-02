const {Pool} = require("pg");
const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`
const pool = new Pool({connectionString});

const query = (queryString, params, callback) => {
  return pool.query(queryString, params, callback);
}

module.exports = {query};