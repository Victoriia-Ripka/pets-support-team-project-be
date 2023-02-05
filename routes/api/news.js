const express = require("express");
const ctrl = require("../../controllers/news.js");
// validateBody, (middlewares)
// schemas

const router = express.Router();

router.get("/", ctrl.getAllNews);

module.exports = router;