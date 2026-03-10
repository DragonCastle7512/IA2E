const { GoogleGenAI } = require("@google/genai");
const { Mistral } = require('@mistralai/mistralai');
const { Router } = require("express");
const router = Router();

const { decrypt } = require("../utils/crypt-encoder");
const { ChatMessage, ApiKey } = require("../models");
const ChatMessageRepository = require("../repositorys/chat-message.repository");
const messageRepositoy = new ChatMessageRepository(ChatMessage);
const ApiKeyRepository = require("../repositorys/api-key.repository");
const apiKeyRepository = new ApiKeyRepository(ApiKey);

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

async function callGeminiChat(key, info, res) {
    const gemini = new GoogleGenAI({ apiKey: key });

    const formattedHistory = info.history
        .reverse()
        .map(msg => ({
            role: msg.is_user ? 'user' : 'model', 
            parts: [{ text: msg.content }]
        }));
    const current = {
        role: 'user',
        parts: [{ text: info.prompt }]
    }
    try {
        //model: gemini-2.5-flash gemini-3-flash-preview gemini-3.1-flash-lite-preview
        const response = await gemini.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: [...formattedHistory, current],
            config: {
                systemInstruction: info.systemInstruction
            }
        });

        for await (const chunk of response) {
            res.write(chunk.text); 
        }

        return { ok: true };
    } catch(err) {
        return { ok: false };
    }
}

async function callMistralChat(key, info, res) {
    const mistral = new Mistral({ apiKey: key });
    const formattedHistory = info.history
        .reverse()
        .filter(msg => msg.content && String(msg.content).trim().length > 0) 
        .map(msg => ({
            role: msg.is_user ? 'user' : 'assistant',
            content: String(msg.content).trim()
        }));

    const current = {
        role: 'user',
        content: info.prompt
    };

    const mistralSystemContent = info.systemInstruction.parts
    .map(part => part.text)
    .join('\n');

    const systemMessage = {
        role: "system",
        content: mistralSystemContent
    };

    try {
        const response = await mistral.chat.stream({
            model: "mistral-small-latest",
            messages: [systemMessage, ...formattedHistory, current],
        });

        for await (const chunk of response) {
            const content = chunk.data.choices[0]?.delta?.content || "";
            //console.log(chunk.choices[0].delta.content);
            if (content) {
                res.write(content);
            }
        }
    }
    catch(err) {
        console.log(err);
    }
}

/* api/fetch */
router.post('/fetch', async (req, res) => {
    const { myInstruction, prompt, chatId } = req.body;

    const keys = await apiKeyRepository.findAllKeys(req.user.id);
    try {
        const history = await messageRepositoy.findRecentMessage(chatId);
        const newSystemInstructions = {...systemInstructions, parts:[...systemInstructions.parts, { text: myInstruction }]}
        const info = {
            history: history,
            systemInstruction: newSystemInstructions,
            prompt: prompt
        };

        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked'
        });
        const status = await callGeminiChat(decrypt(keys[0].key), info, res);
        if(!status.ok) {
            console.log('gemini key 유효하지 않음');
            await callMistralChat(decrypt(keys[1].key), info, res);
        }
        
    } catch (error) {
        console.error("Gemini API 호출 중 오류 발생:", error);
        res.write('호출 중 오류가 발생했습니다.');
    }
    res.end();
})

module.exports = router