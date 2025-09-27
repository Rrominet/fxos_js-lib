class mlEdge
{
	constructor (editor, socketIn = null, socketOut = null)
	{
		
		this.selected = false;
		this.mouseOn = false;

		this.in = socketIn;

		this.out = socketOut;

		this.setSocketsEdges([this.in, this.out]);

		this.editor = editor;
		this.nodes = editor.view.nodes;

		this.draw();
		this.setEvents();
		if (socketIn!=null && socketOut!=null)
			this.update();
	}

	setSocketsEdges(sockets)
	{
		for (let s of sockets)
		{
			if (s !== null)
			{
				if (s.type == INPUT_SOCKET)
				{
					s.edges = [this]; 
				}

				else
				{
					s.edges.push(this);
				}
			}
		}
	}

	draw() 
	{
		this.line = newNode("div", this.nodes, ["mlEdge"]);
		this.line.style.height = "3px";
	}

	setEvents()
	{
		this.line.addEventListener("mouseenter", this.onEnter.bind(this));
		this.line.addEventListener("mouseleave", this.onLeave.bind(this));
		this.line.addEventListener("mousedown", this.onMouseDwn.bind(this));
	}

	static updateLine(x0, y0, x1, y1, line)
	{
		x0 += 7; 
		y0 += 7;

		x1 += 7; 
		y1 += 7;

		let length = Math.sqrt((x0-x1)*(x0-x1) + (y0-y1)*(y0-y1));
		let angle = Math.atan2((y0-y1), (x0-x1)) *  (180/Math.PI);

		let xMid = (x0 + x1) /2; 
		let yMid = (y0 + y1) /2; 


		if(angle >= 90 && angle < 180)
		{
			y0 = y0 - (y0-y1);
		}
		if(angle > 0 && angle < 90)
		{
			x0 = x0 - (x0-x1);
			y0 = y0 - (y0-y1);
		}
		if(angle <= 0 && angle > -90)
		{
			x0 = x0 - (x0-x1);
		}

		line.style.top = yMid + "px";
		line.style.left = (xMid - (length/2)) + "px";

		line.style.width = length + "px";

		line.style.transform = "rotate(" + angle + "deg)";
	}

	update()
	{
		mlEdge.updateLine(this.in.center()[0],
			this.in.center()[1],
			this.out.center()[0],
			this.out.center()[1], this.line); 
	}

	static drawWithMouse(mouseEvent, inSocket, line)
	{
		mlEdge.updateLine(inSocket.center()[0],
			inSocket.center()[1],
			mouseEvent.pageX - 7,
			mouseEvent.pageY - 7, 
			line);
	}

	destroy()
	{
		if (this.in!=null)
			this.in.edges.remove(this);

		if (this.out!=null)
			this.out.edges.remove(this);

        if (this.line && this.line.parentNode)
            this.line.parentNode.removeChild(this.line);
		this.editor.edges.remove(this);
	}

	setSelected (bool = true)
	{
		this.selected = bool

		if (bool)
			this.line.classList.add("selected");

		else
			this.line.classList.remove("selected");
	}

	onMouseDwn(e)
	{
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

		for (let e of this.editor.edges)
		{
			if (e != this)
				e.setSelected(false); 
		}

		if (!this.selected)
			this.setSelected(true);
	}

	onEnter() 
	{
		this.mouseOn = true;
	}

	onLeave()
	{
		this.mouseOn = false;
	}

	serialize()
	{
		let json = {}; 

		json.outId = this.out.id;
		json.inId = this.in.id;

		return json;
	}

	deserialize(json)
	{
		this.out = this.editor.getFromId(json.outId);
		this.in = this.editor.getFromId(json.inId);

		this.setSocketsEdges([this.out, this.in]);

		this.update();
	}
}
