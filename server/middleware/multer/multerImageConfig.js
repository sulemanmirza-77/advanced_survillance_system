/* Profile Image Upload  */
/* Multer for File Upload */
const multer = require("multer");
const path = require("path");

/* Storage specifies where to load the file. It contains two properties named "destination" and "filename".
   This properties have "req, file, callback" parameters. */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const rootDir = path.dirname(require.main.filename);
    cb(null, path.join(rootDir, "public/images"));
  },

  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    req.savedProfileImage = `image_${req.user.id}.${extension}`;
    cb(null, req.savedProfileImage);
  },
});

/* FileFilter specifies which types of files can be uploaded. */
const fileFilter = (req, file, cb) => {
  let allowedMimeTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb("Error", false);
  }
  return cb(null, true);
};

const multerUploadProfileImage = multer({ storage, fileFilter });
module.exports = multerUploadProfileImage;
