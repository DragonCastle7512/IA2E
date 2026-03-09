document.addEventListener('DOMContentLoaded', async () => {
    const CORE = "prism.min.js";
    const PLUGINS = [
        "plugins/toolbar/prism-toolbar.min.js",
        "plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js"
    ];
    const LANGUAGES = [
        "javascript", "css", "markup",
        "json", "yaml", "docker", "sql", 
        "bash", "java", "python", 
        "c", "cpp", "csharp"
    ];

    const cdnBase = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/";

    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    try {
        await loadScript(cdnBase + CORE);

        const otherScripts = [
            ...PLUGINS.map(file => cdnBase + file),
            ...LANGUAGES.map(lang => `${cdnBase}components/prism-${lang}.min.js`)
        ];

        await Promise.all(otherScripts.map(src => loadScript(src)));

    } catch (error) {
        console.error("Prism 로딩 중 에러 발생:", error);
    }
});