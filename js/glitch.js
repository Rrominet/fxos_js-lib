class Glitch
{
    constructor(node, time=1000, freq=16)
    {
        this.node = node;
        this.duplicates = [];
        this.time = time;
        this.freq = freq;
        this.startTime = null;
        this.timeoutf = null;

        this.transform = {
            offsetx : 0,
            offsety : 0,
            x : 0,
            y : 0,
            sx  :  1,
            sy : 1
        };

        this._glitch = [];
        this._glitch.push((n) => this.upradeTranformCss(n))
    }

    //only useful if the position is set with transform, if not, no need for this.
    setPositionOffset(x, y)
    {
        this.transform.offsetx = x;
        this.transform.offsety = y;
    }

    addMoveRandomly(min=0, max=100)
    {
        const f = () => {
            this.transform.x = randomInt(min, max);
            this.transform.y = randomInt(min, max);
        };
        this._glitch.push(f);
    }

    addScaleRandomly()
    {
        const f = (node) => {
            let ch = Math.random();
            if (ch < 0.23)
                this.transform.sx = -1;
            else 
                this.transform.sx = 1;
            ch = Math.random();
            if (ch < 0.21)
                this.transform.sy = -1;
            else 
                this.transform.sy = 1;
        };
        this._glitch.push(f);
    }

    upradeTranformCss(node)
    {
        let css = "translate(";
        css += (this.transform.offsetx + this.transform.x) + "px, ";
        css += (this.transform.offsety + this.transform.y) + "px)";
        css += " scale(" + this.transform.sx + ", " + this.transform.sy + ")";
        node.style.transform = css;
    }

    addInsetRandomly(min=0, max=100)
    {
        const f = (node) => {
            let css = "inset(";
            css += randomInt(min, max) + "% ";
            css += randomInt(min, max) + "% ";
            css += randomInt(min, max) + "% ";
            css += randomInt(min, max) + "%)";
            node.style.clipPath = css;
        }
        this._glitch.push(f);
    }

    addFilterRandomly()
    {
        const f = (node) => {
            let css = "invert(" + randomInt(0, 100) + "%) saturate(" + randomInt(0, 100) + "%) brightness(" + randomInt(0, 2) + ") sepia(" + randomInt(0, 100) + "%) hue-rotate(" + randomInt(0, 360) + "deg)";
            node.style.filter = css;
        };
        this._glitch.push(f);
    }

    _glitchOnFrame()
    {
        for (const d of this.duplicates)
        {
            for (const f of this._glitch)
                f(d);
        }

        for (const f of this._glitch)
            f(this.node);
    }

    duplicate(nb)
    {
        for(let i=0; i<nb; i++)
        {
            const d = this.node.duplicate();
            this.duplicates.push(d);
        }
    }

    start()
    {
        this.startTime = new Date();
        this.timeoutf = () =>
        {
            this._glitchOnFrame();
            if (this.startTime.getTime() + this.time >= new Date().getTime())
                setTimeout(() => this.timeoutf(), randomInt(8, this.freq));
            else 
                this.reset();
        };

        setTimeout(() => this.timeoutf(), randomInt(8, this.freq));
    }

    reset()
    {
        for (const d of this.duplicates)
            d.remove();
        this.duplicates = [];
        this.node.style.transform = "translate(" + this.transform.offsetx + "px, " + this.transform.offsety + "px)";
        this.node.style.clipPath = "";
        this.node.style.filter = "";
    }

    glitch()
    {
        this.addMoveRandomly(-100, 100);
        this.addScaleRandomly();
        this.addInsetRandomly(0, 75);
        this.addFilterRandomly();
        this.start();
    }
}

HTMLElement.prototype.glitch = function(time=1000, freq=16, duplicate=3, offsetx=0, offsety=0)
{
    this.glitch = new Glitch(this, time, freq);
    this.glitch.duplicate(duplicate);
    this.glitch.setPositionOffset(offsetx, offsety);
    this.glitch.glitch();
}
