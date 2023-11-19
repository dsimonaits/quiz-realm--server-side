const db = require("../db/db-connection");

const query = db.query;

class DefaultQuestionModel {
  tableName = "default_questions";

  insertQuestion = async (question) => {
    const {
      category,
      topic,
      question: questionText,
      answers: { answer, fakeAnswer1, fakeAnswer2, fakeAnswer3 },
    } = question;

    const sql = `INSERT INTO ${this.tableName} (category, topic, question, answers)
                 VALUES (?, ?, ?, ?)`;

    const result = await query(sql, [
      category,
      topic,
      questionText,
      JSON.stringify({ answer, fakeAnswer1, fakeAnswer2, fakeAnswer3 }),
    ]);

    return result.insertId; // Return the ID of the inserted question
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
