import { setupAutoResize } from "./ui-handler.js";

let personalAI = "";
let theme = "light";
let color = "gray";
let geminiKey = "";
let mistralKey = "";

document.addEventListener('DOMContentLoaded', () => {
    const apiKeySettingBtn = document.getElementById('apiKeySettingBtn');
    const aiSettingBtn = document.getElementById('aiSettingBtn');
    const themeSettingBtn = document.getElementById('themeSettingBtn');
    const panel = document.getElementById('floatingSettingPanel');
    const content = document.getElementById('panelContentContainer')
    const closeBtn = document.getElementById('closePanelBtn');
    
    const apiKeyTemplate = `
        <h3>API 키 등록</h3>
        <div class="setting-content">
            <div class="input-group-api">
                <div>
                    <label for="geminiApiKey">Gemini</label>
                    <input type="text" id="geminiApiKey" placeholder="Gemini API 키 등록">
                </div>
                <div>
                    <label for="mistralApiKey">Mistral</label>
                    <input type="text" id="mistralApiKey" placeholder="Mistral API 키 등록">
                </div>
            </div>
            <p class="description">본인의 키를 등록하여 AI 서비스를 이용하세요!</p>
        </div>
    `;

    const themeTemplate = `
        <h3>테마 및 색상</h3>
        <div class="setting-content">
            <div class="theme-section">
                <h5>테마</h5>
                <select id="themeSelector">
                    <option value="light">라이트 모드</option>
                    <option value="dark">다크 모드</option>
                </select>
            </div>
            <div class="theme-section">
                <h5>색상</h5>
                <select id="colorSelector">
                    <option value="gray">회색</option>
                    <option value="red">빨강</option>
                    <option value="orange">주황</option>
                    <option value="yellow">노랑</option>
                    <option value="green">초록</option>
                    <option value="blue">파랑</option>
                    <option value="purple">보라</option>
                    <option value="pink">분홍</option>
                </select>
            </div>
            <p class="description">원하는 테마와 색상으로 디자인 하세요!</p>
        </div>
    `;

    const aiCustomTemplate = `
        <h3>맞춤형 AI 설정</h3>
        <div class="setting-content">
            <textarea id="aiCustomInput" rows="1" placeholder="추가적인 요청사항"></textarea>
            <p class="description">요청사항을 입력하여, 응답 방식을 설정하세요!</p>
        </div>
    `;

    function loadPanel(btn, templateString) {
        content.innerHTML = templateString;
        if(selectedPanel === aiSettingBtn) {
            // DOM 조작 이후 Enter시 resize
            setupAutoResize(document.getElementById('aiCustomInput'));
        }
        if (panel.classList.contains('hidden')) {
            const rect = btn.getBoundingClientRect();

            const panelLeft = rect.right - 70;
            // 요소의 bottom과 높이 맞춤
            const panelBottom = window.innerHeight - rect.bottom;

            panel.style.left = `${panelLeft}px`;
            panel.style.bottom = `${panelBottom}px`;
            panel.style.top = 'auto';
        }
        panel.classList.toggle('hidden');
    }

    let selectedPanel = null;
    function addPanelListener(btn, template) {
        btn.addEventListener('click', (e) => {
            selectedPanel = btn;
            e.stopPropagation();
            loadPanel(btn, template);
            switch(selectedPanel) {
                case aiSettingBtn:
                    document.getElementById("aiCustomInput").value = personalAI;
                    break;
                case themeSettingBtn:
                    document.getElementById("themeSelector").value = theme;
                    document.getElementById("colorSelector").value = color;
                    break;
                case apiKeySettingBtn:
                    document.getElementById("geminiApiKey").value = geminiKey;
                    document.getElementById("mistralApiKey").value = mistralKey;
                    break;
            }
        });
    }
    // 'API 키 등록' 클릭 시
    addPanelListener(apiKeySettingBtn, apiKeyTemplate);
    // '테마' 클릭 시
    addPanelListener(themeSettingBtn, themeTemplate);
    // '맞춤형 AI' 클릭 시
    addPanelListener(aiSettingBtn, aiCustomTemplate);

    function confirmApply() {
        switch(selectedPanel) {
            case aiSettingBtn:
                personalAI = document.getElementById("aiCustomInput").value;
                break;
            case themeSettingBtn:
                theme = document.getElementById("themeSelector").value;
                color = document.getElementById("colorSelector").value;
                break;
            case apiKeySettingBtn:
                geminiKey = document.getElementById("geminiApiKey").value;
                mistralKey = document.getElementById("mistralApiKey").value;
                break;
        }
    }

    // 닫기 버튼 클릭 시 패널 닫기 (X 버튼)
    if (closeBtn && panel) {
        closeBtn.addEventListener('click', () => {
            panel.classList.add('hidden');
        });
    }

    // 패널 밖 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (!panel.classList.contains('hidden')) {
            if (!panel.contains(e.target)) {
                confirmApply();
                panel.classList.add('hidden');
            }
        }
    });
});