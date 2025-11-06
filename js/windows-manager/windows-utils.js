
HTMLElement.prototype.setDraggable = function (x=50, y=250)
{
    this.x = x;
    this.y = y;
    this.down = 0;
    this.up = 0;
    this.onClicked = [];
    this.dragged = false;

    const onUp = () => 
    {
        this.dragged = false;
        this.style.cursor = "pointer";

        this.up = new Date().getTime();

        if (this.down == 0)
            return;
        testlog("click interval");
        testlog(this.up - this.down);
        if (this.up - this.down<200)
        {
            for (const f of this.onClicked)
                f();
        }
    };

    if (!isTouchable())
    {
        this.addEventListener("mousedown", (e) => 
            {
                if (e.button != 0)
                    return;
                this.dragged = true; this.style.cursor = "grabbing"; this.down = new Date().getTime();
            });
        this.addEventListener("mouseup", onUp);
    }

    else 
    {
        this.addEventListener("touchstart", () => {this.dragged = true; this.down = new Date().getTime();});
        this.addEventListener("touchend", onUp);
    }

    this.style.margin = "0";
    this.style.position = "fixed";
    this.style.cursor = "pointer";

    this.style.left = this.x + "px";
    this.style.top = this.y + "px";
    this.style.bottom = "initial";
    this.style.right = "initial";

    const onMove = (e) => 
    {
        if (!this.dragged)
            return;
        if (e.touches)
        {
            e = e.touches[0];
            this.x += e.clientX - this.x;
            this.y += e.clientY - this.y;
        }
        else 
        {
            this.x += e.movementX;
            this.y += e.movementY;
        }

        this.style.left = this.x + "px";
        this.style.top = this.y + "px";
    }

    addEventListener("mousemove", (e) => onMove(e));
    addEventListener("touchmove", (e) => onMove(e));
}
