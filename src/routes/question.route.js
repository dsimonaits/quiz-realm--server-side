const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question.controller.js");
const auth = require("../middleware/auth.middleware");
const Role = require("../utils/userRoles.utils");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");
const {
  createDefaultQuestionSchema,
} = require("../middleware/validators/defaultQuestionValidator.middleware.js");

router.get("/", auth(), awaitHandlerFactory(questionController.getQuestions));

router.post(
  "/add-default-question",
  auth(),
  createDefaultQuestionSchema,
  awaitHandlerFactory(questionController.addQuestions)
);

module.exports = router;
