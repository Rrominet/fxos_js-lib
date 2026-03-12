window._current_cache_version = -1;
window._cached_cache_version = -10;
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
    static async hashed(data)
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

        //comment this line if you want to test the cache in local
        if (location.href.includes("localhost"))
            return;

        try
        {
            //FIXME : should also be able to manage the version with the syntac x.y.z
            window._current_cache_version = parseInt(document.body.querySelector("#version").innerText);
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

    static async get(url, data={}, method="GET")
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
        const hashed = await cache.hashed(data);
        return await db.get(url + "__" + hashed, "cache");
    }

    static async getFromNetwork(url, data={}, method="GET")
    {
        let response = null;
        if (method == "GET")
        {
            if (Object.keys(data).length > 0)
                method = "POST";

            if (method == "GET")
            {
                response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
            }
        }
        if (method == "POST")
        {
             response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        }
        
        const result = await response.text();
        cache.hashed(data).
            then(hashed => {
                db.add(url + "__" + hashed, result, "cache");
            });
        
        return result;
    }

    static clear()
    {
        return db.clear("cache");
    }
}
