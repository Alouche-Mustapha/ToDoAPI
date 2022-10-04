const { StatusCodes } = require("http-status-codes");

const { UnauthenticatedError } = require("../errors");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) {
    throw new UnauthenticatedError(
      "Not authorized to access this route , only the administrator can"
    );
  }

  const { name, email, admin, sort, fields } = req.query;
  const queryObject = {};

  if (name) {
    queryObject.name = { $regex: name.trim(), $options: "i" };
  }

  if (email) {
    queryObject.email = { $regex: email.trim(), $options: "i" };
  }

  if (admin) {
    queryObject.isAdmin = admin;
  }

  let result = User.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("name");
  }

  if (fields) {
    let fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  } else {
    result = result.select("-password -__v");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const users = await result;

  res.status(StatusCodes.OK).json({ count: users.length, users });
};

module.exports = { getAllUsers };