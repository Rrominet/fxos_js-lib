_I = 0;
class Stream
{
    // params as list or json
    constructor(url, params = [])
    {
        this.stream = null;
        this.url = url;
        if (Array.isArray(params))
        {
            this.params = {};
            for (const p of params)
            {
                const d = {};
                d[p[0]] = d[p[1]];
                this.params.push(d);
            }
        }
        else
            this.params = params;
        this.running = false;
        this.mustStop = false;
        this.lastResponse = null;
        this.srcFuncForProgr = [];
        this.onProgress =[];
        this.visOptimized = true;

        this.xhrHandlers = [];
        this.onVisChangePtr = null;
        this.close = this.stop;
    }

    setEvents()
    {
        this.stream.addEventListener("message", (ev) => {
            for (const f of this.onProgress)
                f(ev.data);
        });
    }

    start()
    {
        if (this.running)
            return;
        this.running = true;
        this.mustStop = false;
        this.stream = request.stream(this.url, this.params, null, "", false);
        if (this.stream)
            this.setEvents();
    }

    stop()
    {
        if (this.stream)
            this.stream.close();
        this.running = false;
    }

    // the function take the xhr.response in parameter
    // the function could take a second param wich is the last piece of response from the last progress event (without the others)
    addOnProgress(f)
    {
        this.onProgress.push(f);
    }

}

// its a namespace, not a class
class streams
{
    // params as list or json
    static start(url, onPrg, params=[])
    {
        if (!navigator.onLine)
            return null;
        const s = new Stream(url, params);
        s.addOnProgress(onPrg);
        s.start();
        return s;
    }
}
