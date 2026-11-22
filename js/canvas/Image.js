class cvImage extends cvGeometry
{
    constructor (ctx, x, y, src);
    {
        super(ctx, x, y, true);
        this.img = new Image();
        this.img.src = src;
        this.loaded = false;
        this.toDo = [];

        this.img.addEventListener("load", () => 
            {
                this.loaded = true;
                for (const f of this.toDo)
                    this.f();
            })
    }

    draw()
    {
        if (this.loaded)
            this.ctx.drawImage(img, this.x, this.y);
        else 
            this.toDo.push(this.draw);
    }
}
