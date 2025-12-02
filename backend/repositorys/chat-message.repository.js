class ChatMessageRepository {
    constructor(ChatMessage) {
        this.ChatMessage = ChatMessage;
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