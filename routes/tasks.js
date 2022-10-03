const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTask,
  createtask,
  updateTask,
  deleteTask,
} = require("../controllers/tasks");

router.route("/").post(createtask).get(getAllTasks);
router.route("/:id").get(getTask).patch(updateTask).delete(deleteTask);

module.exports = router;
