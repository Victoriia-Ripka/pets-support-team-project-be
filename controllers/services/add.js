const {Service} = require("../../models");

const add = async (req, res) => {
    const result = await Service.create(req.body);
    res.status(201).json({
        status: "success",
        code: 201,
        data: {
           favorite: false,
            ...result            
        }
    })
}

module.exports = add;
