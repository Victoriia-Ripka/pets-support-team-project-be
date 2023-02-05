const express = require("express");

const { ctrlWrapper} = require("../../middlewares");
const {service: ctrl} = require("../../controllers")

const router = express.Router();

router.get("/", ctrlWrapper(ctrl.getAll));

router.post("/", ctrlWrapper(ctrl.add));

router.get("/:id", ctrlWrapper(ctrl.getById));

module.exports = router;