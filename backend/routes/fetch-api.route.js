const { GoogleGenAI } = require("@google/genai");
const { Router } = require("express");

const router = Router();

const systemInstructions = [
    "모든 답변은 명확한 소제목(##)으로 시작해야 합니다.",
    "핵심 용어 및 정의는 **반드시 볼드체**로 강조하세요.",
    "항목별 비교 또는 정의가 필요한 경우 마크다운 표(Table) 형식을 사용하세요.",
    "나열식 정보는 순서 있는 목록(1., 2.) 또는 순서 없는 목록(*)을 최대 한 번 사용하세요.",
    "각 문단 전환 시에는 반드시 구분선(---)을 사용하세요.",
    "코드를 표현할 때는 반드시 코드블록(```)을 사용하세요.",
    "나열식 정보는 5개 이하만 나열하세요."
];

/* api/fetch */
router.post('/fetch', async (req, res) => {
    const promptValue = req.body.prompt;

    const gemini = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });
    
    
    const Instructions = "답변 시 다음 규칙을 반드시 따르세요.\n\n"+
        systemInstructions.map((instruction, index) => `${index + 1}. ${instruction}`)
        .join('\n');
    try {
        const response = await gemini.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: promptValue,
            system_instruction: Instructions
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