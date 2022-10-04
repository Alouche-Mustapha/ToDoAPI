require("dotenv").config();
require("express-async-errors");
const express = require("express");

const connectDB = require("./db/connect");

const notFoundMiddleware = require("./middlewares/not-found-middleware");
const errorHandlerMiddleware = require("./middlewares/error-handler-middleware");
const authenticatioMiddleware = require("./middlewares/authentication-middleware");

const authenticationRouter = require("./routes/authentication");
const tasksRouter = require("./routes/tasks");
const refreshTokenRouter = require("./routes/token");

const app = express();

app.use(express.json());

app.use("/api/v1/authentication", authenticationRouter);
app.use("/api/v1/tasks", authenticatioMiddleware, tasksRouter);
app.use("/api/v1/refreshToken", authenticatioMiddleware, refreshTokenRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`Server is listening on port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
