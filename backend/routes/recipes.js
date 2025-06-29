// backend/routes/recipes.js
require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate', async (req, res) => {
  const { mood, energy, time } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `List 3 vegetarian or vegan recipes for someone who is feeling ${mood}, has ${energy} energy, and ${time} cooking time. 
    Include recipe names, ingredients, steps, and approximate cooking time. No intro or extra comments.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ recipes: text });
  } catch (err) {
    console.error("🔥 Gemini API error:", err.message);
    res.status(500).json({ error: "Failed to generate recipes with Gemini." });
  }
});

module.exports = router;
