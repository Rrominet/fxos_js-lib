class cvRect extends cvGeometry
{
    constructor(ctx, x, y, w, h, fill=true)
    {
        super(ctx, x, y, fill);
        this.w = w;
        this.h = h;
        this.setCenter();
    }

    setCenter()
    {
        this.center.x = this.x + 0.5*this.w;
        this.center.y = this.y + 0.5*this.h;
    }

    _draw()
    {
        this.rect(this.x, this.y, this.w, this.h);
    }
}
