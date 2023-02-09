const express = require("express");
const ctrl = require("../../controllers/user");
const { validateBody } = require("../../middlewares");
const { schemas } = require("../../models/user_pets");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { upload } = require("../../middlewares/uploadMiddleware");
const router = express.Router();

router.get("/", authMiddleware, ctrl.getUserInfo);
router.post("/", authMiddleware, upload.single("avatar"), validateBody(schemas.AddPet), ctrl.addPet);
router.delete("/", authMiddleware, ctrl.deletePet);

module.exports = router;
