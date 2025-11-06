window.requests_resend_timeout = 20000;
function HttpRequest () 
{
    var hr = false; 

    if (window.XMLHttpRequest)
    {
        hr = new XMLHttpRequest(); 
        return hr;
    }

    else if (window.ActiveXObject) // IE
    {
        try
        {
            hr = new ActiveXObject("Msxml2.XMLHTTP");
        }

        catch (e)
        {
            try
            {
                hr = new ActiveXObject("Microsoft.XMLHTTP");
            }catch (e){}
        }

        return hr;
    }

    return hr;
}

function getHttpRequest () 
{
    return HttpRequest();
}

// returnFunc prend 1 param, : l'XHR
XMLHttpRequest.prototype.sendAsGet = function(url, returnFunc=null, bind = null, async = true)
{
	try{document.domain = "motion-live.com"}
	catch(e){}

    this.open("GET", url, async); 
    if (returnFunc)
    {
        this.onreadystatechange = function()
        {
            if (this.readyState === XMLHttpRequest.DONE) 
            {
                this.responseText = request.parse(this.responseText);
                returnFunc(this);
            }
        } 
    }

    this.send(null);
}


if (typeof(window._on_request_send) == "undefined")
    window._on_request_send = [];

if (typeof(window._on_request_queued) == "undefined")
    window._on_request_queued = [];

class request
{
    //
// does the inverse of :
// replaceAmp replace & to //amp;// you need to convert it back in php. It prevent from POST conflict.
// replaceAmp replace + to //pls;// you need to convert it back in php. It prevent from POST conflict.
// replaceAmp replace = to //equ;// you need to convert it back in php. It prevent from POST conflict.
    // Somewhere, it seams to break JSON data ! TODO
    static parse(res)
    {
        res = res.replaceAll("//amp;//", "&");
        res = res.replaceAll("//pls;//", "+");
        res = res.replaceAll("//equ;//", "=");
        return res;
    }

    static parseForSend(res)
    {
        try
        {
            res = res.replaceAll("&", "//amp;//");
            res = res.replaceAll("+", "//pls;//");
            res = res.replaceAll("=", "//equ;//");
        }catch(e){}
        return res;
    }

    // eventType is not used anymore.
    // only kept for compatibility
    static stream(url, json, onUpdate=null, eventType = "message", jsonres = true)
    {
        if (!navigator.onLine)
            return null;

        if (url.last() != "?")
            url+= "?";
        for (const key in json)
            url += key + "=" + json[key] + "&";
        url = url.pop();

        const _r = new EventSource(url);
        if(onUpdate)
        {
            _r.addEventListener("message", (ev) => 
                {
                    if (jsonres)
                        onUpdate(JSON.parse(ev.data));
                    else 
                        onUpdate(ev.data);
                });
        }

        return _r;
    }

    static requestData(url, json)
    {
        return {
            url : url,
            body : json,
            headers : {"Content-Type": "application/json"},
        };
    }

    // this function return nothing, the data is in onResponse arg function
    static async responseFromCache(requestData, onResponse=null)
    {
        await scripts.import(FM + "/js/db.js");
        let responses = []
        try
        {
            responses = await db.get("responses");
        }
        catch(e)
        {
            return;
        }

        for (const r of responses)
        {
            if (request.compareRequestData(r.request, requestData))
            {
                if (onResponse)
                    onResponse(r.data);
                return;
            }
        }
    }

    static async addToQueued(requestData)
    {
        requestData.time = Date.now();
        let queue = [];
        try
        {
            queue = await db.get("queued_requests");
        }catch(e){}
        queue.push(requestData);
        await db.set("queued_requests", queue);

        for (const f of window._on_request_queued)
            f(requestData);
    }

    // json could be a string or an object
    // first : the onDoned will be exec on the cached response if exists.
    // second : if internet, the onDoned will be executed a second time on the updated data from network. (your onDoned func should do a proper clean up at the begining to not have your data in double)
    // third : if no internet or if the request does not finishe after winwdow.requests_resend_timeout, the request is queued to be sended every window.requests_resend_timeout ms until it is sended.
    // when queued, the onQueued cb is executed  with the request as arg
    // FIXME this don't work for now, its too heavy and not optimized.
    // for now it just send the request normally, no cache.
    static async sendOrQueue(url, json={}, onDoned=null, onQueued=null)
    {
        const rq = request.requestData(url, json);
//         await request.responseFromCache(rq, onDoned);
// 
        const send_cb = (res) => 
        {
            if (onDoned)
                onDoned(res);

            for (const f of window._on_request_send)
                f(rq, res);
        };

        const xhr = await request.send(url, json, send_cb);
//         const hdl = setTimeout(() => 
//             {
//                 if (xhr.readyState != XMLHttpRequest.DONE)
//                 {
//                     xhr.abort();
//                     request.addToQueued(rq);
//                     if (onQueued)
//                         onQueued(rq);
//                 }
//             }, window.requests_resend_timeout);
// 
//         xhr.addEventListener("error", () => 
//             {
//                 clearTimeout(hdl);
//                 xhr.abort();
//                 request.addToQueued(rq);
//                 if (onQueued)
//                     onQueued(rq);
//             });

    }

    // onRequestSend take the req as 1st arg and the xhr.response as 2nd
    static async sendQueued(onRequestSend=null)
    {
        if (!navigator.onLine && !location.href.includes("localhost"))
            return;

        let toSend = [];
        try
        {
            toSend = await db.get("queued_requests");
        }catch(e){}
        if (!toSend || toSend.length == 0)
            return;
        for (const req of toSend)
        {
            const xhr = HttpRequest();
            const cb = (xhr) => 
            {
                if (onRequestSend)
                    onRequestSend(req, xhr.response);

                for (const f of window._on_request_send)
                    f(req, xhr.response);

                toSend.remove(req);
                db.set("queued_requests", toSend);
            };
            xhr.sendJsonAsPost(req.url, req.body, cb);
        }
    }

    static async queued_requests()
    {
        try
        {
            return await db.get("queued_requests");
        }
        catch(e){return [];}
    }

    // json could be a string or an object
    // first : the onDoned will be exec on the cached response if exists.
    // second : if internet, the onDoned will be executed a second time on the updated data from network. (your onDoned func should do a proper clean up at the begining to not have your data in double)
    // this version does not queued the request.
    static async send(url, json, onDoned=null)
    {
//         const rq = request.requestData(url, json);
//         await request.responseFromCache(rq, onDoned);
// 
        const xhr = HttpRequest();
        xhr.sendJsonAsPost(url, json, async(xhr) =>
            {
//                 const res = {
//                     request : rq,
//                     data : xhr.response
//                 };
// 
//                 let responses = []
// 
//                 try
//                 {
//                     responses = await db.get("responses");
//                 }
//                 catch(e){}
// 
//                 let founded = false;
//                 let changed = false;
//                 for (const r of responses)
//                 {
//                     if (request.compareRequestData(r.request, {"url" : url, body : json}))
//                     {
//                         founded = true;
//                         if (!request.compareResponses(r.data, xhr.response))
//                         {
//                             r.data = xhr.response;
//                             changed = true;
//                         }
//                         break;
//                     }
//                 }
// 
//                 if (!founded || changed)
//                 {
                    if (onDoned)
                        onDoned(xhr.response);
//                 }
// 
//                 if (!founded)
//                 {
//                     responses.push(res);
//                     changed = true;
//                 }
// 
//                 if (changed)
//                     await db.add("responses", responses);
            });
        return xhr;
    }

    static compareRequestData(r1, r2)
    {
        if (r1.url != r2.url)
            return false;
        const b1 = JSON.stringify(r1.body);
        const b2 = JSON.stringify(r2.body);
        return b1 == b2;
    }

    static compareResponses(r1, r2)
    {
        if (r1.length != r2.length)
            return false;
        if (r1.length > 100)
            return true;
        return r1 == r2;
    }

    static asUrlString(formData)
    {
        const params = new URLSearchParams();
        for (let [key, value] of formData.entries()) 
            params.append(key, value);
        return params.toString();
    }

    // take the rq as first, and the response as 2nd argument
    // this is will be fired only if the request is send with sendOrQueue not send.
    // this is because send is logicly used to get data and sendOrQueue is used to POST/PUT data on the server.
    // (even if send use POST method, that's not the point.)
    static addOnSend(f)
    {
        window._on_request_send.push(f);
    }

    // take the rq as first argument
    static addOnQueued(f)
    {
        window._on_request_queued.push(f);
    }

    static async showQueuedRequestsPanel(queued=null)
    {
        if (!window._queued_requests_panel)
        {
            const p = window._queued_requests_panel = B.newNode("div", "queued-requests-panel");
            p.newButton("X", () => window._queued_requests_panel.hide(), "close");
            p.newTitle("div", "Requêtes en attente :", "title");
            p.queue = p.newNode("div", "queue");

            p.footer = p.newNode("div", "footer");
            p.footer.newButton("Send All", async () => {
                const btn = p.footer.children[0];
                btn.disabled = true;
                btn.innerText = "...";
                await request.sendQueued();
                btn.innerText = "Sended.";
                window._queued_requests_panel.hide();
            }, "send-all");
        }

        window._queued_requests_panel.queue.innerHTML = "";
        if (!queued)
            queued = await request.queued_requests();

        for (const r of queued)
        {
            const rq = window._queued_requests_panel.queue.newNode("div", "queued-request");
            rq.newTitle("div", r.url.split("/").last(), "url");
            rq.newTitle("div", JSON.stringify(r.body), "body");
            rq.newButton("Send", async () => {
                await request.removeFromQueue(r);
                request.sendOrQueue(r.url, r.body, () => rq.remove());
            });

            rq.newButton("Del", async () => {
                await request.removeFromQueue(r);
                rq.remove();
            }, "del");
        }
        window._queued_requests_panel.show();
    }

    static async removeFromQueue(rq)
    {
        const toSend = await request.queued_requests();
        for (const r of toSend)
        {
            if (r.url == rq.url && JSON.stringify(r.body) == JSON.stringify(rq.body))
            {
                toSend.remove(r);
                break;
            }
        }
        await db.set("queued_requests", toSend);
    }
}

request.listen = request.stream;


// returnFunc prend 1 param, : l'XHR
XMLHttpRequest.prototype.sendAsPost = function(url, params=null, returnFunc = null, async = true)
{
    try{document.domain = "motion-live.com"}
	catch(e){}
    this.open("POST", url, async); 
    this.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    if (returnFunc == null)
    {
        if (params)
            this.send(params);
        else 
            this.send();
        return;
    }
    this.onreadystatechange = function()
    {
        if (this.readyState === XMLHttpRequest.DONE) 
        {
            this.responseText = request.parse(this.responseText);
            returnFunc(this);
        }
    } 

    this.send(params);
}

XMLHttpRequest.prototype.request = function (url, returnFunc=null, post=true, bind=null, async=true)
{
    if (!post)
        this.sendAsGet(url, returnFunc, bin, async); 
    else 
    {
        tmp = url.split("?")
        url = tmp[0];
        params = url[1];
        this.sendAsPost(url, params, returnFunc, async);
    }
}

//params as list
// replaceAmp replace & to //amp;// you need to convert it back in php. It prevent from POST conflict.
// replaceAmp replace + to //pls;// you need to convert it back in php. It prevent from POST conflict.
// replaceAmp replace = to //equ;// you need to convert it back in php. It prevent from POST conflict.
// paramsList = [["key", "value"], [..., ...]]
XMLHttpRequest.prototype.sendListAsPost = function(url, paramsList, returnFunc = null, replaceAmp=true, async = true) // return func prend 1 param, : l'XHR
{
    let params = ""; 
    for (let i=0; i<paramsList.length; i++)
    {
        let key = paramsList[i][0]; 
        let value = paramsList[i][1];
        if (replaceAmp)
            value = request.parseForSend(value);
        if (typeof(value) == "boolean")
            value = boolToStr(value);
        if (i == 0)
            params += key + "=" + value;
        else
            params += "&" + key + "=" + value;
    }
    this.sendAsPost(url, params, returnFunc, async);
}
XMLHttpRequest.prototype.sendListAsGet = function(url, paramsList, returnFunc = null, replaceAmp=true, async = true) // return func prend 1 param, : l'XHR
{
    let params = ""; 
    for (let i=0; i<paramsList.length; i++)
    {
        let key = paramsList[i][0]; 
        let value = paramsList[i][1];
        if (typeof(value) == "boolean")
            value = boolToStr(value);
        if (replaceAmp)
            value = request.parseForSend(value);

        if (i == 0)
            params += key + "=" + value;
        else
            params += "&" + key + "=" + value;
    }
    this.sendAsGet(url + "?" + params, returnFunc, async);
}

// this will add a specefic headers to the request to not be cached by the service worker if you are in a PWA. 
    // If your are on a regular website with no PWA, you don't care about this.
XMLHttpRequest.prototype.addOnProgress = function(func)
{
    this.trackProgress = true;
    this.addEventListener("progress", func);
}

// json is a json object, or a string (the json stringodied).
// returnFunc take one arg : the xhr who send the request.
XMLHttpRequest.prototype.sendJsonAsPost = function (url, json, returnFunc=null, async=true)
{
    this.open("POST", url, async); 
    //if (this.trackProgress)
        this.setRequestHeader("track-progress", "true");
    this.setRequestHeader("Content-Type", "application/json");

    if (typeof(json) == "object")
        json = JSON.stringify(json);

    if (returnFunc == null)
    {
        this.send(json);
        return;
    }
    this.onreadystatechange = function()
    {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) 
        {
            returnFunc(this);
        }
    } 
    this.send(json);
}
//

// the file is a file from a file html inputs (logicly input.files[0])
// progress will be execute each time the upload progress.
XMLHttpRequest.prototype.sendFileAsPost = function (url, file, returnFunc=null, progress=null, async=true)
{
    this.open("POST", url, async); 
    const formData = new FormData();
    formData.append("file", file);

    if (returnFunc)
    {
        this.onreadystatechange = function()
        {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) 
                returnFunc(this);
        } 
    }

    if (progress)
        this.upload.addEventListener("progress", progress); 

    this.send(formData);
}

// the func can take one arg : the xhr itself.
XMLHttpRequest.prototype.addOnRequestDone = function (func)
{
    this.onreadystatechange = function()
    {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) 
        {
            func(this);
        }
    } 
}

// callack take an argument, the file content
function fileContent(path, callback, fromApp=false)
{
    let xhr = HttpRequest(); 
    if (!fromApp)
        path = localPathToGlobal(path);
        
    let func = function (xhr)
    {
        callback(xhr.responseText);
    }
    xhr.sendAsPost(FM + "/php/readFile.php", "path=" + path, func);
}

// the call back takes the xhr as arg | not the file content
// the file content can be get with xhr.responseText
function readFile(path, callack, post = true)
{
	let xhr = HttpRequest();
	if (post)
		xhr.sendAsPost(path, "", callack); 
	else 
		xhr.sendAsGet(path, callack);
}

// callack take an argument, the JSON object
function getJson(path, callback, fromApp=false)
{
    let callback1 = function (xhr)
    {
        callback(JSON.parse(xhr.responseText));
    };

    let callback2 = function (txt)
    {
        callback(JSON.parse(request.parse(txt)));
    };

    if (!fromApp)
        readFile(path, callback1);
    else 
        fileContent(path, callback2, true);
}

// callack take an argument, the JSON object
function jsonContent(path, callback)
{
    getJson(path, callback);
}


// callbak take one argument : the xhr sended to write the file
function writeFile(path, content, callback=null, fromApp=false)
{
    let xhr = HttpRequest(); 
    if (!fromApp)
        path = localPathToGlobal(path);
    let params = [
        ["path", path], 
        ["content", content], 
        ["func", "write"],
    ];

    xhr.sendListAsPost(FM + "/php/writeFile.php", params, callback);
}

// callbak take one argument : the xhr sended to write the file
function appendToFile(path, content, callback=null, fromApp=false)
{
    let xhr = HttpRequest(); 
    if (!fromApp)
        path = localPathToGlobal(path);
    let params = [
        ["path", path], 
        ["content", content],
        ["func", "append"],
    ];

    xhr.sendListAsPost(FM + "/php/writeFile.php", params, callback);
}

function appendInFile(path, content, callback=null, fromApp=false)
{
    appendToFile(path, content, callback, fromApp);
}

class DistFile
{
    // call back take the returned content as arg (as str or JSON)
    static content(path, callback, asJson = false, fromApp=false)
    {
        if (!asJson)
            fileContent(path, callback, fromApp);
        else 
            getJson(path, callback, fromApp);

    }

// the call back takes the xhr as arg | not the file content
// the file content can be get with xhr.responseText
    static read(path, callack, post = true)
    {
        readFile(path, callack, post);
    }

    // if append  == false, it will replace the file
    // if the file does not exists, it will create it.
    // if fromApp == true, the path had to be from motion-live.com root.
    static write(path, content, callback = null, append=false, fromApp=false)
    {
        if (!append)
            writeFile(path, content, callback, fromApp);
        else 
            appendToFile(path, content, callback, fromApp);
    }

    static clear(path, cb=null, fromApp=false)
    {
        let xhr = HttpRequest(); 
        if (!fromApp)
            path = localPathToGlobal(path);
        let params = [
            ["path", path], 
            ["func", "clear"],
        ];

        xhr.sendListAsPost(FM + "/php/writeFile.php", params, cb);
    }

    //callback take the xhr in arg
    //if convertformat == "none", it will not convert the format
    static sendImg(path, onProgress=null, callback=null, onError=null, convertformat="none", quality=100)
    {
        const input = B.addInput("file");
        input.hide();
        const send = (file) => 
        {
            const data = new FormData();
            data.append("img", file);
            const xhr = HttpRequest();
            xhr.addEventListener("readystatechange", () => 
                {
                    if (xhr.readyState == XMLHttpRequest.DONE && callback)
                        callback(xhr);
                    input.remove();
                });
            const f = (e) => 
            {
                if (onProgress)
                    onProgress(e);
            };
            xhr.upload.addEventListener("loadstart", f);
            xhr.upload.addEventListener("progress", f);
            xhr.upload.addEventListener("load", f);
            if (onError)
            {
                xhr.upload.addEventListener("error", onError);
                xhr.addEventListener("error", onError);
            }
            xhr.open("POST", path);
            xhr.send(data);
        };
        const oninputchange = async () => 
        {
            let file = input.files[0];
            if (convertformat != "none" && file.type.includes("image"))
            {
                await scripts.import(FM + "/js/imgs.js");
                imgs.convertedFromFile(file, convertformat, quality, (url) => {
                    let name = file.name;
                    name = file.name.split(".");
                    name.pop();
                    name.push(convertformat);
                    name = name.join(".");
                    file = imgs.asFile(url, name);
                    send(file);
                });
            }
            else 
            {
                send(file);
            }
        };
        input.addEventListener("change", oninputchange);
        input.click();
    }
}

class Dir
{
    //path has to be a dir 
    //path is from motion-live.com with the '/' at the begining
    //callback takes one argument : an array with the paths returned
    static content(path, callback, fromApp=false)
    {
        let xhr = HttpRequest(); 
        if (!fromApp)
            path = localPathToGlobal(path);
        let params = [
            ["path", path], 
            ["func", "content"],
        ];

        let callback1 = function (xhr)
        {
            callback(JSON.parse(xhr.responseText));
        };

        xhr.sendListAsPost(FM + "/php/dir.php", params, callback1);
    }

    //callback take as arg a bool 
    static create(path, callback)
    {
        let xhr = HttpRequest(); 
        let params = [
            ["path", path], 
            ["func", "create"],
        ];

        let callback1 = function (xhr)
        {
            if (xhr.responseText == "true")
                callback(true);
            else 
                callback(false);
        };

        xhr.sendListAsPost(FM + "/php/dir.php", params, callback1);
    }
}

class Email
{
    static send(dest, subject, msg, sender="server", callack=null)
    {
        const xhr = HttpRequest(); 
        const params = [
            ["dest", dest],
            ["subject", subject],
            ["msg", msg],
            ["sender", sender],
            ["func", "send"],
        ];

        xhr.sendListAsPost(FM + "/php/emails.php", params, callack);
    }

    static sendToMe(subject, msg, callback=null)
    {
        Email.send("romain.gilliot@motion-live.com", subject, msg, "server", callback);
    }
}
