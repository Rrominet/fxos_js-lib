class cvGeometry extends Path2D
{
    constructor (ctx, x, y, fill=true)
    {
        super();
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.center = {};
        this.setCenter();
        this.originalSaved = false;

        //fill to fill the geo els it will be a stroke (trait)
        this.isFill = fill;
    }

    move(x, y)
    {
        this.x += x;
        this.y += y;

        this.setCenter();
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;

        this.setCenter();
    }

    saveCanvas()
    {
        if (!this.originalSaved)
            this.ctx.save();
        this.originalSaved = true;
    }

    setCenter()
    {
        this.center.x = this.x;
        this.center.y = this.y;
    }

    // center is a {} width x and y prop
    rotate(angle, center=null)
    {
        this.saveCanvas();
        if (!center)
            center = this.center;
        this.ctx.translate(center.x, center.y)
        this.ctx.rotate(angle);
        this.ctx.translate(-center.x, -center.y);
    }

    //to override
    //method where to set the Path data.
    _draw()
    {

    }

    scale(x, y=null, center=null)
    {
        if (!center)
            center = this.center;
        this.ctx.translate(this.center.x, this.center.y)
        if (y === null)
            this.ctx.scale(x, x);
        else 
            this.ctx.scale(x, y);
        this.ctx.translate(-this.center.x, -this.center.y)
    }

    draw(restore = true)
    {
        if (this.color.toString().includes("Gradient"))
        {
            this.ctx.fillStyle = this.color;
            this.ctx.strokeStyle = this.color;
        }
        else 
        {
            this.ctx.fillStyle = this.color.asCss();
            this.ctx.strokeStyle = this.color.asCss();
        }

        this.strokeToCtx();
        this._draw();
        this.doFill();

        if (restore)
            this.ctx.restore();
    }

    doFill()
    {
        if (this.isFill)
            this.ctx.fill(this);
        else 
            this.ctx.stroke(this);
    }
    
    erase()
    {

    }

    //color can be a string, a Color Object or a CanvasGradient Object
    setColor(color)
    {
        if (!color)
            color = Color.createFromCss("#000000");
        if (typeof(color) == "string")
            color = Color.createFromCss(color);
        this.color = color;
    }

    setStroke(stroke)
    {
        this.stroke = stroke; 
    }

    strokeToCtx()
    {
        if (!this.stroke)
            return;
        this.ctx.lineWidth = this.stroke.w;
        this.ctx.lineCap = this.stroke.cap;
        this.ctx.lineJoin = this.stroke.join;
        this.ctx.miterLimit = this.stroke.miterLimit;
        if (this.stroke.dash)
            this.ctx.setLineDash(this.stroke.dash)
        else 
            this.ctx.setLineDash([]);
        this.ctx.lineDashOffset = this.stroke.dashOffset;
    }
}

class Stroke
{
    constructor(ctx, w)
    {
        this.ctx = ctx;
        this.w = w;

        // butt or round or square
        this.cap = "butt";

        //bevel or round or miter
        this.join = "miter";
        this.miterLimit = 10.0;

        // [dashSize, blankSize]
        this.dash = null;
        this.dashOffset = 0.0;
    }
}
