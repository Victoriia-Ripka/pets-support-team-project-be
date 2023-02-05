const { Notices } = require("../models/notices");
const { User } = require("../models/user");

const selectCategory = { category: 1, breed: 1, place: 1, birthday: 1, price: 1, imageUrl: 1}

const getPetsByCategories = async (req, res) => {
    const { category } = req.body;
    let skip = 0;
    let limit = 8;
    if (category !== 'sell' || category !== 'lost-found' || category !== 'in-good-hands') {
        res.status(404).json({message: 'bad request'})
    }
    const pets = await Notices.find({ category: category }).select(selectCategory).limit(limit).skip(skip).sort({createdAt: -1});
    res.status(200).json(pets);
}


const getPetById = async (req, res) => {

    // добавить почту и номер телефона от юзера

    const { noticeId } = req.params;
    const pet = await Notices.findById(id);
    if (!pet) {
        res.status(404).json({ message: 'bad request' });
    }
    res.status(200).json(pet);
}

const addToFavorite = async (req, res) => {
    const { noticeId} = req.body;
    const { id } = req.user;

    if (!id) {
        res.status(404).json({ message: 'bad request' });
    }

    try {
        const data = await User.findByIdAndUpdate({ _id: id }, { $addToSet: { favorites: noticeId } }, { fields: { favorites: 1 } });
        res.status(201).json(data)
    } catch (error) {
        res.status(404).json({ message: 'bad request' });
    }
}

const removeFromFavorite = async (req, res) => {
    const { noticeId} = req.body;
    const { id } = req.user;

    if (!id) {
        res.status(404).json({ message: 'bad request' });
    }

    try {
        const data = await User.findByIdAndUpdate({ _id: id }, { $pull: { favorites: noticeId } }, { fields: { favorites: 1 } });
        res.status(201).json(data)
    } catch (error) {
        res.status(404).json({ message: 'bad request' });
    }
}

const getFavoritePets = async (req, res) => {
    const { id } = req.user;
    let skip = 0;
    let limit = 8;
    const [petsId] = await User.find({ _id: id }).select(selectCategory).limit(limit).skip(skip).sort({createdAt: -1}.fields({favorites: 1}));
    // const [petsId] = await Notices.find({ _id: id }).populate({
    //     select: selectCategory,
    //     limit: limit,
    //     skip: skip,
    //     sort: { createdAt: - 1 },
    //     fields: {favorites: 1}
    // });
    console.log(petsId)
    // res.status(200).json(pets);
}

const addPet = async (req, res) => {
    const { name, dateofbirth, breed, place, sex, comments, category } = req.body;
    const { id } = req.user;
    const pet = new Notices({ owner: id, name, dateofbirth, breed, place, sex, comments, category });
    await pet.save();
    res.status(200).json(pet);
}

const getUserPets = async(req, res) => {
    const { id } = req.user;
    let skip = 0;
    let limit = 8;
    const pets = await Notices.find({ owner: id }.select(selectCategory).limit(limit).skip(skip).sort({ createdAt: -1 }));
    res.status(201).json(pets);
}

const deletePet = async (req, res) => {
    const { noticeId } = req.body;
    const pet = await Notices.findByIdAndRemove(noticeId);
    if (!pet) {
        res.status(404).json({ message: 'bad request' });
    }
    res.status(200).json({message: 'success'})
}

module.exports = {
    getPetsByCategories, getPetById, addToFavorite, removeFromFavorite, getFavoritePets, addPet, getUserPets, deletePet
}