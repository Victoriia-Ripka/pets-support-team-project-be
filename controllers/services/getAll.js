const {Service} = require("../../models");

const getAll = async (req, res) => {
    const service = await Service.find({});
    res.json({
        status: "success",
        code: 200,
        data: {
            result: service
        }
    });
};

module.exports = getAll;