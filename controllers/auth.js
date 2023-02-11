const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const uuid = require("uuid")
var jwt = require("jsonwebtoken");
const { createAvatar, httpError, ctrlWrapper, sendEmail } = require("../helpers");
const { User } = require("../models");
require("dotenv").config();

const createVarifyEmail = (email, verificationToken) => {
  return {
    to: email,
    subject: "Petly. Verify email",
    html: `<h2>Thank you for registration</h2><a targt="_blank" href="${process.env.BASE_URL}/api/users/verify/${verificationToken}">Please, confirm your email.</a><p>Have a nice day</p>`,
  };
};

const registration = async (req, res) => {
  const { email, password, name, place, phone } = req.body;
  const avatarURL = gravatar.url(email);
  const verificationToken = uuid.v4();
  const user = new User({ email, password, name, place, phone, avatarURL, verificationToken });
  try {
    await user.save();
  } catch (error) {
    throw httpError(409, "Email in use");
  }

  const verifyEmail = createVarifyEmail(email, verificationToken);
  await sendEmail(verifyEmail);

  res.status(201).json({ email });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    throw HttpError(404);
  }

  const user = await User.findOne({ verificationToken, verify: false });

  if (!user) {
    throw HttpError(404);
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const verifyNewly = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw HttpError(400, "missing required field email");
  }

  const user = await User.findOne({ email });

  if (user.verify) {
    return res.status(400).json({
      message: "Verification has already been passed",
    });
  }

  const verifyEmail = createVarifyEmail(email, user.verificationToken);
  await sendEmail(verifyEmail);

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.status(200).json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, "Incorrect email or password");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw httpError(401, "Incorrect email or password");
  }
  const token = jwt.sign(
    {
      _id: user._id,
      createdAt: user.createdAt,
    },
    process.env.JWT_SECRET,
    {expiresIn: "23h"}
  );
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token: token,
    user: {
      email: user.email,
      name: user.name,
      place: user.place,
      phone: user.phone,
      avatarURL: user.avatarURL,
      dayofbirth: user.dateofbirth,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(200).json({ message: "logout success" });
};

const refreshUser = async (req, res) => {
  const { email, name, place, phone, avatarURL } = req.user;
  res.status(200).json({ email, name, place, phone, avatarURL });
};

const userUpdate = async (req, res) => {
  const { name, place, phone, dateofbirth } = req.body;
  const width = 233;
  const height = 233;
  const avatarURL = await createAvatar(req.file.path, width, height);

  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id, {
    $set: { name, place, phone, dateofbirth, avatarURL },
  });
  if (!user) {
    throw httpError(401);
  }
  res.status(200).json({ status: "success" });
};

module.exports = {
  registration: ctrlWrapper(registration),
  verify: ctrlWrapper(verify),
  verifyNewly: ctrlWrapper(verifyNewly),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  refreshUser: ctrlWrapper(refreshUser),
  userUpdate: ctrlWrapper(userUpdate),
};
