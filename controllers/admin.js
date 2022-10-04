const { StatusCodes } = require("http-status-codes");

const { UnauthenticatedError, NotFoundError } = require("../errors");
const User = require("../models/User");
const Task = require("../models/Task");

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

const getAllTasks = async (req, res) => {
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) {
    throw new UnauthenticatedError(
      "Not authorized to access this route , only the administrator can"
    );
  }

  const { name, completed, createdBy, sort, fields } = req.query;
  const queryObject = {};

  if (name) {
    queryObject.name = { $regex: name.trim(), $options: "i" };
  }

  if (completed) {
    queryObject.completed = completed;
  }

  if (createdBy) {
    queryObject.createdBy = createdBy;
  }

  let result = Task.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  } else {
    result = result.select("-__v");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const tasks = await result;
  res.status(StatusCodes.OK).json({ count: tasks.length, tasks });
};

const getStatistics = async (req, res) => {
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) {
    throw new UnauthenticatedError(
      "Not authorized to access this route , only the administrator can"
    );
  }

  const totalUsers = (await User.find()).length;
  const totalTasks = (await Task.find()).length;

  res.status(StatusCodes.OK).json({ totalTasks, totalUsers });
};

const deleteUser = async (req, res) => {
  const { id: userId } = req.params;
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) {
    throw new UnauthenticatedError(
      "Not authorized to access this route , only the administrator can"
    );
  }

  const user = await User.findOneAndRemove({ _id: userId });

  if (!user) {
    throw new NotFoundError(`No user with id ${userId}`);
  }

  const { deletedCount } = await Task.deleteMany({ createdBy: userId });

  res.status(StatusCodes.OK).send({
    msg: "user successfully deleted and with his tasks",
    relatedTasksDeleted: deletedCount,
  });
};

module.exports = { getAllUsers, getAllTasks, getStatistics, deleteUser };
