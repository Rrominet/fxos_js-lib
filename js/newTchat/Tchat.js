class Tchat
{
    static get FM() 
    {
        if (typeof(FML) == "undefined")
            return FM;
        else 
            return FML;
    }
    static get JS_DIR(){return Tchat.FM + "/js/newTchat";}
    static get ajax()
    {
        if (location.href.includes("https://dev-") || location.href.includes("http://dev-"))
            return "https://dev-tchat.motion-live.com";
        else 
            return "https://tchat.motion-live.com";
    }
    static get ERROR(){return 1;}
    static get INFOS(){return 2;}
    
    //dir is from motion-live.com (without the /)
    constructor(dir, id="", mkbtn=true, parent=B, movable=false)
    {
        this.parent = parent;
        this.name = null;
        this.disabled = false;
        this.dir = dir;
        this.toExecOnButton = [];
        this.toExecOnSend = [];
        this.toExecOnReceived = [];
        this.toExecOnFileUploaded = [];
        this._onShowConv = [];
        this._onHideConv = [];
        this.onLoaded = [];
        this.onMsgRightClick = [] // list of function executed on msg right click as f(msg, clickevent)
        this.onError = {};
        this.showButton = true;
        this.readonly = false;
        this.setBasicEvents();
        scripts.import([
            Tchat.FM + "/js/icons.js", 
            Tchat.JS_DIR + "/Conversation.js", 
            Tchat.JS_DIR + "/TchatButton.js", 
            Tchat.FM + "/js/urlParameters.js", 
            Tchat.FM + "/js/audio/SoundManager.js", 
            Tchat.FM + "/js/loader.js"], () => 
            {
                ip(() => 
                    {
                        this.conversation = new Conversation(this, id, this.parent);
                        if (!this.btn)
                            this.btn = new TchatButton(this, movable);

                        //alliases
                        this.conv = this.conversation;
                        this.conv.mkbtn = mkbtn;

                        //sound
                        this.sounds = new SoundManager;

                        // to do when loaded
                        this.setConvName(this.name);
                        this.conversation.hideCloseBtn();

                        for (const l of this.onLoaded)
                            this.conv.addOnLoaded(l);
                        this.onLoaded = [];
                    });
            });
        importScripts([mkJs("https://www.youtube.com/iframe_api")]);
    }

    setBasicEvents()
    {
        this._onShowConv.push(() => 
            {
                this.conv.loadLastMessages();
            });
    }

    addOnLoaded(f)
    {
        if (!this.conv)
        {
            this.onLoaded.push(f);
            return;
        }
        this.conv.addOnLoaded(f);
    }

    addOnButton(f)
    {
        if (this.btn && this.btn.btn)
            this.btn.btn.addEventListener("click", f);
        else 
            this.toExecOnButton.push(f);
    }

    // execute the functions when the message is sended and after he was recieved by the server
    // the func take as argument the html message sended !
    addOnSended(f)
    {
        this.toExecOnSend.push(f);
    }

    // the func take as argument the message {} data;
    addOnReceived(f)
    {
        this.toExecOnReceived.push(f);
    }

    addOnUploadDoned(f)
    {
        this.toExecOnFileUploaded.push(f);
    }

    setConvName(name)
    {
        this.name = name;
        if (this.conv)
            this.conv.setName(name);
        if (this.btn && this.btn.elmt)
            this.btn.elmt.innerHTML = name;
    }

    addOnShowConv(func){this._ohShowConv.push(func);}
    addOnHideConv(func){this._ohHideConv.push(func);}

    // only used for progress
    // for other use get or send
    request(cmd, json, onDoned=null, onProgress=null, onUpload=null)
    {
        importScripts([mkJs(Tchat.FM + "/js/HttpRequest.js")], () =>
            {
                json["root"] = this.dir;
                json["id"] = this.conv.id;
                const xhr = HttpRequest();

                if (onProgress)
                {
                    xhr.addEventListener('loadstart', onProgress);
                    xhr.addEventListener('load', onProgress);
                    xhr.addEventListener('progress', onProgress);
                    xhr.addEventListener('error', onProgress);
                    xhr.addEventListener('abort', onProgress);
                    xhr.addEventListener('timeout', onProgress);
                }
                
                if (onUpload)
                {
                    xhr.upload.addEventListener('loadstart', onUpload);
                    xhr.upload.addEventListener('load', onUpload);
                    xhr.upload.addEventListener('progress', onUpload);
                    xhr.upload.addEventListener('error', onUpload);
                    xhr.upload.addEventListener('abort', onUpload);
                    xhr.upload.addEventListener('timeout', onUpload);
                }

                if (onDoned)
                {
                    xhr.sendJsonAsPost(Tchat.ajax + "/" + cmd, json, (xhr) => {
                        try
                        {
                            let data = JSON.parse(xhr.responseText);
                            onDoned(data);
                        }
                        catch(e)
                        {
                            onDoned(xhr.responseText);
                        }
                    });
                }
                else 
                    xhr.sendJsonAsPost(Tchat.ajax + "/" + cmd, json);
            });
    }

    // the get send the request but don't queue if it can't send it
    get(cmd, json, onDoned=null)
    {
        importScripts([mkJs(Tchat.FM + "/js/HttpRequest.js")], () =>
            {
                json["root"] = this.dir;
                json["id"] = this.conv.id;
                if (onDoned)
                {
                    const _cb = (res) => 
                    {
                        try{
                            res = JSON.parse(res);
                        }
                        catch(e)
                        {
                            console.error("cooudn't parse as JSON the response : " + res);
                            console.error(e);
                            res = res;
                        }
                        try
                        {
                            onDoned(res)
                        }
                        catch(e)
                        {
                            console.error(e);
                        }
                    }
                    request.send(Tchat.ajax + "/" + cmd, json, _cb);
                }
                else 
                    request.send(Tchat.ajax + "/" + cmd, json);
            });
    }

    // the send send the request or queue it if it can't send it for any reason
    send(cmd, json, onDoned=null, onQueued=null)
    {
        importScripts([mkJs(Tchat.FM + "/js/HttpRequest.js")], () =>
            {
                json["root"] = this.dir;
                json["id"] = this.conv.id;
                if (onDoned)
                {
                    const _cb = (res) => 
                    {
                        try{
                            res = JSON.parse(res);
                        }
                        catch(e)
                        {
                            console.error("cooudn't parse as JSON the response : " + res);
                            console.error(e);
                            res = res;
                        }
                        try
                        {
                            onDoned(res)
                        }
                        catch(e)
                        {
                            console.error("error in onDoned : ");
                            console.error(e);
                        }
                    }
                    request.sendOrQueue(Tchat.ajax + "/" + cmd, json, _cb, onQueued);
                }
                else 
                    request.send(Tchat.ajax + "/" + cmd, json, null, onQueued);
            });
    }

    error(type)
    {
        if (type == "")
        {
            for (const k in this.onError)
            {
                for (const f of this.onError[k])
                    f();
            }
        }
        else 
        {
            if (!this.onError[type])
                return;
            for (const f of this.onError[type])
                f();
        }
    }

    addOnError(type, func)
    {
        if (!this.onError[type])
            this.onError[type] = [];
        this.onError[type].push(func);
    }

    addProfilImage(src)
    {
        this.addOnLoaded(() => this.conv.addProfilImage(src));
    }

    static me()
    {
        const _r = {};
        _r.email = email();
        _r.name = prenom();
        _r.ip = ip();

        return _r;
    }

    setReadonly(val=true)
    {
        this.readonly = val;
    }

    static async createStream()
    {
        if (window.tchats_stream || window.creating_tchats_stream)
            return;

        window.creating_tchats_stream = true;
        await scripts.import(FM + "/js/streams.js");

        const onres = (data) => 
        {
            for (const f of window._on_sse_tchats_events)
                f(JSON.parse(data));
        }
        
        Tchat.addOnSSEDefault();

        window.tchats_stream = streams.start(Tchat.ajax + "/sse", onres, {convs : window.conv_ids_streams});
        window.creating_tchats_stream = false;
    }

    static addStreamId(convId)
    {
        if (typeof(convId) == "string")
            convId = [convId];

        let added = false;
        for (const id of convId)
        {
            if (window.conv_ids_streams.includes(id))
                continue;
            window.conv_ids_streams.push(id);
            added = true;
        }

        if (!added)
            return;

        window.tchats_stream.stop();
        window.tchats_stream = null;
        Tchat.createStream();
    }

    static tchatId(id1, id2)
    {
        id1 = id1.clean();
        id2 = id2.clean();

        let ids = [id1, id2];
        ids.sort();
        return ids[0] + "__" + ids[1];
    }

    static addOnSSE(func)
    {
        window._on_sse_tchats_events.push(func);
    }

    //the id of the conv is automaticaly added when created the Conversation object but this could be usful if you want to listen to a conv event without creating the Tchat and Converation instance
    //this is basically the same as addStreamId but with a more explixit name.
    static addConvsIdToListenInSSE(convId)
    {
        Tchat.addStreamId(convId);
    }

    static addOnSSEDefault()
    {
        const onres_default = (d) =>
        {
            if (!d.data.hasOwnProperty("conv-id"))
                return;
            else if (!d.hasOwnProperty("event"))
                return;
            for (const c of window._convs)
            {
                if (c.id == d.data["conv-id"])
                    c.reactToSSE(d.event, d.data);
            }
        };

        Tchat.addOnSSE(onres_default);
    }
}

window.tchats_stream = null;
window._convs = [];
window.conv_ids_streams = [];
window._on_sse_tchats_events = [];
if (typeof window.creating_tchats_stream == "undefined")
    window.creating_tchats_stream = false;

Tchat.createStream();
