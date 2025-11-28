document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('sendButton');
    const promptInput = document.getElementById('promptInput');
    const resultOutput = document.getElementById('resultOutput');
    const loadingIndicator = document.getElementById('loadingIndicator');

    const API_ENDPOINT = 'http://localhost:3000/api/fetch';

    // 버튼 클릭 이벤트 핸들러
    sendButton.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();

        if (!prompt) {
            alert('질문을 입력해주세요.');
            return;
        }

        // 1. UI 상태 업데이트: 버튼 비활성화, 로딩 표시
        sendButton.disabled = true;
        resultOutput.innerHTML = '';
        loadingIndicator.classList.remove('hidden');

        try {
            // 2. Fetch API를 사용하여 백엔드 서버에 요청 (POST)
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt
                })
            });

            // 3. 응답 상태 코드 확인
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
                resultOutput.innerHTML = DOMPurify.sanitize(marked.parse(fullContent));
                resultOutput.scrollTop = resultOutput.scrollHeight;
            }
        } catch (error) {
            console.error('API 통신 중 에러 발생:', error);
            resultOutput.textContent = `오류 발생: ${error.message}. 서버 로그를 확인해주세요.`;
            resultOutput.style.color = 'red';
        } finally {
            sendButton.disabled = false;
            loadingIndicator.classList.add('hidden');
        }
    });
});