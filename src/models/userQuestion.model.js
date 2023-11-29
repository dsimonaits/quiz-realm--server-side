db = require("../db/db-connection");

const query = db.query;

class UserQuestionModel {
  tableName = "user_questions";

  getUserQuestions = async (id) => {
    const sql = `SELECT * FROM  ${this.tableName} WHERE user_id = ${id}`;

    const result = await query(sql);

    console.log(result);

    return result;
  };

  insertUserQuestion = async (question) => {
    const {
      user_id,
      category,
      topic,
      question: questionText,
      answers: { answer, fakeAnswer1, fakeAnswer2, fakeAnswer3 },
    } = question;

    const sql = `INSERT INTO ${this.tableName} (user_id, category, topic, question, answers)
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`;

    const result = await query(sql, [
      user_id,
      category,
      topic,
      questionText,
      JSON.stringify({ answer, fakeAnswer1, fakeAnswer2, fakeAnswer3 }),
    ]);
    console.log(result);
    return result[0].id;
  };

  insertUserQuestions = async (questions, id) => {
    const insertedIds = [];

    if (Array.isArray(questions)) {
      for (const question of questions) {
        question.user_id = id;
        const insertedId = await this.insertUserQuestion(question);
        insertedIds.push(insertedId);
      }

      return insertedIds;
    }

    questions.user_id = id;

    return this.insertUserQuestion(questions);
  };
}

module.exports = new UserQuestionModel();
