const express = require("express");
const ctrl = require("../../controllers/news.js");

const router = express.Router();

router.get("/", ctrl.getAllNews);

module.exports = router;