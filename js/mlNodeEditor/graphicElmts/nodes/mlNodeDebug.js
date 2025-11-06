class mlNodeDebug extends mlNode
{
	constructor(nodeEditor, name = "Debug", x=null, y=null)
	{
		super(nodeEditor, name, x, y);
		this.type = DEBUG;
	}

	drawContent() 
	{
		this.addInput("Any type", "black");
	}

	initStr()
	{
		super.initStr();
		let str = "$node_" + this.id + " = new mlNodeDebug;\n";
		return str;
	}
}
