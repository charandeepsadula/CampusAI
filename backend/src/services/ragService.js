const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getEmbedding = async (text) => {
  const model = genAI.getGenerativeModel({
    model: "text-embedding-004",
  });

  const result = await model.embedContent(text);

  return result.embedding.values;
};

const generateAnswer = async (question, context) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
  });

  const prompt = `
You are CampusAI, a college information assistant.

Answer the student's question using ONLY the information provided in the context below.

Rules:
- Do not invent information.
- Do not use outside knowledge.
- If the answer is not available in the context, say:
"I couldn't find this information in the college knowledge base."
- Keep the answer clear and concise.
- Use bullet points when useful.

COLLEGE KNOWLEDGE BASE:
${context}

STUDENT QUESTION:
${question}

ANSWER:
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};

module.exports = {
  getEmbedding,
  generateAnswer,
};