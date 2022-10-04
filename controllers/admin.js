const { StatusCodes } = require("http-status-codes");

const {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");
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
    if (fieldsList.includes("password")) {
      throw new BadRequestError("Password cannot be among the selected fields");
    }
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

const getUser = async (req, res) => {
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) {
    throw new UnauthenticatedError(
      "Not authorized to access this route , only the administrator can"
    );
  }

  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId }).select("-password -__v");

  if (!user) {
    throw new NotFoundError(`No user with id ${userId}`);
  }

  res.status(StatusCodes.OK).json(user);
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
  const { isAdmin } = req.user;

  if (!isAdmin) {
    throw new UnauthenticatedError(
      "Not authorized to access this route , only the administrator can"
    );
  }

  const userToCheck = await User.findOne({ _id: userId });
  if (!userToCheck) {
    throw new NotFoundError(`No user with id ${userId}`);
  }

  if (userToCheck.isAdmin) {
    throw new BadRequestError(
      "User cannot be deleted it is an administrator account"
    );
  }

  await User.deleteOne({ _id: userId });

  const { deletedCount } = await Task.deleteMany({ createdBy: userId });

  res.status(StatusCodes.OK).send({
    msg: "user successfully deleted and with his tasks",
    relatedTasksDeleted: deletedCount,
  });
};

const updateUser = async (req, res) => {
  const {
    body: { name, email },
    user: { isAdmin },
    params: { id: userId },
  } = req;

  if (!isAdmin) {
    throw new UnauthenticatedError(
      "Not authorized to access this route , only the administrator can"
    );
  }

  if (!name) {
    throw new BadRequestError("Name field cannot be empty");
  }

  if (!email) {
    throw new BadRequestError("Email field cannot be empty");
  }

  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  }).select("-password -__v");

  if (!user) {
    throw new NotFoundError(`No user with id ${userId}`);
  }

  res.status(StatusCodes.OK).json(user);
};

module.exports = {
  getAllUsers,
  getAllTasks,
  getUser,
  getStatistics,
  deleteUser,
  updateUser,
};
