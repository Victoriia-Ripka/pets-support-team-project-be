const express = require("express");
const ctrl = require("../../controllers/notices");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { upload } = require("../../middlewares/uploadMiddleware");
const { noticeValidation } = require("../../middlewares/validationMiddleware");
const router = express.Router();


router.get("/favorite", authMiddleware, ctrl.getFavoritePets);
router.get("/mynotices", authMiddleware, ctrl.getUserPets);
router.get("/:category", ctrl.getPetsByCategories);
router.get("/:noticeId", ctrl.getPetById);
router.get("/:noticeId/favorite/add", authMiddleware, ctrl.addToFavorite);
router.get("/:noticeId/favorite/remove", authMiddleware, ctrl.removeFromFavorite);
router.delete("/:noticeId", authMiddleware, ctrl.deletePet);
router.post("/", authMiddleware, upload.single("avatar"), noticeValidation, ctrl.addPet );

module.exports = router;
