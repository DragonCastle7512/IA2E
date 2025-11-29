document.addEventListener('DOMContentLoaded', () => {
    const CORE_FILES = [
        "prism.min.js",
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
    const head = document.head;

    const loadScript = (src) => {
        const script = document.createElement('script');
        script.src = src;
        head.appendChild(script);
    };

    CORE_FILES.forEach(file => {
        loadScript(cdnBase + file);
    });
    
    LANGUAGES.forEach(lang => {
        const scriptPath = cdnBase + `components/prism-${lang}.min.js`;
        loadScript(scriptPath);
    });
});