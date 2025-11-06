class mlNodePreventDoubleEmails extends mlNode
{
	constructor(nodeEditor, name = "My node", x =null, y=null)
	{
		super(nodeEditor, name, x, y);
		this.type = PREVENT_DOUBLE_EMAILS;
	}

	drawContent()
	{
		this.content.txt = newNode("label", this.content, "content"); 
		this.content.txt.innerHTML = "Remove emails in double<br> in the list";

		this.addInput("List");
		this.addOutput("List");
	}

	initStr()
	{
		super.initStr();

		let str = "$node_" + this.id + " = new mlNodePreventDoubleEmails;\n";
		return str;
	}
}