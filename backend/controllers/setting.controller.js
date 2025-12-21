const { Router } = require("express");
const SettingRepository = require("../repositorys/setting.repository");
const { Setting } = require("../models");
const router = Router();

const settingRepository = new SettingRepository(Setting);

/* api/setting/personal_ai */
router.put('/setting/personal_ai', async (req, res) => {
    const r = req.body;
    const response = await settingRepository.updatePersonalAI(r.value, req.user.id);
    res.status(200).json(response);
})

/* api/setting */
router.get('/setting', async (req, res) => {
    const response = await settingRepository.findSetting(req.user.id);
    res.status(200).json(response);
})

module.exports = router