require('dotenv').config();
const { Pool } = require('pg');

//Connect to PostgreeDB

//Credentials
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB = process.env.DB;
const DB_PASSWORD = process.env.DB_PASSWORD;

const pool = new Pool({
 host: `${DB_HOST}`,
 user: `${DB_USER}`,
 database: `${DB}`,
 password: `${DB_PASSWORD}`,
 define: {
  timestamps: true,
  underscored: true,
 },
});

try {
 pool.on('connect', () => console.log('Connection established with the database'));
} catch (error) {
 console.log(error);
};

module.exports = {
 query: (text, params) => pool.query(text, params)
};