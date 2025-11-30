const { Sequelize, DataTypes } = require('sequelize');

const MemberModel = require('./member.model');
const ApiKeyModel = require('./api-key.model');
const SettingModel = require('./setting.model');
const RecentChatModel = require('./recent-chat.model');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false
});

//관계 매핑
const models = {};
models.sequelize = sequelize;
models.Member = MemberModel(sequelize, DataTypes);
models.ApiKey = ApiKeyModel(sequelize, DataTypes);
models.Setting = SettingModel(sequelize, DataTypes);
models.RecentChat = RecentChatModel(sequelize, DataTypes);

Object.keys(models).forEach(model => {
    if (models[model].associate) {
        models[model].associate(models);
    }
});

models.initializeDatabase = async () => {
    try {
        // DB 연결 테스트
        await models.sequelize.authenticate();
        console.log('✅ DB 연결 성공.');

        // 테이블 동기화 (개발/테스트용)
        await models.sequelize.sync({ force: true });
        console.log('✅ DB 스키마 동기화 완료.');
        
    } catch (error) {
        console.error('❌ DB 초기화 실패! 서버 시작을 중단합니다.', error.stack);
        throw error; 
    }
};

module.exports = { 
    initializeDatabase: models.initializeDatabase, 
    sequelize: models.sequelize,
    ...models
};