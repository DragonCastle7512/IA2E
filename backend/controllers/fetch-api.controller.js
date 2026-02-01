const { GoogleGenAI } = require("@google/genai");
const { Router } = require("express");
const router = Router();

const { ChatMessage } = require("../models");
const ChatMessageRepository = require("../repositorys/chat-message.repository");
const messageRepositoy = new ChatMessageRepository(ChatMessage);

const systemInstructions = {
    role: "system",
    parts: [
        { text: "답변의 핵심은 '간결함'과 '가독성'입니다." },
        { text: "설명은 최대 3개의 문단 이내로 제한하고, 문장은 짧게 끊어서 작성하세요." },
        { text: "소제목(##)은 필요한 경우 1~2개만 사용합니다." },
        { text: "핵심 용어는 **볼드체**로, 코드는 ``` 코드블록으로 감쌉니다." },
        { text: "목록 서식(* 또는 1.)은 반드시 3개 이하만 사용하고, 핵심 키워드 중심의 표(Table)를 선호합니다." },
    ]
};

/* api/fetch */
router.post('/fetch', async (req, res) => {
    const { myInstruction, prompt, chatId } = req.body;

    const gemini = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });
    try {
        const history = await messageRepositoy.findRecentMessage(chatId);
        const formattedHistory = history
            .reverse()
            .map(msg => ({
                role: msg.is_user ? 'user' : 'model', 
                parts: [{ text: msg.content }]
            }));
        const current = {
            role: 'user',
            parts: [{ text: prompt }]
        }
        const newSystemInstructions = {...systemInstructions, parts:[...systemInstructions.parts, { text: myInstruction }]}
        const response = await gemini.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: [...formattedHistory, current],
            system_instruction: newSystemInstructions
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