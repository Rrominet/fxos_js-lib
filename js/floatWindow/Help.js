const LEFT = 1;
const RIGHT = 2;
const TOP = 3;
const BOTTOM = 4;
class Help
{
    constructor(elmt, side = RIGHT, htmlContent = "", parent = B)
    {
        this.elmt = elmt; 
        this.parent = parent; 
        this.html = htmlContent; 
        this.side = side;
        this.created = false;
        this.setEvents();
    }

    interface()
    {
        if (!this.created)
        {
            this.div = this.parent.newNode("div", "help");
            this.div.style.position = "fixed";
            if (typeof(this.html) == "string")
            	this.div.innerHTML = this.html;
            else 
            	this.div.set(this.html);
            this.created = true;
        }

    }

    setEvents()
    {
        addEventListener("scroll", () => this.setPos());
        this.elmt.addEventListener("mouseenter", () => this.show());
        this.elmt.addEventListener("mouseleave", () => this.hide());
    }

    show()
    {
        this.interface(); 
        if (this.div)
        {
	        this.setPos(); 
	        this.div.show();
	        this.setPos(); 
	        setTimeout(() => this.div.style.maxHeight = "1000px", 18);
        } 
    }

    hide()
    {
    	if (this.div)
        	this.div.hide();
    }

    setPos()
    {
        if (!this.created)
            return;
        if (!this.div)
        	return;
        if (isPhone())
        {
            this.div.style.top = (this.elmt.bottom() + 10) + "px"; 
            this.div.style.left = "0px"; 
        }
        else 
        {
            let x = this.elmt.getx();
            let y = this.elmt.gety();

            if (this.side == LEFT)
                x -= 50; 
            else if (this.side == RIGHT)
                x += 50; 
            else if (this.side == TOP)
                y -= 50; 
            else if (this.side == BOTTOM)
                y += 30;
            this.div.style.left = x  + "px"; 
            this.div.style.top = y + "px"; 

            if (this.div.bottom() > window.innerHeight)
                this.div.style.top = this.elmt.gety() - this.div.h() - 50 + "px";
            if (this.div.right() > window.innerWidth)
                this.div.style.left = this.elmt.getx() - this.div.w() + "px";
        }
    }

    remove()
    {
    	if (this.div)
    		this.div.remove(); 
    	this.div = null;
    	this.created = true;
    }
}
