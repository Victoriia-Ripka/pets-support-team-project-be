const express = require("express");
const ctrl = require("../../controllers/notices");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { upload } = require("../../middlewares/uploadMiddleware");
const { noticeValidation } = require("../../middlewares/validationMiddleware");
const router = express.Router();


router.get("/favorite", authMiddleware, ctrl.getFavoriteNotices);
router.get("/mynotices", authMiddleware, ctrl.getUserNotices);
router.get("/ownernotices/:id", ctrl.getOwnerNotices);
router.get("/:category", ctrl.getNoticesByCategories);
router.get("/favorite/add/:noticeId", authMiddleware, ctrl.addToFavorite);
router.get("/favorite/remove/:noticeId", authMiddleware, ctrl.removeFromFavorite);
router.get("/pet/:noticeId", ctrl.getNoticeById);
router.delete("/pet/:noticeId", authMiddleware, ctrl.deleteNotice);
router.post("/", authMiddleware, upload.single("avatar"), noticeValidation, ctrl.addNotice );

module.exports = router;
