const { Schema, model } = require("mongoose");
const Joi = require("joi");
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

const getNewsSchema = Joi.object({
  title: Joi.string().required(),
  url: Joi.string().required(),
  description: Joi.string().required(),
  date: Joi.string().required(),
});

const schemas = {
  getNewsSchema,
};

const News = model("news", newsSchema);

module.exports = {
  News,
  schemas,
};
