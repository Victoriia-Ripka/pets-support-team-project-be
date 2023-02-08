const { ctrlWrapper } = require("../helpers");
const { Service } = require("../models");

const addService = async (req, res) => {
  const result = await Service.create(req.body);
  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      favorite: false,
      ...result,
    },
  });
};

const getAllServices = async (req, res) => {
  const data = await Service.find();

  if (data) {
    res.status(200).json({
      status: "success",
      code: 200,
      data
    });
  } else {
    res.status(204).json({
      message: "No Content",
    });
  }
};

const getServiceById = async (req, res) => {
  const { id } = req.params;
  const result = await Service.findById(id);
  if (!result) {
    throw new NotFound(`Service with id=${id} not found`);
  }
  res.json({
    status: "success",
    code: 200,
    data: {
      result,
    },
  });
};

module.exports = {
  getAllServices: ctrlWrapper(getAllServices),
  addService: ctrlWrapper(addService),
  getServiceById: ctrlWrapper(getServiceById),
};
