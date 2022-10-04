const express = require("express");
const router = express.Router();

const { refreshToken } = require("../controllers/token");

router.post("/", refreshToken);

module.exports = router;
