const { StatusCodes } = require("http-status-codes");

const { BadRequestError, NotFoundError } = require("../errors");
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
    if (fieldsList.includes("createdBy")) {
      throw new BadRequestError(
        "createdBy cannot be among the selected fields"
      );
    }
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

const getTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;

  const task = await Task.findOne({ _id: taskId, createdBy: userId });

  if (!task) {
    throw new NotFoundError(`No task with id ${taskId}`);
  }

  res.status(StatusCodes.OK).json(task);
};

const createtask = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const task = await Task.create(req.body);
  res.status(StatusCodes.CREATED).json(task);
};

const updateTask = async (req, res) => {
  const {
    body: { name },
    user: { userId },
    params: { id: taskId },
  } = req;

  if (!name) {
    throw new BadRequestError("Name field cannot be empty");
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new NotFoundError(`No task with id ${taskId}`);
  }

  res.status(StatusCodes.OK).json({ task });
};

const deleteTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;

  const task = await Task.findOneAndRemove({ _id: taskId, createdBy: userId });

  if (!task) {
    throw new NotFoundError(`No task with id ${taskId}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = { getAllTasks, getTask, createtask, updateTask, deleteTask };
