const Joi = require('joi');

const userValidation = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua'] } }).required(),
        place: Joi.string().min(2).max(50).required(),
        password: Joi.string().min(6).max(32).required(),
        phone: Joi.string().pattern(/(?=.*\+[0-9]{3}\s?[0-9]{2}\s?[0-9]{3}\s?[0-9]{4}$)/).required(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
    return res.status(400).json({ status: validationResult.error.details });
    }
    next();
}

const userUpdateValidation = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50),
        place: Joi.string().min(2).max(50),
        phone: Joi.string().pattern(/(?=.*\+[0-9]{3}\s?[0-9]{2}\s?[0-9]{3}\s?[0-9]{4}$)/),
        dateofbirth: Joi.string().pattern(/^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/).allow(""),
        avatarURL: Joi.string(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
    return res.status(400).json({ status: validationResult.error.details });
    }
    next();
}

module.exports = { userValidation, userUpdateValidation };