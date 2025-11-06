class mlContainer extends mlGraphicElmt
{
	constructor(nodeEditor, name = "My node", x =null, y=null) 
	{
		super(nodeEditor, name, x, y);
		this.chhildrenIds = [];
		this.children = [];
		this.onResize = false;
		this.type = CONTAINER;

		this.content.style.width = this.content.getBoundingClientRect().width + "px"; 
		this.content.style.height = this.content.getBoundingClientRect().height + "px";
	}

	draw(name)
	{
		super.draw(name); 
		this.content.classList.add("container");
	}

	drawContent() 
	{
		this.content.resize = this.content.newNode("div", "resize");
	}

	setEvents() 
	{
		super.setEvents(); 
		this.content.resize.addEventListener("mouseenter", this.onResizeEnter.bind(this));
		this.content.resize.addEventListener("mouseleave", this.onResizeLeave.bind(this));
	}

	move(x = 0, y = 0)
	{
		super.move(x,y);

		for (let c of this.children)
			c.move(x, y);
	}

	size(x, y)
	{
		if (x<0)
			x=0; 
		if (y<0)
			y=0;

		this.content.style.width = x + "px"; 
		this.content.style.height = y + "px"; 
	}

	resize(x, y)
	{
		let lastx = this.content.style.width.replace("px", "");
		let lasty = this.content.style.height.replace("px", "");

		x += parseInt(lastx); 
		y += parseInt(lasty); 

		this.size(x, y);
	}

	onResizeEnter(e) 
	{
		this.onResize = true;
	}

	onResizeLeave(e)
	{
		this.onResize = false;
	}

	addChild(elmt)
	{
		if (elmt == this)
			return; 

		this.children.push(elmt); 
		elmt.parent = this; 
	}

	removeChild(elmt)
	{
		this.children.remove(elmt); 
		elmt.parent = null;
	}

	clearChildren() 
	{
		for (let c of this.children)
			c.parent = null;

		this.children = [];
	}

	unParent()
	{
		this.clearChildren();
	}

	destroy()
	{
		super.destroy(); 
		this.clearChildren();
	}

	serialize() 
	{
		let json = super.serialize();

		json.w = this.content.style.width; 
		json.h = this.content.style.height; 

		json.children = []; 

		for (let c of this.children)
			json.children.push(c.id); 

		return json;
	}

	deserialize(json)
	{
		super.deserialize(json);
		this.chhildrenIds = [];

		this.content.style.width = json.w; 
		this.content.style.height = json.h; 

		for (let id of json.children)
		{
			this.chhildrenIds.push(id);
		}
	}

	childrenIdsToElmts()
	{
		for (let id of this.chhildrenIds)
			this.addChild(this.editor.getFromId(id));
	}
}
