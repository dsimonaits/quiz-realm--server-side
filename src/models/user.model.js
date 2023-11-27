const db = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
const Role = require("../utils/userRoles.utils");
const userProgressModel = require("../models/userProgress.model");
const HttpException = require("../utils/HttpException.utils");

const query = db.query;

class UserModel {
  tableName = "users";

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet} = $1`;

    const result = await query(sql, values);

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
  }) => {
    const userExist = await this.findOne({ email });

    if (userExist) {
      throw new HttpException(401, "User already exists");
    }

    const sql = `INSERT INTO ${this.tableName}
        (username, password, first_name, last_name, email, role) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;

    const result = await query(sql, [
      username,
      password,
      first_name,
      last_name,
      email,
      role,
    ]);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    return result[0];
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const setClauses = columnSet
      .split(", ")
      .map((col, index) => `${col} = $${index + 1}`)
      .join(", ");

    const updatedColumns = columnSet.split(", ").map((col) => col.trim());

    const sql = `UPDATE ${
      this.tableName
    } SET ${setClauses} WHERE id = ${id} RETURNING ${updatedColumns.join(
      ", "
    )}`;

    const result = await query(sql, [...values]);

    return result[0];
  };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE id = ${id} RETURNING ${id}`;
    const result = await query(sql);

    return result[0];
  };
}

module.exports = new UserModel();
