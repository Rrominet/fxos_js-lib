// the sound visualizer can only take the data from 1 audio channel, by default its the first one 
// If you want to change it, change the parameter channelIndex
class SoundRealTimeVisualizer
{
    constructor(SoundManager, channelIndex = 0)
    {
        this.channelIndex = channelIndex;
        this.wm = SoundManager;
        this.sound = null;
        this.data = null;
        this.parent = null;
        this._handler = null;
        this.lines = [];
        this._size = 30;
    }

    setSize(size)
    {
        this._size = size;
        this.div.style.paddingTop = (this._size*3) + "px";
        this.div.style.paddingBottom = (this._size*3) + "px";
    }

    interface(parent=B, precision=512)
    {
        this.parent = parent;
        this.div = this.parent.newNode("div", "audio-viz-rt");
        let w = (1.0/precision)*100;
        for (let i=0; i<precision; i++)
        {
            let l = this.div.newNode("div", "line");
            l.style.width = w + "%";
            l.style.height = "10px";
            l.style.transform = "scale(1.0, 0.0)";
            this.lines.push(l);
        }

        this.setSize(this._size);
    }

    width()
    {
        return this.div.w();
    }

    animate()
    {
        this._handler = setInterval(() => this.onInterval(), 16);
    }

    stop()
    {
        if (this._handler)
            clearInterval(this._handler);
        this._handler = null;
    }

    onInterval()
    {
        if (this.sound.paused)
            return;

        let start = parseInt(this.sound.currentTime * this.sampleRate); 
        let end = start + this.lines.length;
        if (end >this.length)
            end = this.length;
        let buffer = new Float32Array(this.lines.length)
        let j = 0
        for (let i=start; i<end; i++)
        {
            buffer[j] = this.data[i];
            j++;
        }

        for (let i=0; i<this.lines.length; i++)
            this.lines[i].style.transform = "scale(1.0, " + buffer[i]*this._size + ")";
    }

    setData(data)
    {
        this.data = data.getChannelData(this.channelIndex);
        this.duration = data.duration;
        this.length = data.length;
        this.sampleRate = data.sampleRate;

        // represent the number os sample in 1/60 of a seconds
        let interval = this.sampleRate/60;
        this.intervalLength = interval;
    }

}
