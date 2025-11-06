class mlNodeNewsletter extends mlNode
{
	constructor(nodeEditor, name = "My node", x =null, y=null)
	{
		super(nodeEditor, name, x, y);
		this.type = NEWSLETTER;
	}

	drawContent() 
	{
		this.content.legend = this.content.newNode("div"); 
		this.content.legend.txt = this.content.legend.newNode("p"); 
		this.content.legend.txt.innerText = `Send the newsletter at the given time
		and the given email list`;

		this.content.options = this.content.newNode("div"); 
		let newsletters = [
		["MLT : Newsletter abonnés", "mlt-newsletter-abonnes"]
		]

		this.content.options.newsletters = this.content.options.labelSelect(newsletters, "");

		this.addInput("Contacts list");
		this.addInput("Time", "green");
	}

	serialize() 
	{
		let json = super.serialize();
		json.newsletter = this.content.options.newsletters.getValue();

		return json

	}

	deserialize(json, useId=true)
	{
        super.deserialize(json, useId);
		this.content.options.newsletters.setValue(json.newsletter);
	}

	initStr()
	{
		super.initStr();

		let str = "$node_" + this.id + " = new mlNodeNewsletter;\n";	
		str += "$node_" + this.id + "->data['newsletter'] = '" + this.content.options.newsletters.getValue() + "';\n" ;

		return str;
	}
}