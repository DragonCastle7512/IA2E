import { post } from "./api-layer.js";
import { renderRecentChat } from "./ui/menu-utils.js";
import { appendMessage, setupAutoResize, setupClickHandler, setupToggle } from "./ui/ui-handler.js";

let selectedChat = null;
export function setSelectedChat(chatId) {
    selectedChat = chatId;
}

document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('promptInput');
    const resultOutput = document.getElementById('resultOutput');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const sidebar = document.querySelector('.sidebar');
    const menuButton = document.querySelector('.menu-button');
    const conversationList = document.getElementById('conversationList');

    const API_ENDPOINT = 'http://localhost:3000/api';

    let streaming = false;

    setupAutoResize(promptInput)
    setupClickHandler(promptInput, streaming, handleSend)
    setupToggle(menuButton, sidebar)
    renderRecentChat(conversationList);

    async function handleSend() {
        const prompt = promptInput.value.trim();

        if (!prompt) {
            alert('질문을 입력해주세요.');
            return;
        }
        // 사용자 질의 추가
        appendMessage(prompt);

        // 첫 메세지라면 채팅 생성
        if(selectedChat === null) {
            const chat = await post("/chat/save", {
                member_id: "f4063d69-33e8-4f04-81f4-50da201a98b1",
                title: (prompt.length < 15) ? prompt : prompt.substring(0, 15)+"..."
            })
            selectedChat = chat.id
        }
        //사용자 메세지 추가
        const userMessage = await post("/message/save", {
            chat_id: selectedChat,
            is_user: true,
            content: prompt
        })
        // console.log(userMessage);

        streaming = true;
        promptInput.value = '';
        promptInput.style.height = 'auto';
        loadingIndicator.classList.remove('hidden');
        
        // AI 응답 추가
        let aiMessageDiv = appendMessage('생각 중...', false, true);
        try {
            const response = await fetch(API_ENDPOINT+"/fetch", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API 요청 실패: ${response.status} - ${errorText.substring(0, 100)}...`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            resultOutput.style.color = 'black';
            // 실시간 스트리밍
            while (true) {
                const { done, value } = await reader.read();
                // 개별 라인 기준으로 화면에 누적
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                fullContent += chunk;   
                aiMessageDiv.innerHTML = DOMPurify.sanitize(marked.parse(fullContent));
                // prism.js가 인식할 태그만 부분적으로 수정
                const codeElements = aiMessageDiv.querySelectorAll('code[class*="language-"]');
                codeElements.forEach(codeElement => {
                    Prism.highlightElement(codeElement, false);
                });
                resultOutput.scrollTop = resultOutput.scrollHeight;
            }
            aiMessageDiv.classList.remove('streaming');

            const aiMessage = await post("/message/save", {
                chat_id: selectedChat,
                is_user: false,
                content: fullContent
            })
            // console.log(aiMessage)
            //Prism.highlightAll();
        } catch (error) {
            resultOutput.textContent = `오류 발생: ${error.message}. 서버 로그를 확인해주세요.`;
            resultOutput.style.color = 'red';
        } finally {
            loadingIndicator.classList.add('hidden');
            streaming = false;
        }
    }
});