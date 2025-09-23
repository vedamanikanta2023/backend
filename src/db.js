const mysql = require("mysql2");
const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");

// import mysql from 'mysql2';
// import dotenv from 'dotenv';

dotenv.config();


const sequelize = new Sequelize(
  process.env.DB_NAME,     // database name
  process.env.DB_USER,     // db username
  process.env.DB_PASSWORD, // db password
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false, // disable SQL logs in console
  }
);

sequelize.authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Error connecting database:", err));

module.exports = sequelize;