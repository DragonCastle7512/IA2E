class SettingRepository {
    constructor(Setting) {
        this.Setting = Setting
    }

    async updatePersonalAI(value, id) {
        return await this.Setting.update(
            { personal_ai: value },
            { where: { member_id: id } }
        )
    }

    async findSetting(id) {
        return await this.Setting.findAll({
            where: { member_id: id }
        })
    }
}

module.exports = SettingRepository;