const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const httpError = require('../helpers/httpError');
const { User } = require("../models/user");
require('dotenv').config();
const gravatar = require('gravatar');
const { createAvatar } = require('../helpers/createAvatar');

const registration = async (req, res) => {
    const { email, password, name, place, phone } = req.body;
    const avatarURL = gravatar.url(email);
    const user = new User({ email, password, name, place, phone, avatarURL })
    try {
        await user.save();
    } catch (error) {
        throw httpError(409, 'Email in use');
    }
    res.status(201).json({ email });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw httpError(401, 'Incorrect email or password');
    }
    if (!(await bcrypt.compare(password, user.password))) {
        throw httpError(401, 'Incorrect email or password');
    }
    const token = jwt.sign(
    {
      _id: user._id,
      createdAt: user.createdAt,
    },
        process.env.JWT_SECRET
    );
    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({ token: token, user: { email: user.email, name: user.name, place: user.place, phone: user.phone, avatarURL: user.avatarURL } });
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });
    res.status(200).json({ message: 'logout success' });
};

const userUpdate = async (req, res) => {
    const { name, place, phone, dateofbirth } = req.body;
    const width = 233;
    const height = 233;
    const avatarURL = await createAvatar(req.file.path, width, height);
    
    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(_id, { $set: { name, place, phone, dateofbirth, avatarURL } })
    if (!user) {
        throw httpError(401);
    }
    res.status(200).json({ status: 'success' });
}

module.exports = { registration, login, logout, userUpdate };