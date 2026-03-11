module.exports = (sequelize, DataTypes) => {
    const Setting = sequelize.define('Setting', {
        id: {
            type: DataTypes.UUID,
            defaultValue: sequelize.literal('gen_random_uuid()'),
            primaryKey: true
        },
        member_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true 
        },
        theme: {
            type: DataTypes.STRING(20),
            defaultValue: 'light'
        },
        chat_color: {
            type: DataTypes.STRING(20),
            defaultValue: 'gray'
        },
        personal_ai: {
            type: DataTypes.TEXT
        },
        ai_model: {
            type: DataTypes.STRING(10),
            defaultValue: 'gemini'
        },
        gemini_model: {
            type: DataTypes.STRING(30),
            defaultValue: 'gemini-2.5-flash'
        },
        mistral_model: {
            type: DataTypes.STRING(30),
            defaultValue: 'mistral-large-latest'
        }
    }, {
        tableName: 'SETTING',
        timestamps: false,
        underscored: true
    });

    Setting.associate = (models) => {
        models.Setting.belongsTo(models.Member, { foreignKey: 'member_id', onDelete: 'CASCADE' });
    };

    return Setting;
}