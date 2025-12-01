const indexedDB = self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB;

class db
{
    static open(name="storage", version=1)
    {
        const request = indexedDB.open(name, version);
        request.onerror = (e) => console.error(e);

        request.onupgradeneeded = () =>
            {
                const _db = request.result;
            _db.createObjectStore(name, { keyPath: "key" });
        }

        return new Promise((resolve) => request.onsuccess = () => resolve(request.result));
    }

    //value is a json object or anything really
    static async add(key, value, name="storage")
    {
        const _db = await db.open(name);
        const tx = _db.transaction(name, "readwrite");
        const store = tx.objectStore(name);

        const obj = {key : key, data : value};
        store.put(obj);
    }

    //idem as add
    static async set(key, value, name="storage")
    {
        return await this.add(key, value, name);
    }

    static async get(key, name="storage")
    {
        const _db = await db.open(name);
        const tx = _db.transaction(name, "readonly");
        const store = tx.objectStore(name);

        const query = store.get(key);

        return new Promise((resolve, reject) => 
            {
                query.onsuccess = () => 
                {
                    if (!query.result)
                        reject("data " + key + " not found.");
                    else 
                        resolve(query.result.data);
                };
            });
    }

    static async clear(name="storage")
    {
        const _db = await db.open(name);
        const storeNames = Array.from(_db.objectStoreNames);
        await Promise.all(
            storeNames.map((storeName) =>
                new Promise((resolve, reject) => {
                    const tx = _db.transaction(storeName, "readwrite");
                    const store = tx.objectStore(storeName);
                    const rq = store.clear();

                    rq.onsuccess = () => resolve();
                    rq.onerror   = () => reject(rq.error);

                    tx.onabort   = () => reject(tx.error || new Error("Tx aborted"));
                })
            )
        );
    }
}
