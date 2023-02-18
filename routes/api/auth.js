const express = require("express");
const ctrl = require("../../controllers/auth");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { upload } = require("../../middlewares/uploadMiddleware");
const {
  userValidation,
  userUpdateValidation,
} = require("../../middlewares/validationMiddleware");
const { passport } = require("../../middlewares");
const router = express.Router();

router.post("/signup", userValidation, ctrl.registration);
router.get("/verify/:verificationToken", ctrl.verify);
router.post("/verify", ctrl.verifyNewly);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "name"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  ctrl.googleAuth
);
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
