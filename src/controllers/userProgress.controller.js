const UserProgressModel = require("../models/userProgress.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");

class UserProgressController {
  getUserProgress = async (req, res, next) => {
    const { id } = req.params;

    let userProgress = await UserProgressModel.getUserProgress(id);

    if (!userProgress) {
      throw new HttpException(404, "UserProgress not found");
    }

    res.send(userProgress);
  };
}

module.exports = new UserProgressController();
