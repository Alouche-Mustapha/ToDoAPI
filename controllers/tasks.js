const { StatusCodes } = require("http-status-codes");

const Task = require("../models/Task");

const getAllTasks = async (req, res) => {
  const { name, completed, sort, fields } = req.query;
  const queryObject = { createdBy: req.user.userId };

  if (name) {
    queryObject.name = { $regex: name.trim(), $options: "i" };
  }

  if (completed) {
    queryObject.completed = completed;
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
    result = result.select("-createdBy -__v");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const tasks = await result;
  res.status(StatusCodes.OK).json({ count: tasks.length, tasks });
};

const createtask = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const task = await Task.create(req.body);
  res.status(StatusCodes.CREATED).json(task);
};

module.exports = { getAllTasks, createtask };
