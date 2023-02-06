const fs = require('fs').promises;
const { uploadImage } = require("./cloudinary");
const httpError = require('./httpError');

const createAvatar = async (imagePath, width, height) => {
    if (imagePath) {
        const avatarUrl = await uploadImage(imagePath, width, height);
        await fs.unlink(imagePath);
        if (avatarUrl.error) {
            throw httpError(404, 'Failed to upload avatar');
        }
        return avatarUrl;
    }
}

module.exports = { createAvatar };