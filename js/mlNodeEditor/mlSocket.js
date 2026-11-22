class mlSocket
{
	constructor(mlNode, name = "", type=INPUT_SOCKET, color="yellow")
	{
		this.node = mlNode;
		this.edges = [];
		this.type = type;
		this.selected = false;
		this.color = color;

		this.id = mlNode.editor.uniqueId();

		this.draw(name, type, color);
		this.setEvents();
	}

	setEvents()
	{
		this.visual.point.addEventListener("mouseenter", this.onEnter.bind(this));
		this.visual.point.addEventListener("mouseleave", this.onLeave.bind(this));
	}

	draw(name, type, color)
	{
		if (type == INPUT_SOCKET)
			this.visual = newNode("div", this.node.content, ["socket", "input"]);
		else
			this.visual = newNode("div", this.node.content, ["socket", "output"]);
		this.visual.point = newNode("div", this.visual, ["point", color]);
		this.visual.name = newNode("div", this.visual, "name");
		this.visual.name.textContent = name;
	}

    name()
    {
        return this.visual.name.innerText;
    }

	hide()
	{
		this.visual.hidden = true;
		this.removeConnectedEdges();
	}

    remove()
    {
        this.removeConnectedEdges(); 
        this.visual.remove();
    }

	show()
	{
		this.visual.hidden = false;
	}

	setVisible(bool)
	{
		if (!bool)
			this.hide(); 
		else 
			this.show();
	}

	center()
	{
		let r = this.visual.point.getBoundingClientRect(); 
		let x = (r.left + window.scrollX)
		let y = (r.top + window.scrollY)

		return [x, y];
	}

	onEnter() 
	{
		this.mouseOn = true;
	}

	onLeave()
	{
		this.mouseOn = false;;
	}

	serialize()
	{
		let json = {}; 
		json.id = this.id
		return json;
	}

	deserialize(json, useId=true)
	{
		if (typeof(json) != "undefined" && useId)
			this.id = json.id;
		else 
			this.id = uniqueId();
	}

	connectedSocket() 
	{
		if (!this.isConnected())
			return null;

		if (this.type == INPUT_SOCKET)
		{
			return this.edges[0].out;
		}

		else if (this.type == OUTPUT_SOCKET)
		{
			return this.edges[0].in;
		}
	}

	connectedSocketId() 
	{
		if (this.connectedSocket() === null)
			return "__id_error__";

		return this.connectedSocket().id;
	}

	connectedNode() 
	{
		if (this.connectedSocket() === null)
			return null;

		return this.connectedSocket().node;
	}

	connectedNodeId() 
	{
		if (this.connectedSocket() === null)
			return "__id_error__";

		return this.connectedNode().id;
	}

	isConnected()
	{
		if (this.edges.length>0)
			return true; 
		return false;
	}

	removeConnectedEdges()
	{
		for (let edge of this.edges)
		{
			edge.destroy();
		}
	}

	executeStr()
	{
		
	}
}
