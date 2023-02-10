var jwt = require('jsonwebtoken');
const { httpError } = require('../helpers');
const { User } = require('../models/user');

const authMiddleware = async (req, res, next) => {
    const { authorization: auth = '' } = req.headers;
    const [tokenType, token] = auth.split(' ');
    if (!token) {
        next(httpError(401))
    }
    if (tokenType !== 'Bearer') {
        next(httpError(401))
    }

    try {
        const user = jwt.decode(token, process.env.JWT_SECRET);
        const userExists = await User.findById(user._id);
        if (!userExists || !userExists.token || String(token) !== String(userExists.token)) {
            next(httpError(401));
        }
        req.token = token;
        req.user = userExists;
        next();
    } catch (error) {
        next(httpError(401));
    }
}

module.exports = { authMiddleware };