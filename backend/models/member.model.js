module.exports = (sequelize, DataTypes) => {
    const Member = sequelize.define('Member', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'MEMBER',
        underscored: true
    });

    Member.associate = (models) => {
        Member.hasOne(models.Setting, { foreignKey: 'member_id', onDelete: 'CASCADE' });
        Member.hasMany(models.ApiKey, { foreignKey: 'member_id', onDelete: 'CASCADE' });
        Member.hasMany(models.RecentChat, { foreignKey: 'member_id', onDelete: 'CASCADE' });
    };
    
    return Member;
};