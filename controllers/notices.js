const { Notices } = require("../models/notices");

const getPetsByCategories = async (req, res) => {
    const { category } = req.body;
    let skip = 0;
    let limit = 8;
    if (category !== 'sell' || category !== 'lost-found' || category !== 'in-good-hands') {
        res.status(404).json({message: 'bad request'})
    }
    const pets = await Notices.find({ category: category }).select({ category: 1, breed: 1, place: 1, birthday: 1, price: 1, imageUrl: 1}).limit(limit).skip(skip);
    res.status(200).json(pets);
}


const getPetById = async (req, res) => {
    const { id } = req.params;
    const pet = await Notices.findById(id);
    if (!pet) {
        res.status(404).json({ message: 'bad request' });
    }
    res.status(200).json(pet);
}