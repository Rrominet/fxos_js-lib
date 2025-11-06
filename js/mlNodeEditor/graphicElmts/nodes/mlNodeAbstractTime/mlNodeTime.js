class mlNodeTime extends mlNodeAbstractTime
{
	constructor(nodeEditor, name = "My node", x =null, y=null)
	{
		super(nodeEditor, name, x, y);
		this.type = TIME;
	}

	drawContent()
	{
		super.drawContent(); 
		this.addOutput("Time", "green");
	}
}