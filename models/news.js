const { Schema, model } = require("mongoose");
// const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const newsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

newsSchema.post("save", handleMongooseError);

// const getNews = {
//   title,
//   url,
//   description,
//   date,
// };

const schemas = {
//   getNews,
};

const News = model("news", newsSchema);

module.exports = {
  News,
  schemas,
};
