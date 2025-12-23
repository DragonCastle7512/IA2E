const { GoogleGenAI } = require("@google/genai");
const { Router } = require("express");

const router = Router();

const systemInstructions = [
    "# [출력 형식 규칙]",
    "1. 모든 답변은 소제목(##)으로 시작할 것",
    "2. 각 문단 사이에는 반드시 '---' 구분선을 넣을 것.",
    "3. 핵심 용어는 **볼드체**로, 코드는 ``` 코드블록으로 감쌀 것.",
    "4. 나열 항목은 반드시 5개 이하로 제한하며, 목록 서식(* 또는 1.)은 전체 답변에서 딱 한 번만 사용할 것.",
    "5. 비교나 정의가 필요하면 무조건 마크다운 표(Table)를 사용할 것."
];

/* api/fetch */
router.post('/fetch', async (req, res) => {
    const { prompt } = req.body;
    console.log(prompt)

    const gemini = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });
    const Instructions = 
        systemInstructions.map((instruction) => instruction)
        .join('\n');
    try {
        const response = await gemini.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: prompt,
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