const Joi = require('joi');
const phoneSchema = /^\+380[0-9]{9}$/;
const passwordSchema = /^[0-9a-zA-Z]{7,32}$/;
const dateOfBirthSchema = /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/;

const userValidation = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua'] } }).max(40).required(),
        place: Joi.string().min(2).max(30).required(),
        password: Joi.string().min(7).max(32).required().pattern(passwordSchema),
        phone: Joi.string().pattern(phoneSchema).required(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
    return res.status(400).json({ status: validationResult.error.details });
    }
    next();
}

const userUpdateValidation = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30),
        place: Joi.string().min(2).max(30),
        phone: Joi.string().pattern(phoneSchema),
        dateofbirth: Joi.string().pattern(dateOfBirthSchema).allow(""),
        avatarURL: Joi.string(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
    return res.status(400).json({ status: validationResult.error.details });
    }
    next();
}

const noticeValidation = async (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().min(2).max(80).required(),
        name: Joi.string().min(2).max(30),
        place: Joi.string().min(2).max(30).required(),
        dateofbirth: Joi.string().pattern(dateOfBirthSchema).allow(""),
        breed: Joi.string().min(2).max(30),
        price: Joi.string().min(1).max(12),
        sex: Joi.boolean().required(),
        comments: Joi.string().min(0).max(800),
        category: Joi.string().required().valid('sell', 'lost-found', 'in-good-hands')
    })

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
    return res.status(400).json({ status: validationResult.error.details });
    }
    next();
}

module.exports = { userValidation, userUpdateValidation, noticeValidation };