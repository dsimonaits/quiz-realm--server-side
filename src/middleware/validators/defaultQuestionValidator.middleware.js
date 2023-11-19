const { body } = require("express-validator");

exports.createDefaultQuestionSchema = [
  body("category")
    .exists()
    .withMessage("Category is required")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long"),
  body("topic")
    .exists()
    .withMessage("Topic is required")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long"),
  body("question")
    .exists()
    .withMessage("Question is required")
    .isLength({ min: 10 })
    .withMessage("Must be at least 10 chars long"),
  body("answers")
    .exists()
    .withMessage("Answers are required")
    .isObject({ nullable: true })
    .withMessage("Answers must be an object")
    .custom((value, { req }) => {
      if (
        !value.answer ||
        !value.fakeAnswer1 ||
        !value.fakeAnswer2 ||
        !value.fakeAnswer3
      ) {
        throw new Error("Invalid structure for answers");
      }

      return true;
    }),
];
