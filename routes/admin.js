const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllTasks,
  getStatistics,
} = require("../controllers/admin");

router.get("/users", getAllUsers);
router.get("/tasks", getAllTasks);
router.get("/statistics", getStatistics);

module.exports = router;
