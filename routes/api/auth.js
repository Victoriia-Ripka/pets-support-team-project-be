const express = require("express");
const ctrl = require("../../controllers/auth");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { upload } = require("../../middlewares/uploadMiddleware");
const {
  userValidation,
  userUpdateValidation,
} = require("../../middlewares/validationMiddleware");
const router = express.Router();

router.post("/signup", userValidation, ctrl.registration);
router.get("/verify/:verificationToken", ctrl.verify);
router.post("/verify", ctrl.verifyNewly);
router.post("/google/callback", ctrl.a);
router.post("/google", ctrl.a);
router.post("/new_password", ctrl.newPassword);
router.post("/login", ctrl.login);
router.get("/current", authMiddleware, ctrl.refreshUser);
router.get("/logout", authMiddleware, ctrl.logout);
router.patch(
  "/",
  authMiddleware,
  upload.single("avatar"),
  userUpdateValidation,
  ctrl.userUpdate
);

module.exports = router;
