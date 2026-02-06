const { ApiKey } = require("../models");
const ApiKeyRepository = require("../repositorys/api-key.repository");

const { Router } = require("express");
const { encrypt, decrypt } = require("../utils/crypt-encoder");
const router = Router();

const apiKeyRepository = new ApiKeyRepository(ApiKey);

/* api/keys */
router.put('/keys', async (req, res) => {
    const { geminiKey: gemini, mistralKey: mistral } = req.body;
    const response = {};
    const entries = Object.entries({ gemini, mistral })
    const keys = await apiKeyRepository.findAllKeys(req.user.id);
    const existingKeys = keys.reduce((acc, row) => {
        acc[row.key_type] = row.key;
        return acc;
    }, {});

    for(const [key, value] of entries) { 
        const existing = existingKeys[key];
        const decrypted = existing ? decrypt(existing) : null;
        if(!value) {
            response[key] = existing ? decrypted.substring(0, 5) + "•".repeat(Math.max(0, decrypted.length - 5)) : '키를 입력해주세요';
            continue;
        }
        if(value.length < 25) {
            response[key] = existing ? decrypted.substring(0, 5) + "•".repeat(Math.max(0, decrypted.length - 5)) : '유효하지 않은 키입니다';
            continue;
        }
        const result = await apiKeyRepository.upsertApiKey(encrypt(value), key, req.user.id);
        response[key] = result ? value.substring(0, 5) + "•".repeat(Math.max(0, value.length-5)) : '오류가 발생했습니다';
    };
    res.status(200).json(response);
})

/* api/keys */
router.get('/keys', async (req, res) => {
    const response = await apiKeyRepository.findAllKeys(req.user.id);
    const keys = {};
    response.forEach(e => {
        keys[e.key_type] = ((rawKey) => {
            return rawKey.substring(0, 5) + "•".repeat(Math.max(0, rawKey.length-5));
        })(decrypt(e.key));
    });
    res.status(200).json(keys);
})

module.exports = router;
