window._current_cache_version = "current-version";
window._cached_cache_version = "cached-version";
window._use_cache = false;
window._cache_preget_called = false;

class cache
{
    //value need to be a JSON obeject here not a the stringified version
    static canonicalize(value)
    {
        if (value === null || typeof value !== "object") {
            // primitives: number, string, boolean, null
            return value;
        }

        if (Array.isArray(value)) {
            // arrays: keep order, canonicalize each element
            return value.map(cache.canonicalize);
        }

        // plain object: sort keys and canonicalize values
        const obj = {};
        for (const key of Object.keys(value).sort()) {
            obj[key] = cache.canonicalize(value[key]);
        }
        return obj;
    }
    //return a unique key for its data
    //usesd to retreice an url from the cache with the data sended to the server
    static async hased(data)
    {
        if (typeof data == "string")
            data = JSON.parse(data);

        data = cache.canonicalize(data);
        const data_str = JSON.stringify(data);

        const enc = new TextEncoder;
        const hash = await crypto.subtle.digest('SHA-256', enc.encode(data_str));
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    //set the the variable window._use_cache
    static async preget()
    {
        if (window._cache_preget_called)
            return;
        window._cache_preget_called = true;

        if (!navigator.onLine)
            return;
        try
        {
            window._current_cache_version = B.querySelector("#version").innerText;
        }
        catch(e)
        {
            return
        }

        await db.open("cache");
        try
        {
            window._cached_cache_version = await db.get("_cache-version", "cache");
        }
        catch(e)
        {
            await cache.clear()
            window._cached_cache_version = window._current_cache_version;
            await db.set("_cache-version", window._cached_cache_version, "cache");
            return;
        }

        if (window._cached_cache_version == window._current_cache_version)
        {
            window._use_cache = true;
        }
        else
        {
            window._cached_cache_version = window._current_cache_version;
            await cache.clear()
            await db.set("_cache-version", window._cached_cache_version, "cache");
        }
    }

    static async get(url, data={}, method="POST")
    {
        await cache.preget();
        if (window._use_cache)
        {
            try
            {
                return await cache.getFromCache(url, data);
            }
            catch(e)
            {
                return await cache.getFromNetwork(url, data, method);
            }
        }
        else 
        {
            return await cache.getFromNetwork(url, data, method);
        }
    }

    static async getFromCache(url, data={})
    {
        const hased = await cache.hased(data);
        return await db.get(url + "__" + hased, "cache");
    }

    static async getFromNetwork(url, data={}, method="POST")
    {
        return new Promise((resolve) => {
            const xhr = HttpRequest(); 
            xhr.sendJsonAsPost(url, data, (xhr) => 
                {
                    cache.hased(data).then(hased => {
                        db.add(url + "__" + hased, xhr.response, "cache");
                    });

                    resolve(xhr.response);
                });
        });
    }

    static clear()
    {
        return db.clear("cache");
    }
}
