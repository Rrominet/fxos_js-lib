// <link rel="stylesheet" href="/path/to/styles/default.min.css">
// <script src="/path/to/highlight.min.js"></script>
// <script>hljs.highlightAll();</script>

window.highlight_imported = false;
class highlight
{
    static async import()
    {
        newCss(FM + "/css/highlight-dark.css");
        await scripts.import([FM + "/libs/highlight.min.js"]);
        window.highlight_imported = true;
    }

    static async color(importIfNot=true)
    {
        if (!window.highlight_imported && importIfNot)
            await highlight.import();
        hljs.highlightAll();
    }
}
