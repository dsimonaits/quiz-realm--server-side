const dotenv = require("dotenv");
dotenv.config();

const { Pool } = require("pg");

class DBConnection {
  constructor() {
    const env = process.env.NODE_ENV || "development";
    const config = {
      development: {
        host: process.env.DEV_DB_HOST,
        user: process.env.DEV_DB_USER,
        port: process.env.DEV_DB_PORT,
        database: process.env.DEV_DB_DATABASE,
        password: process.env.DEV_DB_PASSWORD,
        ssl: {
          rejectUnauthorized: false, // Set to false if using self-signed certificates
        },
      },
      production: {
        host: process.env.PROD_DB_HOST,
        user: process.env.PROD_DB_USER,
        port: process.env.PROD_DB_PORT,
        database: process.env.PROD_DB_DATABASE,
        password: process.env.PROD_DB_PASSWORD,
        ssl: {
          rejectUnauthorized: false, // Set to false if using self-signed certificates
        },
      },
    };
    this.db = new Pool(config[env]);
    // Explicitly wait for the connection to be established before calling checkConnection
    this.db.connect((err, client, release) => {
      if (err) {
        console.error("Error establishing database connection:", err.message);
        return;
      }

      console.log("Database connection established");
      release();
      this.checkConnection();
    });
  }

  checkConnection() {
    console.log("Database connection was released");
  }

  query = async (sql, values) => {
    return new Promise((resolve, reject) => {
      // execute will internally call prepare and query
      this.db.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.rows);
      });
    }).catch((err) => {
      // Handle errors
      throw err;
    });
  };
}

const dbConnection = new DBConnection();

module.exports = dbConnection;
