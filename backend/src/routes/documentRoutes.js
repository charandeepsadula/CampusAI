const express = require("express");
const multer = require("multer");

const {
  uploadDocument,
  getDocuments,
} = require("../controllers/documentController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

router.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("file"),
  uploadDocument
);

router.get(
  "/",
  protect,
  adminOnly,
  getDocuments
);

module.exports = router;