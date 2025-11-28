const { GoogleGenAI } = require("@google/genai");
const { Router } = require("express");

const router = Router();

/* api/fetch */
router.post('/fetch', async (req, res) => {
    const promptValue = req.body.prompt;
    
    const gemini = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    try {
        const response = await gemini.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: promptValue,
            system_instruction: "짧게 답변합니다."
        });
        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked'
        });

        for await (const chunk of response) {
            res.write(chunk.text); 
        }

        res.end();
    } catch (error) {
        console.error("Gemini API 호출 중 오류 발생:", error);
        if (!res.headersSent) {
             res.status(500).send("Gemini API 호출에 실패했습니다.");
        } else {
             res.end();
        }
    }
})

module.exports = router