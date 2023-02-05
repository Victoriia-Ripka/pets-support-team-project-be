const multer = require("multer");
const path = require("path");

const multerConfig = multer.diskStorage({
  destination: path.join(__dirname, '../', 'temp'),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
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
    limits: { fileSize: 2097152}
});

module.exports = { upload };
