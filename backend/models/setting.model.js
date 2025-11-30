module.exports = (sequelize, DataTypes) => {
    const Setting = sequelize.define('Setting', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        member_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true 
        },
        theme: {
            type: DataTypes.STRING(50),
            defaultValue: 'light'
        },
        chat_color: {
            type: DataTypes.STRING(50),
            defaultValue: '#e9e9e9b4'
        },
        personal_ai: {
            type: DataTypes.JSONB
        }
    }, {
        tableName: 'SETTING',
        timestamps: true,
        underscored: true
    });

    Setting.associate = (models) => {
        models.Setting.belongsTo(models.Member, { foreignKey: 'member_id', onDelete: 'CASCADE' });
    };

    return Setting;
}