const defaultQuestionModel = require("../models/defaultQuestion.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

class DefaultQuestionController {
  getQuestions = async (req, res, next) => {
    this.checkValidation(req);

    const questions = await defaultQuestionModel.getQuestions();

    res.status(201).json({
      code: 201,
      questions: questions,
    });
  };

  addQuestions = async (req, res, next) => {
    this.checkValidation(req);
    try {
      const questions = req.body;

      const newQuestions = await defaultQuestionModel.insertQuestions(
        questions
      );

      res.json({
        code: 200,
        message: "Questions added successfully",
        data: { questionID: newQuestions },
      });
    } catch (error) {
      console.error(error);
      next(new HttpException(500, "Internal Server Error"));
    }
  };

  checkValidation = (req) => {
    const request = Array.isArray(req.body)
      ? req.body.map((question) => {
          const r = { body: { ...question } };
          return r;
        })
      : req;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      throw new HttpException(400, "Validation failed", errors);
    }
  };
}

module.exports = new DefaultQuestionController();
