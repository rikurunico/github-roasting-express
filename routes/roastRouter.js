const express = require('express');
const router = express.Router();
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

router.post('/roast', async (req, res) => {
    const { username } = req.query;
    const { jsonData, README } = req.body;

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ];

    try {
        const input = `Username: ${username}\nProfile Data: ${JSON.stringify(jsonData, null, 2)}\nREADME: ${README}\n
        Coba roasting data diri saya dari data yang saya lampirkan di atas,\n
        langsung return 1 data saja ya dengan key roasting, Gunakan Bahasa Indonesia, Respon Tidak sopan tidak apa apa, Terima kasih.`;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
        };

        const chatSession = model.startChat({
            generationConfig,
            safetySettings,
            history: [],
        });

        console.log('Sending message to AI...');

        const result = await chatSession.sendMessage(input);
        const roasting = result.response.text();

        let parsedRoasting = JSON.parse(roasting);

        res.json(parsedRoasting);

    } catch (error) {
        console.error("Error in AI roasting:", error);
        res.status(500).json({ error: 'Internal Server Error', type: 'Server' });
    }
});

module.exports = router;
