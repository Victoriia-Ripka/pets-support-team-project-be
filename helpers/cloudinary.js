const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const { CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env

cloudinary.config({
    secure: true,
    cloud_name: CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

// console.log(cloudinary.config());

const uploadImage = async (imagePath, width, height) => {
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      eager: [{width: width, height: height}]
    };

    try {
      const result = await cloudinary.uploader.upload(imagePath, options);
      return result.secure_url;
    } catch (error) {
      console.error(error);
    }
};

const removeImage = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        console.error(error);
    }
}

module.exports = { uploadImage, removeImage }