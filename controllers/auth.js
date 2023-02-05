const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const httpError = require('../helpers/httpError');
const { User } = require("../models/user");
require('dotenv').config();
const gravatar = require('gravatar');

const registration = async (req, res) => {
    const { email, password, name, place, phone } = req.body;
    const avatarURL = gravatar.url(email);
    const user = new User({ email, password, name, place, phone, avatarURL })
    try {
        console.log(user)
        await user.save();
    } catch (error) {
        console.log(error.message)
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
    res.json({ token: token, user: { email: user.email, name: user.name, place: user.place, phone: user.phone, avatarURL: user.avatarURL } });
}

const logout = async (req, res) => {
    const { _id } = req.user;
    console.log(_id);
    await User.findByIdAndUpdate(_id, { token: '' });
    res.json({ message: 'logout success' });
};

const userUpdate = async (req, res) => {
    const { name, place, phone, dateofbirth } = req.body;
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { $set: { name, place, phone, dateofbirth } })
    if (!user) {
        throw httpError(401);
    }
    res.json({ status: 'success' });
}

module.exports = { registration, login, logout, userUpdate };