const { ctrlWrapper } = require("../helpers");
const { News } = require("../models/news");

const getAllNews = async (req, res) => {
  const data = await News.find();

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(204).json({
      message: "No Content",
    });
  }
};

module.exports = {
  getAllNews: ctrlWrapper(getAllNews),
};
