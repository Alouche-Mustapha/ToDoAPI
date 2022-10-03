const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../errors");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send("Something went wrong try again later");
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
};

module.exports = errorHandlerMiddleware;
