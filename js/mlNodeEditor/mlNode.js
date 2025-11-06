class mlNode
{
	constructor(nodeEditor, name = "My node", x =null, y=null) 
	{
		//attributes// 
		this.editor = nodeEditor
		this.container = this.editor.view.nodes;
		this.sideHtml = null; // side window with more infos on the nodes (san show and hide it)
		this.content = null; // actual content to be drawn on the canvas
		this.inputs = []; 
		this.outputs = []; 
		// this.edges = [];
		this.x = x; 
		this.y = y;
		this.selected = false;
		this.mouseOn = false;
		this.type = -1;

		this.executed = false;

		this.id = this.editor.uniqueId();
		this.event = false;

		//END attributes// 

		this.draw(name);

		this.setEvents();
	}

	initializeCoord(x, y)
	{
		if (x === null)
			this.x = this.container.getBoundingClientRect().width/2; 
		else 
			this.x = x;  

		if (y === null)
			this.y = this.container.getBoundingClientRect().height/2; 
		else 
			this.y = y;  
	}

	drawBaseContent(name) 
	{
		this.content.labelInput = newNode("input", this.content, "modify");  
		this.content.labelInput.hidden = true;

		this.content.label = newNode("h2", this.content, "label");
		this.content.label.innerHTML = name;
	}

	addInput(socketName, color)
	{
		let socket = new mlSocket(this, socketName, INPUT_SOCKET, color)
		this.content.append(socket.visual);
		this.inputs.push(socket);
	}

	addOutput(socketName, color)
	{
		let socket = new mlSocket(this, socketName, OUTPUT_SOCKET, color)
		this.content.append(socket.visual);
		this.outputs.push(socket);
	}

	drawContent() 
	{
		this.content.input = newNode("input", this.content); 
	}

	draw(name)
	{
		this.content = newNode("div", this.container, ["node"]); 
		this.initializeCoord(this.x, this.y);
		this.coordToStyle();
		this.drawBaseContent(name);
		this.drawContent();
	}

	setEvents() 
	{
		this.content.addEventListener("mousedown", this.onMouseDwn.bind(this)); 
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
			this.content.classList.add("selected");
		}
		else
		{
			this.content.classList.remove("selected");
		}
	}

	onMouseDwn(e) 
	{
		for (let s of this.inputs)
		{
			if (s.mouseOn)
			{
				for (let n of this.editor.nodesList)
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
				for (let n of this.editor.nodesList)
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
		
		for (let n of this.editor.nodesList)
		{
			if (n != this)
				n.setSelected(false); 
		}

		this.setSelected(true);
	}

	clearSocketsSelection()
	{
		for (let s of this.inputs)
			s.selected = false;
		for (let s of this.outputs)
			s.selected = false;
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

	setContentVisible(bool = true) 
	{

	}

	destroy() 
	{
		this.container.removeChild(this.content); 
		this.editor.nodesList.remove(this);

		for (let e of this.edges())
			e.destroy();
	}

	edges()
	{
		let list = [];

		for (let s of this.inputs)
		{
			for(let e of s.edges)
			{
				list.push(e);
			}
		}

		for (let s of this.outputs)
		{
			for(let e of s.edges)
			{
				list.push(e);
			}
		}

		return list;
	}

	updateEdges()
	{
		for (let s of this.inputs)
		{
			for (let edge of s.edges)
				edge.update();
		}

		for (let s of this.outputs)
		{
			for (let edge of s.edges)
				edge.update();
		}
	}

	isFirst() 
	{
		if (this.inputs.length ==0)
			return true;

		else
		{
			let edgesNumber = 0

			for (let input of this.inputs)
			{
				if (input.edges.length>0)
					edgesNumber ++;
			}

			if (edgesNumber == 0)
				return true;
		}

		return false;
	}

	isLast()
	{
		if (this.outputs.length ==0)
			return true;

		else
		{
			let edgesNumber = 0

			for (let output of this.outputs)
			{
				if (output.edges.length>0)
					edgesNumber ++;
			}

			if (edgesNumber == 0)
				return true;
		}

		return false;
	}

	inputsNodes()
	{
		let nodes = [];
		for (let i of this.inputs)
		{
			nodes.push(i.connectedNode());
		}
	}

	serialize() 
	{
		let json = {};

		json.id = this.id;
		json.type = this.type;
		json.label = this.content.label.innerText;
		json.x = this.x; 
		json.y = this.y;

		json.inputs = this.inputs.serialize();
		json.outputs = this.outputs.serialize();

		return json;
	}

	deserialize(json)
	{
		this.id = json.id;

		this.content.label.innerText = json.label; 
		this.x = json.x; 
		this.y = json.y; 

		for (let i= 0; i<this.inputs.length; i++)
		{
			this.inputs[i].deserialize(json.inputs[i]);
		}

		for (let i= 0; i<this.outputs.length; i++)
		{
			this.outputs[i].deserialize(json.outputs[i]);
		}

		this.coordToStyle();
	}

	initStr()
	{
		this.executed = false;
	}

	executeStr(isEvent = false)
	{
		if (this.executed)
			return "";

		let str = ""; 
		for (let i of this.inputs)
		{
			if (i.isConnected())
				str += i.connectedNode().executeStr(isEvent);
		}


		str += "$res_" + this.id + " = $node_" + this.id + "->execute([";
		for (let i of this.inputs)
		{
			if (i.isConnected())
			{
				str += "$res_" + i.connectedNodeId();
				str += ",";
			}
		}
		str = str.slice(0, -1);


		str += "]);\n"

		this.executed = true;

		return str;
	}

	isConnectedToEvent()
	{
		let result = false;

		for (let i of this.inputs)
		{
			if (i.isConnected())
				if (i.connectedNode().event == true)
					return true; 
				else 
					result = i.connectedNode().isConnectedToEvent();
		}

		return result;
	}
}
