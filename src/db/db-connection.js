const dotenv = require("dotenv");
dotenv.config();

const mysql2 = require("mysql2");

class DBConnection {
  constructor() {
    this.db = mysql2.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
    });

    // Explicitly wait for the connection to be established before calling checkConnection
    this.db.getConnection((err, connection) => {
      if (err) {
        console.error("Error establishing database connection:", err.message);
        return;
      }

      console.log("Database connection established");
      connection.release(); // Release the connection after establishing it
      this.checkConnection();
    });
  }

  checkConnection() {
    console.log("Database connection was released");
    // ... rest of the checkConnection method
  }

  query = async (sql, values) => {
    return new Promise((resolve, reject) => {
      const callback = (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      };
      // execute will internally call prepare and query
      this.db.execute(sql, values, callback);
    }).catch((err) => {
      const mysqlErrorList = Object.keys(HttpStatusCodes);
      // convert mysql errors which in the mysqlErrorList list to http status code
      err.status = mysqlErrorList.includes(err.code)
        ? HttpStatusCodes[err.code]
        : err.status;

      throw err;
    });
  };
}

// like ENUM
const HttpStatusCodes = Object.freeze({
  ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: 422,
  ER_DUP_ENTRY: 409,
});

const dbConnection = new DBConnection();

module.exports = dbConnection;
