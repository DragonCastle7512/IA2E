class ChatMessageRepository {
    constructor(ChatMessage) {
        this.ChatMessage = ChatMessage;
    }

    async findAllMessageById(chatId) {
        const messages = await this.ChatMessage.findAll({
            where: {
                chat_id: chatId
            }, 
            order: [['create_at', 'ASC']],
            raw: true
        });
        return messages;
    }
    
    async findRecentMessage(chatId) {
        const messages = await this.ChatMessage.findAll({
            where: { 
                chat_id: chatId
            },
            order: [['create_at', 'DESC']],
            limit: 10,
            attributes: ['is_user', 'content'],
            raw: true
        });
        return messages;
    }

    async createMessage(message) {
        const newMessage = await this.ChatMessage.create({
            chat_id: message.chat_id,
            is_user: message.is_user,
            content: message.content
        });
        return newMessage.toJSON(); 
    }
}
module.exports = ChatMessageRepository;