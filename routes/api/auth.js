const express = require('express');
const { registration, login, logout, userUpdate } = require('../../controllers/auth');
const { ctrlWrapper } = require('../../helpers');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const { upload } = require('../../middlewares/uploadMiddleware');
const { userValidation, userUpdateValidation } = require('../../middlewares/validationMiddleware');
const router = express.Router();

router.post('/signup', userValidation, ctrlWrapper(registration));
router.post('/login', ctrlWrapper(login));
router.get('/logout', authMiddleware, ctrlWrapper(logout));
router.patch('/', authMiddleware, upload.single('avatar'), userUpdateValidation, ctrlWrapper(userUpdate));

module.exports = {authRouter: router}