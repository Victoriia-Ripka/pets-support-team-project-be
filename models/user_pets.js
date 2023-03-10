const { Schema, model } = require("mongoose");
const Joi = require("joi").extend(require('@joi/date'));
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
      maxlength: 800,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    avatarURL: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

petsSchema.post("save", handleMongooseError);

const AddPet = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  date: Joi.date().required().format('DD.MM.YYYY').min('02.02.1823').max('now'),
  // date: Joi.date().format("DD.MM.YYYY").raw().required(),
  breed: Joi.string().min(2).max(30).required(),
  comment: Joi.string().max(800),
});

const schemas = {
  AddPet,
};

const Pets = model("users-pets", petsSchema);

module.exports = {
  Pets,
  schemas,
};
