const { Service } = require("../../models");

const getAll = async (req, res) => {
  const service = await Service.find({});

  if (data) {
    res.json({
      status: "success",
      code: 200,
      data: {
        result: service,
      },
    });
  } else {
    res.status(204).json({
      message: "No Content",
    });
  }
};

module.exports = getAll;
