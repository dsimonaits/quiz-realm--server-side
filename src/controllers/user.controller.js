const UserModel = require("../models/user.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const userProgressModel = require("../models/userProgress.model");
dotenv.config();

const createToken = (id) => {
  const secretKey = process.env.SECRET_JWT || "";
  const token = jwt.sign({ user_id: id.toString() }, secretKey, {
    expiresIn: "24h",
  });

  return token;
};

class UserController {
  createUser = async (req, res, next) => {
    this.checkValidation(req);

    await this.hashPassword(req);

    const result = await UserModel.create(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    userProgressModel.create(result.id);

    const token = createToken(result.id);

    const { password, ...userWithoutPassword } = result;

    res.status(201).json({
      code: 201,
      message: "User was created successfully",
      user: userWithoutPassword,
      token,
    });
  };

  updateUser = async (req, res, next) => {
    this.checkValidation(req);

    await this.hashPassword(req);

    const { confirm_password, ...restOfUpdates } = req.body;

    const result = await UserModel.update(restOfUpdates, req.params.id);

    if (!result) {
      throw new HttpException(404, "Something went wrong");
    }

    console.log(result);

    res.status(200).json(result);
  };

  deleteUser = async (req, res, next) => {
    const result = await UserModel.delete(req.params.id);

    res.status(200).json({ message: "User has been deleted", result });
  };

  userLogin = async (req, res, next) => {
    this.checkValidation(req);
    const { email, password: pass } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new HttpException(401, "Unable to login, user not found!");
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new HttpException(401, "Incorrect password!");
    }

    // user matched!
    const token = createToken(user.id);

    const { password, ...userWithoutPassword } = user;

    res.send({ user: userWithoutPassword, token });
  };

  currentUser = async (req, res, next) => {
    const { id } = req.currentUser;

    const user = await UserModel.findOne({ id });

    const { password, ...userWithoutPassword } = user;

    const token = createToken(user.id);

    res.status(200).json({ user: userWithoutPassword, token });
  };

  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(400, "Validation failed", errors);
    }
  };

  // hash password if it exists
  hashPassword = async (req) => {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 8);
    }
  };
}

module.exports = new UserController();
