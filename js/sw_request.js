class request
{
    // to exec on a service worker most of the time
    static onSyncEvent(event)
    {
        if (!event.tag == "send-request")
            return;

        const f = async () => {
            const requests = await db.get("requests");
            for (const r of requests)
            {
                const request = new Request(r.url, 
                    {
                        body : JSON.stringify(r.body),
                        headers : r.headers,
                        method : "POST",
                    });
                const res = await fetch(request);
                const msg = 
                    {
                        url : r.url,
                        response : await res.text()
                    };

                pwa.sendToAllClients(msg);
            }

            db.set("requests", []);
        };

        event.waitUntil(f());
    }
}
