const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const uuid = require("uuid");
var jwt = require("jsonwebtoken");
const {
  createAvatar,
  httpError,
  ctrlWrapper,
  sendEmail,
} = require("../helpers");
const { User } = require("../models");
require("dotenv").config();

const createVarifyEmail = (email, verificationToken) => {
  return {
    to: email,
    subject: "Petly. Verify email",
    html: `<h2>Thank you for registration</h2><a targt="_blank" href="${process.env.BASE_URL}/api/users/verify/${verificationToken}">Please, confirm your email.</a><p>Have a nice day</p>`,
  };
};

const createNewPassword = (email, password) => {
  return {
    to: email,
    subject: "Petly App. Password recovery",
    text: `Here is your new password: ${password}`,
    html: `<p>Here is your new password: ${password}</p><a targt="_blank" href="https://alexandra-makarenko.github.io/pets-support-team-project/login">Link to login.</a><p>Have a nice day</p>`,
  };
};

// ${process.env.BASE_URL}/api/users/verify/${verificationToken}
const registration = async (req, res) => {
  const { email, password, name, place, phone } = req.body;
  const avatarURL = gravatar.url(email);
  const verificationToken = uuid.v4();
  const user = new User({
    email,
    password,
    name,
    place,
    phone,
    avatarURL,
    verificationToken,
  });
  try {
    await user.save();
  } catch (error) {
    throw httpError(409, "Email in use");
  }

  const verifyEmail = createVarifyEmail(email, verificationToken);
  await sendEmail(verifyEmail);

  res.status(201).json({ email });
};

const googleAuth = async (req, res) => {
  const { id: _id } = req.user;
  const token = jwt.sign(
    { id },
    process.env.JWT_SECRET
    // { expiresIn: "23h" }
  );
  await User.findByIdAndUpdate(_id, { token });
  res.redirect(`${process.env.BASE_URL}?token=${token}`);
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
  // const cookies = req.cookies;
  // console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, "Incorrect email or password");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw httpError(401, "Incorrect email or password");
  }

  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET
    // { expiresIn: "23h" }
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
      dateofbirth: user.dateofbirth,
      favorites: user.favorites,
      _id: user._id,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  // const cookies = req.cookies;
  // if (!cookies?.jwt) return res.sendStatus(204); //No content
  // const refreshToken = cookies.jwt;

  // const foundUser = await User.findOne({ refreshToken }).exec();
  // if (!foundUser) {
  //   res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  //   return res.sendStatus(204);
  // }

  // // Delete refreshToken in db
  // foundUser.refreshToken = foundUser.refreshToken.filter(
  //   (rt) => rt !== refreshToken
  // );
  // const result = await foundUser.save();
  // console.log(result);

  // res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  // res.sendStatus(204);
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(200).json({ message: "logout success" });
};

// const refreshToken = async (req, res) => {
//   const cookies = req.cookies;
//   if (!cookies?.jwt) return res.sendStatus(401);
//   const refreshToken = cookies.jwt;
//   res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

//   const user = await User.findOne({ refreshToken }).exec();

//   // Detected refresh token reuse!
//   if (!user) {
//     jwt.verify(
//       refreshToken,
//       process.env.REFRESH_TOKEN_SECRET,
//       async (err, decoded) => {
//         if (err) return res.sendStatus(403); //Forbidden
//         console.log("attempted refresh token reuse!");
//         const hackedUser = await User.findOne({
//           name: decoded.name,
//         }).exec();
//         hackedUser.refreshToken = [];
//         const result = await hackedUser.save();
//         console.log(result);
//       }
//     );
//     return res.sendStatus(403); //Forbidden
//   }

//   const newRefreshTokenArray = user.refreshToken.filter(
//     (rt) => rt !== refreshToken
//   );

//   // evaluate jwt
//   jwt.verify(
//     refreshToken,
//     process.env.REFRESH_TOKEN_SECRET,
//     async (err, decoded) => {
//       if (err) {
//         console.log("expired refresh token");
//         user.refreshToken = [...newRefreshTokenArray];
//         const result = await user.save();
//         console.log(result);
//       }
//       if (err || user.name !== decoded.name) return res.sendStatus(403);

//       // Refresh token was still valid
//       const roles = Object.values(user.roles);
//       const accessToken = jwt.sign(
//         {
//           _id: user._id,
//           createdAt: user.createdAt,
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: "10s" }
//       );

//       const newRefreshToken = jwt.sign(
//         { name: user.name },
//         process.env.REFRESH_TOKEN_SECRET,
//         { expiresIn: "1d" }
//       );
//       // Saving refreshToken with current user
//       user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
//       const result = await user.save();

//       // Creates Secure Cookie with refresh token
//       res.cookie("jwt", newRefreshToken, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "None",
//         maxAge: 24 * 60 * 60 * 1000,
//       });

//       res.json({ accessToken });
//     }
//   );
// };

const refreshUser = async (req, res) => {
  const { email, name, place, phone, avatarURL, dateofbirth, favorites, _id } = req.user;
  res.status(200).json({ email, name, place, phone, avatarURL, dateofbirth, favorites,_id });
};

const userUpdate = async (req, res) => {
  const { name, place, phone, dateofbirth } = req.body;
  const width = 233;
  const height = 233;
  let avatarURL = undefined;
  if (req?.file?.path) {
    avatarURL = await createAvatar(req.file.path, width, height);
  }

  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(
    _id,
    {
      $set: { name, place, phone, dateofbirth, avatarURL },
    },
    { new: true }
  );
  if (!user) {
    throw httpError(401);
  }
  res.status(200).json({
    name: user.name,
    place: user.place,
    phone: user.phone,
    dateofbirth: user.dateofbirth,
    avatarURL: user.avatarURL,
  });
};

const newPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) { httpError(404) }

  const password = uuid.v4();
  const hashPassword = await bcrypt.hash(password, 10);
  await user.findByIdAndUpdate(user._id, { password: hashPassword });

  const emailToUser = createNewPassword(email, hashPassword);
  await sendEmail(emailToUser);

  res.status(200).json({
    message: "Password updated successfuly",
  });
};

module.exports = {
  registration: ctrlWrapper(registration),
  verify: ctrlWrapper(verify),
  verifyNewly: ctrlWrapper(verifyNewly),
  login: ctrlWrapper(login),
  newPassword: ctrlWrapper(newPassword),
  logout: ctrlWrapper(logout),
  googleAuth: ctrlWrapper(googleAuth),
  // refreshToken: ctrlWrapper(refreshToken),
  refreshUser: ctrlWrapper(refreshUser),
  userUpdate: ctrlWrapper(userUpdate),
};
