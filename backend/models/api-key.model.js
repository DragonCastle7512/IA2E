module.exports = (sequelize, DataTypes) => {
    const ApiKey = sequelize.define('ApiKey', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        member_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        key: {
            type: DataTypes.TEXT,
            unique: true,
            allowNull: false
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING(50),
            defaultValue: 'active',
            allowNull: false
        }
    }, {
        tableName: 'API_KEY',
        timestamps: true,
        underscored: true
    });
    ApiKey.associate = (models) => {
        models.ApiKey.belongsTo(models.Member, { foreignKey: 'member_id', onDelete: 'CASCADE' });
    };

    return ApiKey
}