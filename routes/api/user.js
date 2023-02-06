const express = require("express");
const ctrl = require("../../controllers/user");
const { validateBody } = require("../../middlewares");
const { schemas } = require("../../models/user_pets");
const router = express.Router();

// add auth middleware
// validateBody(schemas.addPet),
router.get("/info/:id", ctrl.getUserInfo);
router.post("/info/:id", ctrl.addPet);
router.delete("/info/:id", ctrl.deletePet);

module.exports = router;