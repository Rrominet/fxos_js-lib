class Hal
{
    constructor() 
    {
        this.scroll = -1;
        this.handler = setInterval(() => this.setInfos(), 100);
        this.sendProgress = this.sendPgr;
    }

    setInfos()
    {
        if (getUrlParameter)
            clearInterval(this.handler);
        this.setUrl(location.href.removeParameters()); 
        if (getUrlParameter("from"))
            this.setFrom(getUrlParameter("from")); 

        // the setIp method send a visit notification
        ip(this.setIp.bind(this));
    }

    setIp(ip)
    {
        localStorage["ip"] = ip;
        this.send("visit");
    }

    ip()
    {
        return localStorage["ip"];
    }

    url()
    {
        return localStorage["hal-url"].removeParameters(); 
    }

    setUrl(url)
    {
        localStorage["hal-url"] = url;
    }

    from()
    {
        return getLocalStorage("hal-from");
    }

    email()
    {
        let email = getUrlParameter("email");
        if (email)
        {
            localStorage["email"] = email;
        }
        return getLocalStorage("email");
    }

    setFrom(from)
    {
        localStorage["hal-from"] = from;
    }

    //cb take the json response from hal server as arg
    send(action, cb=null)
    {
        const xhr = HttpRequest(); 
        const url = HAL_URL + "/save-action";
        const data = {
            "_url" : this.url(),
            "_from" : this.from(),
            "_ip" : this.ip(),
            "_email" : this.email(),
            "_action" : action,
        };
        if (cb)
        {
            const _cb = (xhr) => {
                cb(JSON.parse(xhr.responseText));   
            };
            xhr.sendJsonAsPost(url, data, _cb);
        }
        else 
            xhr.sendJsonAsPost(url, data);
    }

    // pgr is between 0 and 100
    sendPgr(pgr, add_data=null, cb=null)
    {
        const u = new URL(location.href);
        let id = u.pathname;
        if (id[0] == "/")
            id = id.substring(1);
        if (id.last() == "/")
            id = id.substring(0, id.length-1);
        id = id.replaceAll("/", "_");
        const xhr = HttpRequest(); 
        const url = HAL_URL + "/save-progress";
        const data = {
            "_url" : this.url(),
            "_from" : this.from(),
            "_ip" : this.ip(),
            "_email" : this.email(),
            "_action" : "save-progress",
            "pgr" : pgr,
            "pgrdata" : add_data,
            "id" : id,
        };
        if (cb)
        {
            const _cb = (xhr) => {
                cb(JSON.parse(xhr.responseText));   
            };
            xhr.sendJsonAsPost(url, data, _cb);
        }
        else 
            xhr.sendJsonAsPost(url, data);
    }

    static init()
    {
        window.HAL = new Hal;
    }

    static async start()
    {
        let scs = [];
        if (typeof(getUrlParameter) == "undefined")
            scs.push(FM + "/js/urlParameters.js");
        if (typeof(HttpRequest) == "undefined")
            scs.push(FM + "/js/HttpRequest.js");
        await scripts.import(scs);
        Hal.init();
    }
}

Hal.start();
