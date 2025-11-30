module.exports = (sequelize, DataTypes) => {
    const RecentChat = sequelize.define('RecentChat', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        member_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        chats: {
            type: DataTypes.JSONB,
            allowNull: false
        }
    }, {
        tableName: 'RECENT_CHAT',
        timestamps: false,
        underscored: true
    });

    RecentChat.assocate = (models) => {
        models.RecentChat.belongsTo(models.Member, { foreignKey: 'member_id', onDelete: 'CASCADE' });
    };

    return RecentChat
}