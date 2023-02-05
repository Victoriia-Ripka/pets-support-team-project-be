var jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const authMiddleware = async (req, res) => {
    const { authorization: auth = '' } = req.headers;
    const [tokenType, token] = auth.split(' ');
    if (!token) {
        // next()
    }
    if (tokenType !== 'Bearer') {
        // next()
    }

    try {
        const user = jwt.decode(token, process.env.JWT_SECRET);
        const userExists = await User.findById(user._id);
        if (!userExists || !userExists.token || String(token) !== String(userExists.token)) {
            next()
        }
        req.token = token;
        req.user = userExists;
        next();
    } catch (error) {
        // next();
    }
}

module.exports = { authMiddleware };