const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllTasks,
  getStatistics,
  deleteUser,
} = require("../controllers/admin");

router.route("/users").get(getAllUsers);
router.route("/users/:id").delete(deleteUser);
router.get("/tasks", getAllTasks);
router.get("/statistics", getStatistics);

module.exports = router;
