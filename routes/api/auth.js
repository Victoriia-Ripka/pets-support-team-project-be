const express = require('express');
const { registration, login, logout, userUpdate } = require('../../controllers/auth');
const { ctrlWrapper } = require('../../helpers');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const router = express.Router();

router.post('/signup', ctrlWrapper(registration));
router.post('/login', ctrlWrapper(login));
router.get('/logout', authMiddleware, ctrlWrapper(logout));
router.patch('/', authMiddleware, ctrlWrapper(userUpdate));

module.exports = {authRouter: router}