const multer = require("multer");

module.exports = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/");
    },
    filename: function (req, file, cb) {
      cb(null, `${new Date().valueOf()}_${file.originalname}`);
    },
  }),
});
