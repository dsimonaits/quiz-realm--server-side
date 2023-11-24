const dotenv = require("dotenv");
dotenv.config();

const { Pool } = require("pg");

class DBConnection {
  constructor() {
    const env = process.env.NODE_ENV || "development";
    const config = {
      development: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        ssl: {
          rejectUnauthorized: false, // Set to false if using self-signed certificates
        },
      },
      production: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
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
