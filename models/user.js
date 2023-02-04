const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'] },
    token: { type: String, default: null },
    avatarURL: { type: String, required: true },
    name: { type: String, required: true },
    place: { type: String, required: true },
    phone: { type: String, required: true },
    dateofbirth: {type: Date, required: true}
},
    { timestamps: true }
)

userSchema.pre('save', async function () {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = mongoose.model('user', userSchema);

module.exports = { User };