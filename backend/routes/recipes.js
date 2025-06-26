const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

router.post('/generate', async (req, res) => {
    const { mood, energy, time } = req.body;

    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'tngtech/deepseek-r1t-chimera:free', // You can also use other free models listed on OpenRouter
                messages: [
                    {
                        role: 'user',
                        content: `List 3 vegetarian or vegan recipes for someone who is feeling ${mood}, has ${energy} energy, and ${time} cooking time. Directly start with the recipes. Include recipe names, ingredients, steps, and cooking time. No introduction or extra comments.`

                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'http://localhost:3000', // ✅ Add your frontend URL here
                    'X-Title': 'Feel Good Recipes App',
                    'Content-Type': 'application/json'
                }
            }
        );

        const recipesText = response.data.choices[0]?.message?.content || 'No recipes generated';
        res.json({ recipes: recipesText });

    } catch (error) {
        console.error('Error generating recipes:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate recipes' });
    }
});

module.exports = router;
