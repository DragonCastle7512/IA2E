import { setupAutoResize } from "./ui-handler.js";

let personalAI = "";
let theme = "light";
let color = "gray";
let geminiKey = "";
let mistralKey = "";

document.addEventListener('DOMContentLoaded', async () => {
    const apiKeySettingBtn = document.getElementById('apiKeySettingBtn');
    const aiSettingBtn = document.getElementById('aiSettingBtn');
    const themeSettingBtn = document.getElementById('themeSettingBtn');
    const panel = document.getElementById('floatingSettingPanel');
    const content = document.getElementById('panelContentContainer')
    const closeBtn = document.getElementById('closePanelBtn');
    
    async function loadTemplate(path) {
        try {
            const response = await fetch(path);
            return response.text();
        } catch(e) {
            console.error(e)
        }
    }
    const DEFAULT_TEMPLATES_URL = '/ui/templates'
    const apiKeyTemplate = await loadTemplate(`${DEFAULT_TEMPLATES_URL}/api-key-template.html`);
    const themeTemplate = await loadTemplate(`${DEFAULT_TEMPLATES_URL}/theme-template.html`);
    const aiCustomTemplate = await loadTemplate(`${DEFAULT_TEMPLATES_URL}/ai-custom-template.html`);

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