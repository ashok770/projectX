const { GoogleGenerativeAI } = require("@google/generative-ai");

// Make sure your .env has GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getSemanticMatch = async (lostItem, foundItem) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a Campus Lost & Found Assistant. 
      Compare these two items and determine if they are likely the same object.
      
      Item 1 (Lost): "${lostItem.itemName}" at "${lostItem.location}". Description: "${lostItem.description}"
      Item 2 (Found): "${foundItem.itemName}" at "${foundItem.location}". Description: "${foundItem.description}"
      
      Return ONLY a JSON object with a 'score' (0-100) and a brief 'reason' (max 10 words).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("AI Match Error:", error);
    return { score: 0, reason: "AI matching unavailable" };
  }
};

module.exports = { getSemanticMatch };
