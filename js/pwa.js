class pwa
{
    static async addToCache(filepath, mode = "no-cors", cacheName = "main")
    {
        if (typeof(filepath) != "string" && !Array.isArray(filepath))
            throw new TypeError("filepath must be a string or an array of strings, current value : " + filepath);

        if (typeof(filepath) == "string")
            filepath = [filepath];
            
        const cache = await caches.open(cacheName);
        for (const f of filepath)
            pwa.addOneToCache(f, cache, mode);
    }

    static async addOneToCache(filepath, cache, mode = "no-cors")
    {
        let rq = null;
        if (typeof(filepath) == "string")
            rq = new Request(filepath, {mode : mode});
        else 
            rq = filepath;
        try
        {
            return await cache.add(rq);
        }
        catch(e)
        {

        }
    }

    static async install(root = "pwa.php?func=install-files")
    {
        if (! await this.isThereANewVersion())
            return;

        let files = await fetch(root);
        files = await files.json();

        await this.addToCache(files);
        await this.updateVersionInCache();

        const _clients = await clients.matchAll();
        _clients.forEach(client => client.postMessage({message : "reload"}));
    }

    static async isThereANewVersion()
    {
        let version = "";
        try
        {
            version = await this.distVersion();
        }
        catch(e){return true;}

        let cversion = "";
        try
        {
            cversion = await this.localVersion();
        }
        catch(e)
        {
            return true;
        }

        return cversion != version;
    }

    static async distVersion(root = "version")
    {
        if (!navigator.onLine)
            throw "Offline (distVersion)";

        let url = root;
        for (let i=0; i<5; i++)
        {
            const res = await fetch(url);
            if (res.ok)
                return await res.text();
            
            url = "../" + url;
        }

        throw "version not found.";
    }

    static async localVersion(cacheName = "main")
    {
        const cache = await caches.open(cacheName); 
        const res = await cache.match("version");
        if (res)
            return await res.text();
        throw "local version not found.";
    }

    static async updateVersionInCache(cacheName = "main")
    {
        const version = await this.distVersion();
        const cache = await caches.open(cacheName); 
        cache.put("version", new Response(version));
    }

    // will respond as offline first for ressources like js or css
    // but if the resource is xhr/fetch it will fallback to a 'network first' approach
    // the stream will be awnsered has it. You need don't send them in your JS interface
    static respondAsOfflineFirst(event, cacheName="main")
    {
        // need to add the logic for a request that require progress events.
            // because with these, they can't be cached and should be ignored.
        if (event.request.headers.get("track-progress"))
            return;
        pwa.updateIfNeeded(event);
        const f = async () =>
        {
            if (!navigator.onLine)
            {
                if (pwa.isDynamic(event))
                {
                    return pwa.cachedPostRequest(event.request.url, await event.request.text());
                }
                else 
                {
                    const cache = await caches.open(cacheName);
                    const res = await cache.match(event.request.url);
                    if (res)
                        return res;
                    else 
                        return new Response("");
                }
            }

            // but if the resource is xhr/fetch it will fallback to a 'network first' approach
            if (pwa.isDynamic(event))
            {
                const rc = event.request.clone();
                const res = await fetch(event.request);
                const res2 = res.clone();
                const data = await res2.text();

                pwa.cachePostRequest(rc, data);
                return res;
            }

            const cache = await caches.open(cacheName);
            const res = await cache.match(event.request.url);
            if (res)
                return res;
            else 
                return await fetch(event.request);
        };
        event.respondWith(f());
    }

    // is POST request ? (exluding SSE and other specifics)
    static isDynamic(event)
    {
        return (event.request.mode == "cors" && !event.request.url.includes("manifest.json") && event.request.headers.get("Accept") != "text/event-stream")
    }

    // the resonse is the response as text or json
    // the request need to be cloned before
    static async cachePostRequest(request, response)
    {
        let url = request.url;
        let dataSended = await request.text();

        const func = pwa.cmdFromDataSended(dataSended);
        const key = url + "_" + func;

        await db.add(key, response);
    }

    static cmdFromDataSended(dataSended)
    {
        if (typeof(dataSended) == "string")
        {
            try
            {
                dataSended = JSON.parse(dataSended);
            }
            catch(e)
            {
                const arr = dataSended.split("&");
                dataSended = {};
                for (const item of arr)
                    dataSended[item.split("=")[0]] = item.split("=")[1];
            }
        }
        let func = dataSended.func;
        if (!func)
            func = dataSended.cmd;
        if (!func)
            func = dataSended.function;

        return func;
    }

    // the dataToSend could only contains the func/cmd/function attribute
    static async cachedPostRequest(url, dataToSend)
    {
        const key = url + "_" + pwa.cmdFromDataSended(dataToSend);
        try
        {
            const cachedResData = await db.get(key);
            return new Response(cachedResData);
        }
        catch(e)
        {
            throw "This url combine with func/cmd/function not found in db. can't get this request : " + key + " : " + e.message;
        }
    }

    static updateIfNeeded(event)
    {
        if (event.request.mode == "navigate")
            pwa.install();
    }

    // msg could be any type
    static async sendToAllClients(msg)
    {
        const _clients = await self.clients.matchAll();
        await _clients.forEach(client => client.postMessage(msg));
    }

    // on mainthread
    static setUpdateInstallEvent()
    {
        if (!"serviceWorker" in navigator)
            return;
        
        const f = () =>{
            navigator.serviceWorker.getRegistration()
                .then((registration) =>
                    {
                        if(registration)
                            return registration.update();
                    })
                .then(() => 
                    {
                        try
                        {
                            const swc = navigator.serviceWorker.controller;
                            swc.postMessage({message : "install"});
                        }catch(e){}
                });
        };

        document.addEventListener("visibilitychange", f);
    }

    static async sw_setUpdateInstallEvent()
    {
        self.addEventListener("message", (event) =>
            {
                if (event.data.message == "install")
                    pwa.install();
            });
    }

    static init(frameworksDir = "frameworks")
    {
        importScripts(frameworksDir + "/js/sw_request.js");
        importScripts(frameworksDir + "/js/db.js");
        self.addEventListener("activate", () =>
            {
                pwa.install();
                clients.claim();
            });

        self.addEventListener("fetch", (event) => 
            {
                pwa.respondAsOfflineFirst(event);
            });

        self.addEventListener("sync", (event) =>
            {
                request.onSyncEvent(event);
            });

        pwa.sw_setUpdateInstallEvent();
    }
}
