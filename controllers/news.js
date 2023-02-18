const { ctrlWrapper } = require("../helpers");
const { News } = require("../models");

const getAllNews = async (req, res) => {
  const { keyword } = req.query;
  let query = {}
  
  if (keyword) {
    query.$or = [
      {"title": {$regex: keyword, $options: 'i'}}
    ]
  }
  // req.params/req.query/req.body
  const data = await News.find(query);

  if (data) {
    res.status(200).json({ status: "success", code: 200, data });
  } else {
    res.status(204).json({
      message: "No Content",
    });
  }
};

module.exports = {
  getAllNews: ctrlWrapper(getAllNews),
};
