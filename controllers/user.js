const { User } = require("../models/user");
const { Pets } = require("../models/user_pets");
const { ctrlWrapper, httpError } = require("../helpers");

const getUserInfo = async (req, res) => {
  const { _id } = req.user;

  const data = await User.findOne({ _id });
  const pets = await Pets.find({ owner: _id });

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
  await Pets.create({ ...req.body, owner });

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      ...req.body,
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
