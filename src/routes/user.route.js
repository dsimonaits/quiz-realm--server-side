const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const auth = require("../middleware/auth.middleware");
const Role = require("../utils/userRoles.utils");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createUserSchema,
  updateUserSchema,
  validateLogin,
} = require("../middleware/validators/userValidator.middleware");

router.get("/whoami", auth(), awaitHandlerFactory(userController.currentUser)); // localhost:3000/api/v1/users/whoami
router.post(
  "/",
  createUserSchema,
  awaitHandlerFactory(userController.createUser)
); // localhost:3000/api/v1/users
router.patch(
  "/id/:id",
  auth(Role.Admin),
  updateUserSchema,
  awaitHandlerFactory(userController.updateUser)
); // localhost:3000/api/v1/users/id/1 , using patch for partial update
router.delete(
  "/id/:id",
  auth(Role.Admin),
  awaitHandlerFactory(userController.deleteUser)
); // localhost:3000/api/v1/users/id/1

router.post(
  "/login",
  validateLogin,
  awaitHandlerFactory(userController.userLogin)
); // localhost:3000/api/v1/users/login
module.exports = router;
