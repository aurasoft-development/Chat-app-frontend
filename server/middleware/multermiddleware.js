const multer = require("multer");
 
const multerStorage = multer.diskStorage({
 
  destination: (req, file, cb) => {
    // Get the type of file.
    const ext = file.mimetype.split("/")[0];
    if (ext === "image") {
        // if type is image then store in images folder
      cb(null, "uploads");
    } else {
        // In case of not an image store in others
      cb(null, "uploads");
    }
  },
  filename: (req, file, cb) => {
    // Combine the Date in milliseconds and original name and pass as filename
    cb(null, `${Date.now()}.${file.originalname}`);
  },
});
 
// Use diskstorage option in multer
const upload = multer({ storage: multerStorage });

module.exports = upload