const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const petsSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 16,
      required: true,
    },
    date: {
      // type: Date,
      type: String,
      required: true,
    },
    breed: {
      type: String,
      minlength: 2,
      maxlength: 16,
      required: true,
    },
    comment: {
      type: String,
      minlength: 8,
      maxlength: 120,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

petsSchema.post("save", handleMongooseError);

const AddPet = Joi.object({
  name: Joi.string().min(2).max(16).required(),
  date: Joi.string().required(),
  // date: Joi.date().format("DD.MM.YYYY").raw().required(),
  breed: Joi.string().min(2).max(16).required(),
  comment: Joi.string().min(8).max(120).required()
});

const schemas = {
  AddPet,
};

const Pets = model("users-pets", petsSchema);

module.exports = {
  Pets,
  schemas,
};
