const express = require("express");
const router = express.Router();

const { getAllUsers, getAllTasks } = require("../controllers/admin");

router.get("/users", getAllUsers);
router.get("/tasks", getAllTasks);

module.exports = router;
