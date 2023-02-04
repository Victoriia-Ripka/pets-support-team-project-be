const mongoose = require('mongoose');

const noticesSchema = new mongoose.Schema({
    email: { type: String, required: [true, 'Email is required'], unique: true },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    dateofbirth: {type: Date, required: true},
    breed: { type: String, required: true },
    place: { type: String, required: true },
    sex: { type: Boolean, required: true },
    comments: { type: String },
    category: { type: String, enum: ['sell', 'lost-found', 'in-good-hands'], default: 'sell' },
    imageUrl: { type: Boolean, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
},
    { timestamps: true })

const Notices = mongoose.model('notices', noticesSchema)

module.exports = {Notices}