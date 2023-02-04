const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { User } = require("../models/user");
require('dotenv').config();

const registration = async (req, res) => {
    const { email, password, name, place, phone } = req.body;
    const avatarURL = gravatar.url(email);
    const user = new User({ email, password, name, place, phone, avatarURL })
    try {
        await user.save();
    } catch (error) {
        console.error(error);
    }
    res.status(201).json({ email });
}

const login = async (email, password) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        // throw new NotAuthorizedError(`Incorrect email or password`);
    }
    if (!(await bcrypt.compare(password, user.password))) {
        // throw new NotAuthorizedError('Incorrect email or password');
    }
    const token = jwt.sign(
    {
      _id: user._id,
      createdAt: user.createdAt,
    },
        process.env.JWT_SECRET
    );
    await User.findByIdAndUpdate(user._id, { token });
    res.json({ token: token, user: { email: user.email, name: user.name, place: user.place, phone: user.phone, avatarURL: user.avatarURL } });
}

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.json({ message: 'logout success' });
};

const userUpdate = async (req, res) => {
    const { name, place, phone } = req.body;
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { $set: { name, place, phone } })
    if (!user) {

    }
    res.json({ status: 'success' });
}

module.exports = {registration, login, logout, userUpdate}