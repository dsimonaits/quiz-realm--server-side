const db = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");

const query = db.query;

class UserProgressModel {
  tableName = "user_progress";

  create = async (userId) => {
    const defaultProgress = {
      user_id: userId,
      quizzes_played: 0,
      total_correct_answers: 0,
      total_incorrect_answers: 0,
      current_level: 1,
      questions_answered: 0,
      questions_to_next_level: 10,
    };

    const { columnSet, values } = multipleColumnSet(defaultProgress);

    const sql = `INSERT INTO ${this.tableName} (${columnSet}) VALUES (${values
      .map((_, index) => `$${index + 1}`)
      .join(", ")}) RETURNING *`;

    const result = await query(sql, values);

    return result;
  };

  get = async (id) => {
    const sql = `SELECT * FROM ${this.tableName} WHERE user_id = ${id} `;

    const result = await db.query(sql);

    return result;
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
    } SET ${setClauses} WHERE user_id = ${id} RETURNING ${updatedColumns.join(
      ", "
    )}`;

    const result = await db.query(sql, values);

    return result;
  };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE user_id = ${id}`;
    await query(sql);
  };
}

module.exports = new UserProgressModel();
