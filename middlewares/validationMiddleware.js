const Joi = require('joi');

const userValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua'] } }).required(),
        place: Joi.string().min(2).max(50).required(),
        password: Joi.string().min(6).max(32).required(),
        phone: Joi.string().pattern(/(?=.*\+[0-9]{3}\s?[0-9]{2}\s?[0-9]{3}\s?[0-9]{4}$)/).required(),
    });

    const validationResult = schema.validate(req.body);
    console.log(validationResult);
    if (validationResult.error) {
    return res.status(400).json({ status: validationResult.error.details });
    }
    next();
}

module.exports = { userValidation };