
/* 프롬포트창 shift+Enter 시 높이 자동 조절 */
function setupAutoResize(promptInput) {
    promptInput.addEventListener('input', () => {
        promptInput.style.height = 'auto';
        promptInput.style.height = promptInput.scrollHeight + 'px';
    });
}

/* 버튼 클릭 이벤트 핸들러 */
function setupClickHandler(promptInput, streaming, handleSend) {
    promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !streaming) {
            e.preventDefault();
            handleSend();
        }
    });
}

/* 사이드바 토글 기능 */
function setupToggle(menuButton, sidebar) {
    if (menuButton && sidebar) {
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
}

/* 메세지 블록 추가 */
function appendMessage(text, isUser = true, isStreaming = false) {
    const resultOutput = document.getElementById('resultOutput');
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

/* 메세지 전체 랜더링 */
function renderMessage(messages) {
    document.getElementById('resultOutput').innerHTML = '';
    for (const message of messages) {
        appendMessage(message.content, message.is_user)
    }
}

export { setupAutoResize, setupClickHandler, setupToggle, appendMessage, renderMessage }