import { get, put } from "../api-layer.js";
import { setupAutoResize } from "./ui-handler.js";

export let settings = {};
(async function getSetting() {
    const json = await (await get('/setting')).json();
    const res = json[0];

    settings = {
        personalAI: res.personal_ai,
        theme: res.theme,
        color: res.chat_color
    }
    settings.geminiKey = "";
    settings.mistralKey = "";
})();

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
                    document.getElementById("aiCustomInput").value = settings.personalAI;
                    break;
                case themeSettingBtn:
                    document.getElementById("themeSelector").value = settings.theme;
                    document.getElementById("colorSelector").value = settings.color;
                    break;
                case apiKeySettingBtn:
                    document.getElementById("geminiApiKey").value = settings.geminiKey;
                    document.getElementById("mistralApiKey").value = settings.mistralKey;
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

    async function confirmApply() {
        switch(selectedPanel) {
            case aiSettingBtn:
                settings.personalAI = document.getElementById("aiCustomInput").value;
                try {
                    await put('/setting/personal_ai', {
                        value: settings.personalAI
                    });
                } catch(err) {
                    console.log(err)
                }
                break;
            case themeSettingBtn:
                settings.theme = document.getElementById("themeSelector").value;
                settings.color = document.getElementById("colorSelector").value;
                break;
            case apiKeySettingBtn:
                settings.geminiKey = document.getElementById("geminiApiKey").value;
                settings.mistralKey = document.getElementById("mistralApiKey").value;
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