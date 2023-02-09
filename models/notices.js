const mongoose = require('mongoose');

const dateOfBirthSchema = /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/;

const noticesSchema = new mongoose.Schema({
    title: { type: String, required: true },
    name: { type: String },
    dateofbirth: { type: String, formData: dateOfBirthSchema},
    breed: { type: String },
    place: { type: String, required: true },
    price: { type: String, required: true },
    sex: { type: Boolean, required: true },
    comments: { type: String },
    category: { type: String, enum: ['sell', 'lost-found', 'in-good-hands'], default: 'sell', required: true },
    avatarURL: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
},
    { timestamps: true })

const Notices = mongoose.model('notices', noticesSchema)

module.exports = {Notices}