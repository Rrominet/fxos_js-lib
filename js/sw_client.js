class SW_Client
{
    constructor()
    {
        if (!"serviceWorker" in navigator)
            throw "service worker not available...";
        this.request_id = 1;
        this.on_responses = [];

        navigator.serviceWorker.addEventListener("message", (event) => 
            {
                const to_exec = [];
                to_exec.copyFrom(this.on_responses)

                for (const f of to_exec)
                    f(event);
            });

        navigator.serviceWorker.addEventListener("controllerchange", () => 
            {
                if (navigator.onLine || location.href.includes("localhost"))
                {
                    location.reload();
                    return;
                }
            });
    }

    async send(cmd, data={})
    {
        data.cmd = cmd;
        let sw = await navigator.serviceWorker.ready;
        sw = sw.active;
        if (!sw)
            throw "service worker is null. Is it register yet ?";
        data.request_id = this.request_id;
        return new Promise((cb) => 
            {
                const _cb = (event) => 
                {
                    if(event.data.request_id == data.request_id) 
                    {
                        cb(event.data);
                        this.on_responses.remove(_cb);
                    }
                };
                this.on_responses.push(_cb);
                sw.postMessage(data);
                this.request_id ++;
            });
    }

    static async init()
    {
        console.log("Init...");
        await SW_Client.importNeededScripts();
        if (!window.sw_client)
            window.sw_client = new SW_Client;
    }

    static __importNeededScripts(cb)
    {
        const paths = [
            "frameworks/js/paths.js",
            "frameworks/js/utils.js",
        ];

        const loaded = {paths : false, utils : false};

        for (const p of paths)
        {
            const el = document.createElement("script")
            el.src = p;
            el.async = true;

            el.addEventListener("load", () => 
                {
                    if (p.includes("paths.js"))
                        loaded.paths = true;
                    else if (p.includes("utils.js"))
                        loaded.utils = true;
                    if (loaded.paths && loaded.utils)
                        cb();
                });
            document.body.append(el);
        }
    }

    static importNeededScripts()
    {
        console.log("import needed scripts...");
        return new Promise((cb) => SW_Client.__importNeededScripts(cb));
    }
}
