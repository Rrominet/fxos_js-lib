class mlNodePageVisited extends mlNode
{
	constructor(nodeEditor, name = "My node", x =null, y=null)
	{
		super(nodeEditor, name, x, y);
		this.type = PAGE_VISITED;
	}

	setEvents()
	{
		super.setEvents();
	}

	drawContent()
	{
		this.content.page = this.content.newInput("text");
		this.content.page.placeholder = "page url";
		this.content.page.title       = "page url";

		this.content.newBr();

		this.content.max = this.content.newInput("number");
		this.content.max.placeholder = "Maximum visit";
		this.content.max.title       = "Maximum visit";

		this.content.infos = this.content.newNode("div");

		this.content.infos.error2 = this.content.infos.newNode("p", "infos");
		this.content.infos.error2.innerHTML = `This URL must have have an email count file.<br>
		The name of this file need to be :<br>
		<i>'the/url/path/THE_PAGE_NAME-emails.node'</i>`; 
		this.content.infos.error2.hidden = false;

		this.addOutput("Contact");
	}

	serialize() 
	{
		let json = super.serialize();
		json.page = this.content.page.value;
		json.max = this.content.max.value;

		return json

	}

	deserialize(json, useId=true)
	{
        super.deserialize(json, useId);
		this.content.page.value = json.page;
		this.content.max.value = json.max;
	}

	initStr()
	{
		super.initStr();
		
		let str = "$node_" + this.id + " = new mlNodePageVisited;\n";
		str += "$node_" + this.id + "->data['page'] = '" + this.content.page.value + "';\n";
		str += "$node_" + this.id + "->data['max'] = '" + this.content.max.value + "';\n";
		str += "$node_" + this.id + "->data['id'] = '" + this.id + "';\n";
		return str;
	}

	executeStr()
	{
		if (this.executed)
			return "";

		this.executed = true;
		return "$res_" + this.id + " = $node_" + this.id + "->execute();\n";
	}
}