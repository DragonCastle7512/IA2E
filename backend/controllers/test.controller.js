const { Member } = require("../models");
const { Router } = require("express");
const router = Router();

/* api/test */
router.get('/test', async (req, res) => {
    const members = await Member.findAll()
    res.json(members);
});
module.exports = router