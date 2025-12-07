const { RecentChat } = require("../models");

const { Router } = require("express");
const RecentChatRepository = require("../repositorys/recent-chat.repository");
const router = Router();

const chatRepositoy = new RecentChatRepository(RecentChat);

/* api/chats */
router.get('/chats', async (req, res) => {
    const response = await chatRepositoy.findAllChat(req.user.id);
    res.status(200).json(response);
});

/* api/chat/save */
router.post('/chat/save', async (req, res) => {
    const r = req.body
    const data = {
	    member_id: req.user.id,
	    title: r.title,
	};
    const response = await chatRepositoy.createChat(data);
    res.status(201).json(response);
});

module.exports = router