const db = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");

const query = db.query;

class UserProgressModel {
  tableName = "user_progress";

  createUserProgress = async (userId) => {
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

    const sql = `INSERT INTO ${this.tableName} SET ${columnSet}`;

    const result = await db.query(sql, [...values]);

    return result;
  };

  getUserProgress = async (id) => {
    const sql = `SELECT * FROM ${this.tableName} WHERE user_id = ${id} `;

    const result = await db.query(sql, [id]);

    return result;
  };
}

module.exports = new UserProgressModel();
