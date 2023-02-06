const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const multerConfig = multer.diskStorage({
  destination: path.join(__dirname, '../', 'temp'),
    filename: (req, file, cb) => {
        const [, extension] = file.mimetype.split('/');
        const newImageName = `${uuidv4()}.${extension}`;
        cb(null, newImageName);
    },
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/png" || 
    file.mimetype === "image/jpg"|| 
    file.mimetype === "image/jpeg"){
        cb(null, true);
    }
    else{
        cb('Unsupported image format', false);
    }
 }

const upload = multer({
    storage: multerConfig,
    fileFilter,
    limits: { fileSize: 2097152}
});

module.exports = { upload };