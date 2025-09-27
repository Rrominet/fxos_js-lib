class mlGraphicElmt
{
	constructor(nodeEditor, name = "My node", x =null, y=null) 
	{
		//attributes// 
		this.editor = nodeEditor
		this.container = this.editor.view.nodes;
		this.sideHtml = null; // side window with more infos on the nodes (can show and hide it)
		this.content = null; // actual content to be drawn on the canvas
		this.inputs = []; 
		this.outputs = []; 
		// this.edges = [];
		this.x = x; 
		this.y = y;
		this.selected = false;
		this.mouseOn = false;
		this.type = -1;

		this.id = this.editor.uniqueId();
		this.event = false;
		this.parent = null;

		//END attributes// 

		this.draw(name);

		this.setEvents();
	}

	initializeCoord(x, y)
	{
		if (x === null)
			this.x = mouseX; 
		else 
			this.x = x;  

		if (y === null)
			this.y = mouseY; 
		else 
			this.y = y;  
	}

	drawBaseContent(name) 
	{
		this.content.labelInput = newNode("input", this.content, "modify");  
		this.content.labelInput.hidden = true;
        this.content._id = this.content.newTitle("label", this.id, "id");
		this.content.label = newNode("h2", this.content, "label");
		this.content.label.innerHTML = name;
	}

	drawContent() 
	{

	}

	draw(name)
	{
		this.content = newNode("div", this.container, "elmt"); 
		this.initializeCoord(this.x, this.y);
		this.coordToStyle();
		this.drawBaseContent(name);
		this.drawContent();
	}

	setEvents() 
	{
		this.content.addEventListener("mousedown", this.onMouseDwn.bind(this)); 
		this.content.addEventListener("mouseup", this.onMouseUp.bind(this)); 
		this.content.addEventListener("mouseenter", this.onMouseEnter.bind(this)); 
		this.content.addEventListener("mouseleave", this.onMouseLeave.bind(this));

		this.content.label.addEventListener("dblclick", function(e) 
		{
			this.content.labelInput.hidden = false; 
			this.content.labelInput.focus();
			this.content.labelInput.setSelectionRange(0, this.content.labelInput.value.length);
			this.content.labelInput.value = this.content.label.textContent;
		}.bind(this) );

		this.content.labelInput.addEventListener("keyup", function (e) 
		{
			if (e.keyCode == 27)
			{
				this.content.labelInput.hidden = true;
			}

			else if (e.keyCode == 13)
			{
				this.content.label.innerText = this.content.labelInput.value;
				this.content.labelInput.hidden = true;;
			}

		}.bind(this));


	}

	setSelected(bool = true)
	{
		this.selected = bool;

		if (this.selected)
		{
			this.editor.lastSelected = this;
			this.content.classList.add("selected");
		}
		else
		{
			this.editor.lastSelected = this;
			this.content.classList.remove("selected");
		}
	}

	onMouseDwn(e) 
	{
		for (let s of this.inputs)
		{
			if (s.mouseOn)
			{
				for (let n of this.editor.elmts)
				{
					n.setSelected(false); 
				}

				s.selected = true;
				return;
			}
		}

		for (let s of this.outputs)
		{
			if (s.mouseOn)
			{
				for (let n of this.editor.elmts)
				{
				
					n.setSelected(false); 
				}

				s.selected = true;
				return;
			}
		}

		if (e.ctrlKey)
		{
			this.setSelected(false); 
			return;
		}

		if (e.shiftKey)
		{
			this.setSelected(true); 
			return;
		}
		
		for (let n of this.editor.elmts)
		{
			if (n != this)
				n.setSelected(false); 
		}

		this.setSelected(true);
		this.setZIndex();
		
	}
	setZIndex() 
	{

	}

	onMouseUp(e)
	{

	}

	onMouseEnter()
	{
		this.mouseOn = true;
	}

	onMouseLeave()
	{
		this.mouseOn = false;

	}

	update() 
	{

	}

	coordToStyle() 
	{
		this.content.style.left = this.x + "px"; 
		this.content.style.top = this.y + "px"; 
	}

	move(x = 0, y = 0)
	{
		this.x += (x*1.0)/devicePixelRatio; 
		this.y += (y*1.0)/devicePixelRatio; 

		this.coordToStyle(); 
	}

	setPosition(x=0, y=0)
	{
		this.x = x; 
		this.y = y; 

		this.coordToStyle(); 
	}

	destroy() 
	{
		this.editor.elmts.remove(this); 
		this.container.removeChild(this.content); 
	}

	unParent() 
	{
		if (this.parent == null)
			return;

		this.parent.removeChild(this);

		this.parent = null; 

	}

	serialize() 
	{
		let json = {};

		json.id = this.id;
		json.type = this.type;
		json.label = this.content.label.innerText;
		json.x = this.x; 
		json.y = this.y;

		return json;
	}

	deserialize(json, useId=true)
	{
        if (useId)
        {
            this.id = json.id;
            this.content._id.innerHTML = this.id;
        }

		this.content.label.innerText = json.label; 
		this.x = json.x; 
		this.y = json.y;

		this.coordToStyle();
	}
}
