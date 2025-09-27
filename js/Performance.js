class Performance
{
    constructor()
    {
        this.running = false;
        this._level = 0
    }

    static level()
    {
        if (window.perf && !window.perf.running)
            return window.perf._level;
        else if (window.perf && window.perf.running)
            return -1;


        window.perf = new Performance;
        window.perf.running = true;

        if (window.Worker)
        {
            this.worker = new Worker(FM + "/js/PerformanceThread.js");
            this.worker.postMessage("perf");
            this.worker.onmessage = (e) => 
                {
                    window.perf._level = e.data;
                    window.perf.running = false;
                };
        }

        else 
            return -1;
    }

}
