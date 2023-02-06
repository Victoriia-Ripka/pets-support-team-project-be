const express = require('express');
const { getPetsByCategories, getPetById, addToFavorite, removeFromFavorite, getFavoritePets, addPet, getUserPets, deletePet } = require('../../controllers/notices');
const { ctrlWrapper } = require('../../helpers');
const router = express.Router();

router.get('/', ctrlWrapper(getPetsByCategories));
router.get('/:noticeId', ctrlWrapper(getPetById));
router.patch('/:noticeId/favorite/add', ctrlWrapper(addToFavorite));
router.patch('/:noticeId/favorite/remove', ctrlWrapper(removeFromFavorite));
router.get('/favorite', ctrlWrapper(getFavoritePets));
router.post('/', ctrlWrapper(addPet));
router.get('/mynotices', ctrlWrapper(getUserPets));
router.delete('/:noticeId', ctrlWrapper(deletePet));

module.exports = {noticesRouter: router}