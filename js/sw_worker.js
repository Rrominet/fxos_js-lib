 // could be modifed from anywhere
// to add a cmd, just do : 
// self.cmds["your_cmd_name"] = (req_data) => {...}
self.cmds = {};

self.cmds["version"] = () => { return self.version; }


// this is the ressources to cache that are loaded before the service worker is installed.
// typically. all files loaded in index.html and your main js file that register the service worker.
self.precaches = [
    "frameworks/js/paths.js",
    "frameworks/js/utils.js",
    "frameworks/js/sw_client.js",
];

async function oninstall()
{
    await caches.deleteAll();
    const c = await caches.open(self.version);
    await c.addAll(self.precaches);
    return self.skipWaiting();
}

self.addEventListener("install", async (event) => 
    {
        event.waitUntil(oninstall());
    });

self.addEventListener("activate", async (event) => {
    self.clients.claim();
});

self.addEventListener("message", async (event) => 
    {
        if (event.data.cmd in self.cmds) 
        {
            const res = self.cmds[event.data.cmd](event.data);
            const _clients = await self.clients.matchAll();
            await _clients.forEach(client => client.postMessage({
                response : res,
                request_id : event.data.request_id,
            }));
        }
    });

async function send(data)
{
    const _clients = await self.clients.matchAll();
    await _clients.forEach(client => client.postMessage(data));
}

async function onStaticRequest(req)
{
    const c = await caches.open(self.version);
    const cached = await c.match(req.url);
    if (cached)
        return cached;
    else 
    {
        const res = await fetch(req);
        caches.open(self.version).then((c) => 
            {
                c.add(req.url);
            });
        return res;
    }
}

self.addEventListener("fetch", async (event) => 
    {
        if (!reqDynamic(event.request))
            event.respondWith(onStaticRequest(event.request));
    });

CacheStorage.prototype.deleteAll = async function()
{
    for (const k of await caches.keys())
        await caches.delete(k);
}

function reqDynamic(req)
{
    // this changed.
    return (req.destination === "" || req.headers.get("Accept") != "text/event-stream")
}
