class RecentChatRepository {
    constructor(RecentChat) {
        this.RecentChat = RecentChat;
    }

    async findAllChat() {
        return await this.RecentChat.findAll();
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