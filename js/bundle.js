class bundle
{
    static get url()
    {
        return "http://localhost:1111";
    }

    //type could be js or css
    static import(files, type="js", cb=null)
    {
        if (typeof(files) == "string")
            files = [files];
        const data = {"files" : files, "location" : location};
        fetch(bundle.url + "/get", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res =>
            {
                if (!res.success)
                {
                    console.error("bundle server error : " + res.message);
                    return;
                }
                const content = res.data.bundle;
                if (type == "js")
                {
                    const sc = document.createElement("script");
                    document.body.appendChild(sc);
                    sc.innerHTML = content;
                }
                else if (type == "css")
                {
                    const css = document.createElement("style");
                    document.head.appendChild(css);
                    css.innerHTML = content;
                }
                if (cb)
                    cb();
            }
        )
        .catch(err => console.log("bundle.impport error : " + err));
    }
}
