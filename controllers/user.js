const { User } = require("../models/user");
const { Pets } = require("../models/user_pets");
const { ctrlWrapper } = require("../helpers");

const getUserInfo = async (req, res) => {
  const { id } = req.params;

  const data = await User.findOne({ _id: id });
  const pets = await Pets.find({ owner: id });

  res.status(200).json({
    status: "success",
    code: 200,
    result: {
      data,
      pets: {
        ...pets,
      },
    },
  });
};

const addPet = async (req, res) => {
  const { id } = req.params;
  // const { _id: owner} = req.user
  await Pets.create({ ...req.body, owner: id });

  res.status(201).json({
    status: "success",
    code: 201,
    result: {
      data: {
        ...req.body,
        owner,
      },
    },
  });
};

const deletePet = async (req, res) => {
  const { id } = req.params;
  const { pet_id } = req.body;

  const bool = await Pets.findOneAndRemove({ _id: pet_id, owner: id });
  if (!bool) {
    throw HttpError(404);
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
