const express = require("express");
const ctrl = require("../../controllers/user");
// const { validateBody } = require("../../middlewares");
// const { schemas } = require("../../models/user_pets");
const { authMiddleware } = require('../../middlewares/authMiddleware');
const router = express.Router();

// validateBody(schemas.addPet),
router.get("/info", authMiddleware, ctrl.getUserInfo);
router.post("/info", authMiddleware, ctrl.addPet);
router.delete("/info", authMiddleware, ctrl.deletePet);

module.exports = router;