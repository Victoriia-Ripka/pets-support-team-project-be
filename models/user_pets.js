const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");
const dateOfBirthSchema = /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/;

const petsSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    date: {
      // type: Date,
      type: String,
      required: true,
      FormData: dateOfBirthSchema,
    },
    breed: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    comment: {
      type: String,
      minlength: 8,
      maxlength: 800,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    avatarURL: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

petsSchema.post("save", handleMongooseError);

const AddPet = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  date: Joi.string().required(),
  // date: Joi.date().format("DD.MM.YYYY").raw().required(),
  breed: Joi.string().min(2).max(30).required(),
  comment: Joi.string().min(8).max(800).required(),
});

const schemas = {
  AddPet,
};

const Pets = model("users-pets", petsSchema);

module.exports = {
  Pets,
  schemas,
};
