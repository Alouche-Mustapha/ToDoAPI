const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const { UnauthenticatedError } = require("../errors");

const refreshToken = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });

  if (!user) {
    throw new UnauthenticatedError("Invalid credentials , user not found");
  }

  const token = user.createJWT();

  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name }, refreshToken: token });
};

module.exports = { refreshToken };
