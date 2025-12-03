import { get } from "../api-layer.js";
import { setSelectedChat } from "../script.js";
import { renderMessage } from "./ui-handler.js";

/* 최근 대화 목록 불러오기 */
async function renderRecentChat() {
    const conversationList = document.getElementById('conversationList');
    const chats = await get('/chats');
    conversationList.innerHTML = '';
    if(!chats || chats.length <= 0) return;
    setSelectedChat(chats[0].id);

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
    selectItem(id);
}

/* 선택된 메뉴 색상 변경 */
function markedSelectedItem(id) {
    setSelectedChat(id);
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if(id === null) return;
    document.querySelector(`[data-id="${id}"]`).classList.add('active');
}

/* 메뉴 선택 */
async function selectItem(id) {
    if(id === null) return;
    markedSelectedItem(id);
    const messages = await get(`/messages?id=${id}`);
    renderMessage(messages);
}

/* 새 채팅 클릭 시 페이지 초기화 */
function setupNewChatButton() {
    const newChatButton = document.getElementById('newChatButton');
    newChatButton.addEventListener('click', (e) => {
        document.getElementById('resultOutput').innerHTML = '';
        markedSelectedItem(null);
    })
}

export { renderRecentChat, handleConversationClick, setupNewChatButton, markedSelectedItem, selectItem }