require("dotenv").config();
const express = require("express");

const connectDB = require("./db/connect");
const notFoundMiddleware = require("./middlewares/not-found-middleware");
const errorHandlerMiddleware = require("./middlewares/error-handler-middleware");

const app = express();

app.use(express.json());

app.get("/api/v1/orders", (req, res) => {
  res.send("Hello Mustapha");
});

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
