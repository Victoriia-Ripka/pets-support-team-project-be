const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const dateOfBirthSchema =
  /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/;
const phoneSchema = /^\+380[0-9]{9}$/;
const passwordSchema = /^[0-9a-zA-Z]{7,32}$/;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      formData: passwordSchema,
    },
    token: { type: String, default: null },
    refreshToken: [String],
    avatarURL: { type: String, required: true },
    name: { type: String, required: true },
    place: { type: String, required: true },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    phone: { type: String, required: true, formData: phoneSchema },
    dateofbirth: {
      type: String,
      required: true,
      default: "01.01.1900",
      formData: dateOfBirthSchema,
    },
    favorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "notices",
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = mongoose.model("user", userSchema);

module.exports = { User };
