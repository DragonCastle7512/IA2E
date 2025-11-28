document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('promptInput');
    const resultOutput = document.getElementById('resultOutput');
    const loadingIndicator = document.getElementById('loadingIndicator');

    const API_ENDPOINT = 'http://localhost:3000/api/fetch';

    /* 프롬포트창 shift+Enter 시 높이 자동 조절 */
    promptInput.addEventListener('input', () => {
        promptInput.style.height = 'auto';
        promptInput.style.height = promptInput.scrollHeight + 'px';
    });

    /* 버튼 클릭 이벤트 핸들러 */
    promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    /* 사이드바 토글 기능 */
    const sidebar = document.querySelector('.sidebar');
    const menuButton = document.querySelector('.menu-button'); 
    if (menuButton && sidebar) {
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    /* 메세지 블록 추가 */
    function appendMessage(text, isUser = true, isStreaming = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'system-message');
        
        if (!isUser) {
            if (isStreaming) {
                messageDiv.classList.add('streaming');
                messageDiv.innerHTML = '<span class="typing-indicator">생각 중...</span>';
            } else {
                messageDiv.innerHTML = DOMPurify.sanitize(marked.parse(text));
            }
        }
        else {
            messageDiv.textContent = text;
        }

        resultOutput.appendChild(messageDiv);
        resultOutput.scrollTop = resultOutput.scrollHeight;
        return messageDiv;
    }
    
    async function handleSend() {
        const prompt = promptInput.value.trim();

        if (!prompt) {
            alert('질문을 입력해주세요.');
            return;
        }
        // 사용자 질의 추가
        appendMessage(prompt);
        promptInput.value = '';
        promptInput.style.height = 'auto';
        loadingIndicator.classList.remove('hidden');
        
        // AI 응답 추가
        let aiMessageDiv = appendMessage('생각 중...', false, true);
        try {
            const response = await fetch(API_ENDPOINT, {
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
                resultOutput.scrollTop = resultOutput.scrollHeight;
            }
            aiMessageDiv.classList.remove('streaming');
        } catch (error) {
            resultOutput.textContent = `오류 발생: ${error.message}. 서버 로그를 확인해주세요.`;
            resultOutput.style.color = 'red';
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    }
});