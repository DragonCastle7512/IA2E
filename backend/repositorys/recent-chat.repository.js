class RecentChatRepository {
    constructor(RecentChat) {
        this.RecentChat = RecentChat;
    }

    async findAllChat(member_id) {
        return await this.RecentChat.findAll({
            where: {
                member_id: member_id
            },
            order: [['date', 'DESC']]
        });
    }

    async createChat(chat) {
        const newChat = await this.RecentChat.create({
            member_id: chat.member_id,
            title: chat.title
        });
        return newChat.toJSON(); 
    }
}
module.exports = RecentChatRepository;