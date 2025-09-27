class Slider extends ProgressBar
{
    constructor(parent, frontColor = "#616161", backColor = "#b7b5b5", params =
        {
            width : "100%", 
            height : "8px",
            borderRadius : "8px",
        })
    {
        super(parent, frontColor, backColor, params);
        this._drag = false;
        this._onChange = [];
        this.connect = this.link; // this is a method

		this.front.style.transition = "inherit";
        this.back.classList.add("slider");
        this.setMouseEvents();
    }

    static linked(object, propertyName, parent, frontColor = "#616161", backColor = "#b7b5b5", params =
        {
            width : "100%", 
            height : "8px",
            borderRadius : "8px",
        })
    {
        const sl = new Slider(parent, frontColor, backColor, params);
        sl.link(object, propertyName);
        return sl;
    }

    link(object, productName)
    {
        this.addOnChange((val) => 
            {
                object[productName] = val;
            });
        this.setValue(object[productName]);
    }

    setDragging(val=true)
    {
        this._drag = val;
        if (val)
            B.style.userSelect = "none";
        else 
            B.style.userSelect = "initial";
    }

    setMouseEvents()
    {
        if (!isPhone())
        {
            this.back.addEventListener("mousedown", () => this.setDragging());
            this.front.addEventListener("mousedown", () => this.setDragging());
            D.addEventListener("mouseup", () => this.setDragging(false));
        }

        else 
        {
            this.back.addEventListener("touchstart", () => this.setDragging());
            this.front.addEventListener("touchstart", () => this.setDragging());
            D.addEventListener("touchend", () => this.setDragging(false));
            D.addEventListener("touchcancel", () => this.setDragging(false));
        }

        const move = (e) => 
        {
            if (!this._drag)
                return;

            let coef = e.pageX - this.back.x();
            coef = coef*1.0 / this.back.w();
            if (coef<0)
                coef = 0;
            else if (coef >1)
                coef = 1;

            this.set(coef);

            for (const f of this._onChange)
                f(coef);
        }

        if (!isPhone())
            D.addEventListener("mousemove", move);
        else 
        {
            D.addEventListener("touchmove", (e) => 
                {
                    if (!this._drag)
                        return;
                    e.preventDefault();
                    move(e.touches[0]);
                }, {passive : false});
            
        }
    }

    addOnChange(f)
    {
        this._onChange.push(f);
    }

    setNTrigger(value)
    {
        this.set(value);
        for (const f of this._onChange)
            f(value);
    }
}
