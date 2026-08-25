const Document = require("../models/Document");
const { generateAnswer } = require("../services/ragService");

const chat = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const documents = await Document.find().select(
      "title filename content"
    );

    if (!documents.length) {
      return res.status(404).json({
        success: false,
        message: "No documents found",
      });
    }

    const context = documents
      .map(
        (doc) =>
          `SOURCE: ${doc.title}
FILENAME: ${doc.filename}
CONTENT:
${doc.content}`
      )
      .join("\n\n----------------------\n\n");

    const answer = await generateAnswer(question, context);

    res.json({
      success: true,
      question,
      answer,
      sources: documents.map((doc) => ({
        title: doc.title,
        filename: doc.filename,
      })),
    });
  } catch (error) {
    console.error("Chat error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate answer",
      error: error.message,
    });
  }
};

module.exports = {
  chat,
};