const UserProgressModel = require("../models/userProgress.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");

class UserProgressController {
  createUserProgress = async (req, res, next) => {
    const { id } = req.params;

    let userProgressExists = await UserProgressModel.get(id);

    if (userProgressExists.length > 0) {
      throw new HttpException(404, "UserProgress already exists");
    }

    let userProgress = await UserProgressModel.create(id);

    res.status(201).json(userProgress[0]);
  };
  getUserProgress = async (req, res, next) => {
    const { id } = req.params;

    let userProgress = await UserProgressModel.get(id);

    if (!userProgress) {
      throw new HttpException(404, "UserProgress not found");
    }

    res.status(200).json(userProgress[0]);
  };

  updateUserProgress = async (req, res, next) => {
    const { id } = req.params;

    let newUserProgress = await UserProgressModel.updates(req.body, id);

    if (!newUserProgress) {
      throw new HttpException(404, "UserProgress not found");
    }

    res.status(201).json(newUserProgress[0]);
  };

  deleteUserProgress = async (req, res, next) => {
    const { id } = req.params;

    await UserProgressModel.delete(id);

    res.status(200).json({ message: "User Progress deleted successfully" });
  };
}

module.exports = new UserProgressController();
