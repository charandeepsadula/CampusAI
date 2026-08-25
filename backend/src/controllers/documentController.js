const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const Document = require("../models/Document");

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const filePath = path.resolve(req.file.path);
    const fileBuffer = fs.readFileSync(filePath);

    const pdfData = await pdfParse(fileBuffer);

    const document = await Document.create({
      title: req.body.title || req.file.originalname.replace(".pdf", ""),
      filename: req.file.originalname,
      content: pdfData.text,
      uploadedBy: req.user.id,
    });

    fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      message: "PDF uploaded successfully",
      document: {
        id: document._id,
        title: document.title,
        filename: document.filename,
      },
    });
  } catch (error) {
    console.error("Document upload error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload PDF",
      error: error.message,
    });
  }
};

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .select("-content")
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
      error: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
};