module.exports = (sequelize, DataTypes) => {
    const ChatMessage = sequelize.define('ChatMessage', {
        id: {
            type: DataTypes.UUID,
            defaultValue: sequelize.literal('gen_random_uuid()'),
            primaryKey: true
        },
        chat_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        is_user: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT
        },
        create_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('NOW()')
        }
    }, {
        tableName: 'CHAT_MESSAGE',
        timestamps: false,
        underscored: true
    });

    ChatMessage.associate = (models) => {
        models.ChatMessage.belongsTo(models.RecentChat, { foreignKey: 'chat_id', onDelete: 'CASCADE' });
    };

    return ChatMessage
}