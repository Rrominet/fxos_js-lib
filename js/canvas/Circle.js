class cvCircle extends cvGeometry
{
    constructor (ctx, x, y, r, fill=true)
    {
        super(ctx, x, y, fill);
        this.r = r;
    }

    move()
    {

    }

    _draw()
    {
        this.arc(this.x, this.y, this.r, 0, Math.PI*2)
    }
    
    erase()
    {

    }

}
