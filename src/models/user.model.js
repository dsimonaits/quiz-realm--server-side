const db = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
const Role = require("../utils/userRoles.utils");
const userProgressModel = require("../models/userProgress.model");
const HttpException = require("../utils/HttpException.utils");

const query = db.query;

class UserModel {
  tableName = "user";

  find = async (params = {}) => {
    let sql = `SELECT * FROM ${this.tableName}`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnSet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

    const result = await query(sql, [...values]);

    // return back the first row (user)
    return result[0];
  };

  create = async ({
    username,
    password,
    first_name,
    last_name,
    email,
    role = Role.SuperUser,
    age = 0,
  }) => {
    const sql = `INSERT INTO ${this.tableName}
        (username, password, first_name, last_name, email, role, age) VALUES (?,?,?,?,?,?,?)`;

    const result = await query(sql, [
      username,
      password,
      first_name,
      last_name,
      email,
      role,
      age,
    ]);

    const userId = result.insertId;

    const userProgress = await userProgressModel.createUserProgress(userId);

    const userAffectedRows = result ? result.affectedRows : 0;

    const newUserData = {
      user: { ...userAffectedRows },
      userProgress: { userProgress },
    };

    if (!userProgress && !userAffectedRows) {
      throw new HttpException(500, "Something went wrong");
    }

    return newUserData;
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE user SET ${columnSet} WHERE id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };
}

module.exports = new UserModel();
