class bundle
{
    static get url()
    {
        if (location.href.includes("localhost"))
            return "http://localhost:1111";
        else 
            return "https://files.motion-live.com";
    }

    //type could be js or css
    static async import(files, type="js", cb=null)
    {
        if (typeof(files) == "string")
            files = [files];

        if (type == "js")
            scripts.import(files, cb)
        else 
        {
            for (const f of files)
                newCss(f);
        }
    }

    static async write(filepath, _data, cb=null)
    {
        if (typeof(_data) == "object")
            _data = JSON.stringify(_data);

        const data = {"file" : filepath, "location" : location, content : _data};
        try
        {
            const response = await fetch(bundle.url + "/set", {
                method : "POST" ,
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(data)
            });
            const result = await response.json();
            if (cb)
                cb(result);
            return result;
        }
        catch(e)
        {
            console.error("bundle request error : " + e);
            return;
        }
    }
    }
