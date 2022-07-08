// Lightweight Postgres DB Connection

const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.DATABASE,
    password: process.env.PG_PASSWORD,
    port: 5432,
    idleTimeoutMillis: 100,
    idle_in_transaction_session_timeout: 100
});

module.exports = {
    query: (queryText, params, callback) => {
        return pool.query(queryText, params, callback);
    }
}
