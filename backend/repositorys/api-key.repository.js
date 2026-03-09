class ApiKeyRepository {
    constructor(ApiKeyRepository) {
        this.ApiKeyRepository = ApiKeyRepository;
    }

    async upsertApiKey(key, keyType, id) {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        try {
            await this.ApiKeyRepository.upsert({
                member_id: id,
                key: key,
                key_type: keyType,
                expires_at: date
            }, {
                /* 두 칼럼 조합 겹칠 때 수정 */
                conflictFields: ['member_id', 'key_type']
            })
            return true;
        } catch(err) {
            console.log(err)
            return false;
        }
    }
    async findAllKeys(id) {
        try {
            return await this.ApiKeyRepository.findAll({
                where: { member_id: id },
                attributes: ['key_type', 'key'],
                order: [['key_type', 'ASC']],
            })
        } catch(err) {
            console.log(err);
        } 
    }
}

module.exports = ApiKeyRepository;
