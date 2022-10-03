const express = require("express");
const router = express.Router();

const { getAllTasks, createtask } = require("../controllers/tasks");

router.route("/").post(createtask).get(getAllTasks);

module.exports = router;
