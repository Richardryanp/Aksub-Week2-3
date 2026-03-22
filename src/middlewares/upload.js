// Import multer buat handle upload file
const multer = require("multer");
// Import path buat ngatur nama file
const path = require("path");

// Setting storage buat file yang diupload
const storage = multer.diskStorage({
  // Folder tujuan upload
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Semua file masuk ke folder uploads
  },

  // Bikin nama file unik pake timestamp + ekstensi asli
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname); // Contoh: 1643213123.jpg
    cb(null, uniqueName);
  }
});

// Bikin instance upload pake storage yang udah diatur
const upload = multer({ storage });

// Export upload biar bisa dipake di route
module.exports = upload;