const { Member } = require("../models");
const { Router } = require("express");
const router = Router();

/* api/test */
router.get('/test', async (req, res) => {
    res.json({ ok: true });
});
module.exports = router