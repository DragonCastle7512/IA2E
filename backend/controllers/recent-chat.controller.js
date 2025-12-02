const { RecentChat } = require("../models");

const { Router } = require("express");
const RecentChatRepository = require("../repositorys/recent-chat.repository");
const router = Router();

const chatRepositoy = new RecentChatRepository(RecentChat);

/* api/chat/save */
router.post('/chat/save', async (req, res) => {
    const r = req.body
    //f4063d69-33e8-4f04-81f4-50da201a98b1
    const data = {
	    member_id: r.member_id,
	    title: r.title,
	};
    const response = await chatRepositoy.createChat(data);
    res.status(201).json(response);
});

module.exports = router