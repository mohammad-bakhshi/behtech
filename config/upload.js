import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where files should be stored (e.g., a 'uploads' folder)
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Naming convention: fieldname-timestamp.ext
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

export const upload = multer({
  storage: storage,
  // Optional: Limit file size and type
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Only accept Excel files (.xlsx or .xls)
    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type, only Excel files are allowed!"), false);
  },
});
