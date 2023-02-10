const express = require("express");
const ctrl = require("../../controllers/notices");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { upload } = require("../../middlewares/uploadMiddleware");
const { noticeValidation } = require("../../middlewares/validationMiddleware");
const router = express.Router();


router.get("/favorite", authMiddleware, ctrl.getFavoritePets);
router.get("/mynotices", authMiddleware, ctrl.getUserPets);
router.get("/:category", ctrl.getPetsByCategories);
router.get("/favorite/add/:noticeId", authMiddleware, ctrl.addToFavorite);
router.get("/favorite/remove/:noticeId", authMiddleware, ctrl.removeFromFavorite);
router.get("/pet/:noticeId", ctrl.getPetById);
router.delete("/pet/:noticeId", authMiddleware, ctrl.deletePet);
router.post("/", authMiddleware, upload.single("avatar"), noticeValidation, ctrl.addPet );

module.exports = router;
