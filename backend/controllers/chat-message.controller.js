const { ChatMessage } = require("../models");
const ChatMessageRepository = require("../repositorys/chat-message.repository");

const { Router } = require("express");
const router = Router();

const messageRepositoy = new ChatMessageRepository(ChatMessage);

/* api/messages */
router.get('/messages', async (req, res) => {
    const response = await messageRepositoy.findAllMessageById(req.query.id);
    res.status(200).json(response);
});

/* api/message/save */
router.post('/message/save', async (req, res) => {
    const r = req.body;
    const data = {
	    chat_id: r.chat_id,
	    is_user: r.is_user,
	    content: r.content
	};
    
    const response = await messageRepositoy.createMessage(data);
    res.status(201).json(response);
});

module.exports = router