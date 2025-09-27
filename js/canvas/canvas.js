HTMLElement.prototype.newCanvas = function (w, h, cls="", id="")
{
    canvas = this.newNode("canvas", cls, id);
    canvas.ctx2d = canvas.ctx("2d");
    canvas.ctx2d.geometries = [];
    canvas.setSize(w, h);
    addEventListener("resize", () => canvas.setSize(w, h));
    addEventListener("load", () => canvas.setSize(w, h));

    return canvas;
}

HTMLCanvasElement.prototype.setWidth = function(val)
{
    if (val)
        this.w = val;
    else 
        val = this.w;
    if (val == "100%")
    {
        this.setAttribute("width", innerWidth);
        this.ctx2d.w = innerWidth;
        return;
    }
    this.setAttribute("width", val);
    this.ctx2d.w = cal;
}

HTMLCanvasElement.prototype.setHeight = function(val)
{
    if (val)
        this.h = val;
    else 
        val = this.h;
    if (val == "100%")
    {
        this.setAttribute("height", innerHeight);
        this.ctx2d.h = innerHeight;
        return;
    }
    this.setAttribute("height", val);
    this.ctx2d.h = cal;
}

HTMLCanvasElement.prototype.setSize = function(w, h)
{
    this.setWidth(w);
    this.setHeight(h);
}

HTMLCanvasElement.prototype.ctx = function(type)
{
    return this.getContext(type);
}

CanvasRenderingContext2D.prototype.circle = function (x, y, r, color=null, fill=true)
{
    const c = new cvCircle(this, x, y, r, fill);
    c.setColor(color);
    this.geometries.push(c);
    return c;
}

CanvasRenderingContext2D.prototype.rectangle = function (x, y, w, h, color=null, fill=true)
{
    const c = new cvRect(this, x, y, w, h, fill);
    c.setColor(color);
    this.geometries.push(c);
    return c;
}

CanvasRenderingContext2D.prototype.draw = function ()
{
    for (const geo of this.geometries)
        geo.draw();
}

CanvasRenderingContext2D.prototype.clear = function ()
{
    this.clearRect(0, 0, this.w, this.h);
}

