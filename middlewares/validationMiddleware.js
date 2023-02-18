const Joi = require('joi').extend(require('@joi/date'));
const phoneSchema = /^\+380[0-9]{9}$/;
const passwordSchema = /^[0-9a-zA-Z]{7,32}$/;
const nameRules = /^[aA-zZ\s]+$/;
const regionRules = /^()(\w+(,|\s)\s*)+\w+$/;
const regionRulesOnlyLetters = /^[a-zA-Z\s]{3,},[a-zA-Z\s]{4,}$/;


const userValidation = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).pattern(nameRules),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua'] } }).max(40).required(),
        place: Joi.string().min(2).max(30).pattern(regionRules).pattern(regionRulesOnlyLetters),
        password: Joi.string().min(7).max(32).required().pattern(passwordSchema),
        phone: Joi.string().pattern(phoneSchema),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
    return res.status(400).json({ status: validationResult.error.details });
    }
    next();
}

const userUpdateValidation = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).pattern(nameRules).allow(''),
        place: Joi.string().min(2).max(30).pattern(regionRules).pattern(regionRulesOnlyLetters),
        phone: Joi.string().pattern(phoneSchema).allow(''),
        dateofbirth: Joi.date().format('DD.MM.YYYY').max('now'),
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
        dateofbirth: Joi.date().format('DD.MM.YYYY').max('now'),
        breed: Joi.string().min(2).max(30),
        price: Joi.number().positive(),
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