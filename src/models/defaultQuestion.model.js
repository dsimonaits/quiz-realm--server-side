const db = require("../db/db-connection");

const query = db.query;

class DefaultQuestionModel {
  tableName = "default_questions";

  getQuestions = async () => {
    const sql = `SELECT * FROM  ${this.tableName}`;

    const result = await query(sql);

    console.log(result);

    return result;
  };

  insertQuestion = async (question) => {
    const {
      category,
      topic,
      question: questionText,
      answers: { answer, fakeAnswer1, fakeAnswer2, fakeAnswer3 },
    } = question;

    const sql = `INSERT INTO ${this.tableName} (category, topic, question, answers)
                 VALUES ($1, $2, $3, $4) RETURNING id`;

    const result = await query(sql, [
      category,
      topic,
      questionText,
      JSON.stringify({ answer, fakeAnswer1, fakeAnswer2, fakeAnswer3 }),
    ]);
    console.log(result);
    return result[0].id;
  };

  insertQuestions = async (questions) => {
    const insertedIds = [];

    if (Array.isArray(questions)) {
      for (const question of questions) {
        const insertedId = await this.insertQuestion(question);
        insertedIds.push(insertedId);
      }

      return insertedIds;
    }

    return this.insertQuestion(questions);
  };
}

module.exports = new DefaultQuestionModel();
