class PaintableCanvas
{
    constructor(parent=B)
    {
        this.parent = parent;
        this.canvas = this.parent.newNode("canvas");
        this.canvas.classList.add("paintable")
        this.ctx = this.canvas.getContext("2d");
        this.drawCount = 0;

        this.lineWidth = 3;
        this.color = "black";
        this.painting = false;

        this.setEvents();
    }

    width()
    {
        return this.canvas.width;
    }

    height()
    {
        return this.canvas.height;
    }

    setWidth(w)
    {
        this.canvas.width = w; 
    }

    setHeight(h)
    {
        this.canvas.height = h;
    }

    setEvents()
    {
        if (!isPhone())
        {
            this.canvas.addEventListener("mousedown", (e) => this.startDraw(e));
            this.canvas.addEventListener("mouseup", (e) => this.endDraw(e));
            this.canvas.addEventListener("mousemove", (e) => this.draw(e));
        }
        else 
        {
            this.canvas.addEventListener("touchstart", (e) => {e.preventDefault(); this.startDraw(e.touches[0])});
            this.canvas.addEventListener("touchend", (e) => {e.preventDefault(); this.endDraw(e.touches[0])});
            this.canvas.addEventListener("touchcancel", (e) => {e.preventDefault(); this.endDraw(e.touches[0])});
            this.canvas.addEventListener("touchmove", (e) => {e.preventDefault(); this.draw(e.touches[0])});
        }

        this.canvas.addEventListener("mouseleave", (e) => this.endDraw(e));
        this.canvas.addEventListener("mouseenter", (e) => this.endDraw(e));
    }

    startDraw(e)
    {
        this.painting = true;
        this.draw(e);
        this.drawCount++;
    }

    endDraw(e)
    {
        this.painting = false;
        this.ctx.beginPath();
    }

    // actually draw the line between the last mouse event pos and the current one
    draw(e)
    {
        if (!this.painting)
            return;

        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.strokeStyle = this.color;
        // Get the mouse position relative to the canvas
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    clear()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCount = 0;
    }

    // the data urlencoded as base64.
    exportToImg(format, quality)
    {
        return this.canvas.toDataURL(`image/${format}`, quality);
    }
}
