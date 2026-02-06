import { get, put } from "../utils/api-layer.js";
import { setupAutoResize } from "./ui-handler.js";

export let settings = {};
(async function getSetting() {
    const json = await (await get('/setting')).json();
    const keys = await (await get('/keys')).json();
    const res = json[0];

    settings = {
        personalAI: res.personal_ai || "",
        theme: res.theme || "light",
        color: res.chat_color || "gray"
    }
    settings.geminiKey = keys.gemini || '키를 입력해주세요';
    settings.mistralKey = keys.mistral || '키를 입력해주세요';
    document.body.dataset.theme = settings.theme;
    document.body.dataset.color = settings.color;
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
    const DEFAULT_TEMPLATES_URL = '/home/templates'
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
                    const themeSelector = document.getElementById("themeSelector");
                    themeSelector.value = settings.theme;
                    themeSelector.addEventListener('change', (e) => {
                        document.body.dataset.theme = e.target.value;
                    });
                    const colorSelector = document.getElementById("colorSelector");
                    colorSelector.value = settings.color;
                    colorSelector.addEventListener('change', (e) => {
                        document.body.dataset.color = e.target.value;
                    });
                    break;
                case apiKeySettingBtn:
                    document.getElementById("geminiApiKey").placeholder = settings.geminiKey;
                    document.getElementById("mistralApiKey").placeholder = settings.mistralKey;
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
                    console.error(err)
                }
                break;
            case themeSettingBtn:
                settings.theme = document.getElementById("themeSelector").value;
                settings.color = document.getElementById("colorSelector").value;
                try {
                    await put('/setting/appearance', {
                        theme: settings.theme,
                        color: settings.color
                    });
                } catch(err) {
                    console.error(err);
                }
                break;
            case apiKeySettingBtn:
                const geminiKey = document.getElementById("geminiApiKey");
                const mistralKey = document.getElementById("mistralApiKey");
                const condition = (key) => (!key || key.length >= 25) ? true : false;
                try {
                    if(!condition(geminiKey.value) || !condition(mistralKey.value)) {
                        alert('유효하지 않은 키입니다');
                    } else {
                        const response = await put('/keys', {
                            geminiKey: geminiKey.value,
                            mistralKey: mistralKey.value
                        });
                        const json = await response.json();
                        if(json.gemini) settings.geminiKey = json.gemini;
                        if(json.mistral) settings.mistralKey = json.mistral;
                    }
                } catch(err) {
                    console.error(err);
                }
                geminiKey.value = '';
                mistralKey.value = '';
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