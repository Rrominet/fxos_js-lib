class mlNodeEvent extends mlNode
{
	constructor(nodeEditor, name = "My node", x =null, y=null) 
	{
		super(nodeEditor, name, x, y); 
		this.event = true;
	}

	drawBaseContent(name) 
	{
		super.drawBaseContent(name); 

		this.content.listenerDiv = D.createElement("div");
		this.content.listenerDiv.classList.add( "listener"); 
		this.content.listenerDiv.img = this.content.listenerDiv.newNode("img"); 
		this.content.listenerDiv.img.src = "https://motion-live.com/frameworks/images/mlNodeEditor/event-listener.png";

		this.content.insertBefore(this.content.listenerDiv, this.content.labelInput);

		this.content.listenerDiv.img.addEventListener("load", this.updateEdges.bind(this));
		
	}

	isConnectedToEvent() 
	{
		return true;
	}

    //to override
    eventType()
    {
        return "none";
    }

    ifArgStr()
    {
        let s = "if ";
        s += "($argv[1] == \"event_" + this.eventType() + "\")\n";
        s += "{\n";
        return s;
    }

    executeStr(isEvent = false)
    {
        if (this.executed && !isEvent)
            return "";

        let str = ""; 
        for (let i of this.inputs)
        {
            if (i.isConnected())
                str += i.connectedNode().executeStr(isEvent);
        }

        str += "$res_" + this.id + " = $node_" + this.id + "->execute($argv);\n"

        this.executed = true;
        return str;
    }
}
