const { Schema, model } = require("mongoose");
const {handleMongooseError} = require("../helpers/");


const serviceSchema = Schema({
     id: {
      type: String,
    },
    title: {
      type: String,
    },
    url: {
      type: String,
    },
    addressUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    address: {
      type: String,
    },
    workDays: {
      type: Array,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    }
}, { versionKey: false, timestamps: true });

serviceSchema.post("save",handleMongooseError);

const Service = model("service", serviceSchema);

module.exports = {
    Service
}