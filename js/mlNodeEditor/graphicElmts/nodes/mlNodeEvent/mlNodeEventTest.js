class mlNodeEventTest extends mlNodeEvent
{
	constructor(nodeEditor, name = "My node", x=null, y=null)
	{
		super(nodeEditor, name, x, y);
		this.type = TEST;
	}

	drawContent()
	{
		this.addOutput("Time", "green");
	}

	initStr()
	{
		super.initStr();
		
		let str = "$node_" + this.id + " = new mlNodeEventTest;\n";
		return str;
	}

    //isEvent arg is never used. But its stay for historical reason
	executeStr(isEvent = false)
	{
        let s = super.executeStr(isEvent);
		return s;
	}

    eventType()
    {
        return "test";
    }
}
