const express = require("express");
const router = express.Router();
const userProgressController = require("../controllers/userProgress.controller");
const auth = require("../middleware/auth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

// const {
//   updateUserProgressSchema,
// } = require("../middleware/validators/userProgressValidator.middleware");

router.post(
  "/id/:id",
  auth(),
  awaitHandlerFactory(userProgressController.createUserProgress)
);
router.get(
  "/id/:id",
  auth(),
  awaitHandlerFactory(userProgressController.getUserProgress)
);

router.patch(
  "/id/:id",
  auth(),
  // updateUserProgressSchema,
  awaitHandlerFactory(userProgressController.updateUserProgress)
);
router.delete(
  "/id/:id",
  auth(),
  awaitHandlerFactory(userProgressController.deleteUserProgress)
);

module.exports = router;
