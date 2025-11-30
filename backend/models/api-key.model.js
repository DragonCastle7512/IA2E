module.exports = (sequelize, DataTypes) => {
    const ApiKey = sequelize.define('ApiKey', {
        id: {
            type: DataTypes.UUID,
            defaultValue: sequelize.literal('gen_random_uuid()'),
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
        create_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('NOW()'),
            allowNull: false
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'active',
            allowNull: false
        }
    }, {
        tableName: 'API_KEY',
        timestamps: false,
        underscored: true
    });
    ApiKey.associate = (models) => {
        models.ApiKey.belongsTo(models.Member, { foreignKey: 'member_id', onDelete: 'CASCADE' });
    };

    return ApiKey
}