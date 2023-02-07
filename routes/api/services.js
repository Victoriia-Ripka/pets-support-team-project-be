const express = require("express");
const ctrl = require("../../controllers/services.js");

const router = express.Router();

router.get("/", ctrl.getAllServices);
router.post("/", ctrl.addService);
router.get("/:id", ctrl.getServiceById);

module.exports = router;