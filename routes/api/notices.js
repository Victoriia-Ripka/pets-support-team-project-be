const express = require('express');
const { getPetsByCategories, getPetById, addToFavorite, removeFromFavorite, getFavoritePets, addPet, getUserPets, deletePet } = require('../../controllers/notices');
const { ctrlWrapper } = require('../../helpers');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const { upload } = require('../../middlewares/uploadMiddleware');
const { noticeValidation } = require('../../middlewares/validationMiddleware');
const router = express.Router();

router.get('/', ctrlWrapper(getPetsByCategories));
router.get('/favorite', authMiddleware, ctrlWrapper(getFavoritePets));
router.get('/mynotices', authMiddleware, ctrlWrapper(getUserPets));
router.get('/:noticeId', ctrlWrapper(getPetById));
router.get('/:noticeId/favorite/add', authMiddleware, ctrlWrapper(addToFavorite));
router.get('/:noticeId/favorite/remove', authMiddleware, ctrlWrapper(removeFromFavorite));
router.delete('/:noticeId', authMiddleware, ctrlWrapper(deletePet));
router.post('/', authMiddleware, upload.single('avatar'), noticeValidation, ctrlWrapper(addPet));

module.exports = {noticesRouter: router}