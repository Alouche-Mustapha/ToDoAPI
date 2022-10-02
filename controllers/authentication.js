const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError(
      "Invalid credentials , email does not exist"
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError(
      "Invalid credentials , password is incorrect"
    );
  }

  res.status(StatusCodes.OK).json(user);
};

module.exports = { register, login };
