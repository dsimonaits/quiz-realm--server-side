const express = require("express");
const router = express.Router();
const userProgressController = require("../controllers/userProgress.controller");
const auth = require("../middleware/auth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

// const {
//     updateUserProgressSchema,
// } = require("../middleware/validators/userProgressValidator.middleware");

router.get(
  "/:id",
  auth(),
  awaitHandlerFactory(userProgressController.getUserProgress)
);

// router.put(
//   "/update",
//   auth(),
//   awaitHandlerFactory(userProgressController.updateUserProgress)
// );

module.exports = router;
