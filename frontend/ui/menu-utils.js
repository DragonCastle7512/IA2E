import { get } from "../api-layer.js";
import { setSelectedChat } from "../script.js";
import { renderMessage } from "./ui-handler.js";

/* 최근 대화 목록 불러오기 */
async function renderRecentChat(conversationList) {
    const chats = await get('/chats');
    conversationList.innerHTML = '';

    for (const chat of chats) {
        const dateObj = new Date(chat.date);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const formattedDate = `${year}.${month}.${day}`;
        
        const listItem = document.createElement('li');
        listItem.classList.add('conversation-item');
        
        listItem.dataset.id = chat.id;
        listItem.addEventListener('click', handleConversationClick)

        const titleSpan = document.createElement('span');
        titleSpan.classList.add('title');
        
        titleSpan.textContent = chat.title; 

        const dateSpan = document.createElement('span');
        dateSpan.classList.add('date');
        dateSpan.textContent = formattedDate;

        listItem.appendChild(titleSpan);
        listItem.appendChild(dateSpan);
        
        conversationList.appendChild(listItem);
    }
}

/* 클릭한 채팅 선택 */
async function handleConversationClick(event) {
    const clickedItem = event.target.closest('.conversation-item'); 
    
    if (!clickedItem) return;
    
    const id = clickedItem.dataset.id;
    setSelectedChat(id);
    
    const messages = await get(`/messages?id=${id}`);
    renderMessage(messages)

    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    clickedItem.classList.add('active');
}

export { renderRecentChat, handleConversationClick }