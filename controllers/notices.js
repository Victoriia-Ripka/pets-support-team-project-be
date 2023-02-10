const { httpError, createAvatar } = require("../helpers");
const { User, Notices } = require("../models");
const { ctrlWrapper } = require("../helpers");

const selectCategory = {
  category: 1,
  title: 1,
  breed: 1,
  place: 1,
  dateofbirth: 1,
  price: 1,
  avatarURL: 1,
};

const getPetsByCategories = async (req, res) => {
  const { category } = req.params;
  let skip = 0;
  let limit = 8;
  if (
    category !== "sell" &&
    category !== "lost-found" &&
    category !== "in-good-hands"
  ) {
    throw httpError(400, "bad request");
  }
  const pets = await Notices.find({ category })
    .select(selectCategory)
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });
  res.status(200).json(pets);
};

const getPetById = async (req, res) => {
  const { noticeId } = req.params;
  const pet = await Notices.findById(noticeId).lean();

  if (!pet) {
    throw httpError(404, "bad request");
  }

  const owner = await User.findById(pet.owner);
  pet.email = owner.email;
  pet.phone = owner.phone;

  res.status(200).json(pet);
};

const addToFavorite = async (req, res) => {
  const { noticeId } = req.params;
  const { id } = req.user;

  if (!id) {
    throw httpError(401);
  }

  const doesNoticeExists = await Notices.exists({_id: noticeId});

  if (!doesNoticeExists) {
    throw httpError(404, "notice doesn't exist")
  }

  try {
    await User.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { favorites: noticeId } },
      { fields: { favorites: 1 } }
    );
    res.status(200).json({ message: "success" });
  } catch (error) {
    throw httpError(404, "bad request");
  }
};

const removeFromFavorite = async (req, res) => {
  const { noticeId } = req.params;
  const { id } = req.user;

  if (!id) {
    throw httpError(401);
  }
  
  try {
    await User.findByIdAndUpdate(
      { _id: id },
      { $pull: { favorites: noticeId } },
      { fields: { favorites: 1 } }
    );
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(404).json({ message: "bad request" });
  }
};

const getFavoritePets = async (req, res) => {
  const { id } = req.user;
  let skip = 0;
  let limit = 8;
  const [pets] = await User.find({ _id: id }, { favorites: 1 }).populate({
    path: "favorites",
    skip: skip,
    limit: limit,
    options: { sort: { created_at: -1 } },
    select: selectCategory,
  });
  res.status(200).json(pets);
};

const addPet = async (req, res) => {
  const { title, name, dateofbirth, breed, place, price, sex, comments, category } =
    req.body;
  const { id } = req.user;
  const width = 280;
  const height = 280;
  if (req?.file?.path) {
    avatarURL = await createAvatar(req.file.path, width, height);
  } else {
    res.status(400).json({ message: 'Avatar is required' });
  }
  const pet = new Notices({
    owner: id,
    title,
    name,
    dateofbirth,
    breed,
    place,
    price,
    sex,
    comments,
    category,
    avatarURL,
  });
  await pet.save();
  res.status(201).json(pet);
};

const getUserPets = async (req, res) => {
  const { id } = req.user;
  let skip = 0;
  let limit = 8;
  const pets = await Notices.find({ owner: id })
    .select(selectCategory)
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });
  res.status(200).json(pets);
};

const deletePet = async (req, res) => {
  const { noticeId } = req.params;
  const pet = await Notices.findByIdAndDelete(noticeId);
  if (!pet) {
    res.status(404).json({ message: "bad request" });
  }
  res.status(200).json({ message: "success" });
};

module.exports = {
  getPetsByCategories: ctrlWrapper(getPetsByCategories),
  getPetById: ctrlWrapper(getPetById),
  addToFavorite: ctrlWrapper(addToFavorite),
  removeFromFavorite: ctrlWrapper(removeFromFavorite),
  getFavoritePets: ctrlWrapper(getFavoritePets),
  addPet: ctrlWrapper(addPet),
  getUserPets: ctrlWrapper(getUserPets),
  deletePet: ctrlWrapper(deletePet),
};
