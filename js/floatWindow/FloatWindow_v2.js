class FloatWindow
{
	constructor(parent = B, movable=false, removeOnClose=false)
	{
		this.parent = parent;
		this.drag = false;
		this.removeOnClose = removeOnClose;
		this.interface(movable);
		this.setEvents();
	}

    baseInterface()
    {
		this.div = this.parent.newNode("div", "FloatWindow");
    }

	interface(movable)
	{
        this.baseInterface();
		if (movable)
		{
			this.div.move = this.div.newNode("div", "moveZone");
		}
		this.div.close = this.div.newNode("div", "close");
		this.div.close.button = this.div.close.newButton("<img src='" + FM + "/js/floatWindow/images/close.png' />");
		this.div.close.button.className = "close";
		this.content = this.div.newNode("div", "content");
		this.footer = this.div.newNode("div", "footer");
		this.div.hidden = true;

		if (movable)
		{
			this.setMovable();
		}

	}

	set(elmt)
	{
		this.content.innerHTML = "";
		this.add(elmt);
	}

	add(elmt)
	{
		this.content.append(elmt);
	}

	prepend(elmt)
	{
		this.content.prepend(elmt);
	}

	setHtml(html)
	{
		this.content.innerHTML = hmlt;
	}

	addHtml(html)
	{
		let newNode = this.content.newNode("div"); 
		newNode.innerHTML = html;
	}

	setMovable()
	{
		this.div.move.addEventListener("mousedown", this.mouseDwn.bind(this));
		this.div.move.addEventListener("mouseup", this.mouseUp.bind(this));
		B.addEventListener("mousemove", this.mouseMove.bind(this));
		// B.addEventListener("mousemove", this.mouseMove.bind(this));
	}

	mouseMove(e)
	{
		if (!this.drag)
			return; 

		this.div.style.marginTop = "0";
		this.div.style.margin = "0";
		this.div.style.left = (e.clientX - 150) + "px";
		this.div.style.top = (e.clientY - 40) + "px";
	}

	mouseDwn()
	{
		this.drag = true;
	}

	mouseUp()
	{
		this.drag = false;
	}

	setEvents()
	{
		this.div.close.button.addEventListener("click", () => this.close());
	}

	show()
	{
		this.div.hidden = false;
	}

	hide()
	{	
		this.div.hidden = true;
	}

	//alias de this.hide();
	close()
	{
		if (!this.removeOnClose)
			this.hide();
		else 
			this.remove();
	}

	toggle()
	{
		this.div.hidden = !this.div.hidden;
	}

	remove()
	{
		this.div.remove();
	}
}

class MaskFloatWindow extends FloatWindow
{
    constructor(parent=B, movable=false, removeOnClose=false)
    {
        super(parent, movable, removeOnClose);
        this.div.hidden = false;
        this.hide();
    }

    baseInterface()
    {
        this.mask = this.parent.newNode("div", ["FloatWindow", "mask"]); 
        this.div = this.mask.newNode("div", "FloatWindow");
    }

    hide()
    {
        this.mask.hide();
    }

    show()
    {
        this.mask.show();
    }
}

function fw_init()
{
	newCss(FM + "/css/FloatWindow_v2.css");
}

fw_init();
