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
        const data = {"files" : files, "location" : location};
        try
        {
            let content = await cache.get(bundle.url + "/get", data)
            content = JSON.parse(content);
            if (content.success)
            {
                if (type == "js")
                {
                    const sc = document.createElement("script");
                    sc.innerHTML = content.data.bundle;
                    document.body.appendChild(sc);
                }
                else if (type == "css")
                {
                    const css = document.createElement("style");
                    css.innerHTML = content.data.bundle;
                    document.head.appendChild(css);
                }
                if (cb)
                    cb();
                return;
            }
            else
            {
                console.error("bundle server error : " + res.message);
                return;
            }
        }
        catch(e)
        {
                console.error("bundle request error : " + e);
                return;
        }
    }
}
