const { User, Pets } = require("../models");
const { ctrlWrapper, httpError, createAvatar } = require("../helpers");

const getUserInfo = async (req, res) => {
  const { _id } = req.user;

  const data = await User.findOne({ _id });
  const pets = await Pets.find({ owner: _id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    code: 200,
    result: {
      data,
      pets: [...pets],
    },
  });
};

const addPet = async (req, res) => {
  const { _id: owner } = req.user;

  const width = 240;
  const height = 240;
  let avatarURL = undefined;
  if (req?.file?.path) {
    avatarURL = await createAvatar(req.file.path, width, height);
  } else {
    res.status(400).json({ message: 'Avatar is required' });
  }
  

  await Pets.create({ ...req.body, owner, avatarURL });

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      ...req.body,
      avatarURL,
      owner,
    },
  });
};

const deletePet = async (req, res) => {
  const { _id: owner } = req.user;
  const { pet_id } = req.body;

  const bool = await Pets.findOneAndRemove({ _id: pet_id, owner });
  if (!bool) {
    throw httpError(404);
  } else {
    res
      .status(200)
      .json({ status: "success", code: 200, message: "pet deleted" });
  }
};

module.exports = {
  getUserInfo: ctrlWrapper(getUserInfo),
  addPet: ctrlWrapper(addPet),
  deletePet: ctrlWrapper(deletePet),
};
