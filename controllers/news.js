const { ctrlWrapper } = require("../helpers");
const { News } = require("../models/news");

const getAllNews = async (req, res) => {
  const data = await News.find();

  res.status(200).json(data);
};

module.exports = {
  getAllNews: ctrlWrapper(getAllNews),
};
