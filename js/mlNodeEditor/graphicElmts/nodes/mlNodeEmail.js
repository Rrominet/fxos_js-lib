class mlNodeEmail extends mlNode
{
	constructor(nodeEditor, name = "My node", x =null, y=null)
	{
		super(nodeEditor, name, x, y);
		this.type = EMAIL;
		this.emailContent = new EmailContent(this);

		this.addEvents();
	}
	
	drawContent() 
	{
		this.content.input = newNode("input", this.content, "content"); 
		this.content.input.placeholder = "Objet";
		this.content.input.title = "Objet";

        this.content.type = this.content.newNode("select");
        this.content.type.addOption("normal");
        this.content.type.addOption("broadcast");

		this.content.showEmailButton = newNode("button", this.content, "content"); 
		this.content.showEmailButton.innerText = "Email content"

		this.addInput("Contacts list");
	}

	serialize() 
	{
		let json = super.serialize();
		json.object = this.content.input.value;
		json.typing = this.emailContent.content.writer.definitveHtml();
        json.emailType = this.content.type.value;
		return json;
	}

	addEvents()
	{
		super.setEvents();
		this.content.showEmailButton.addEventListener("click", this.emailContent.toggle.bind(this.emailContent));
	}

	deserialize(json, useId = true)
	{
		super.deserialize(json, useId);
		this.content.input.value = json.object;
		this.emailContent.content.writer.div.writer.innerHTML = json.typing;

        if (json.emailType)
            this.content.type.value = json.emailType;
	}

	initStr()
	{
		super.initStr();

		let str = "$node_" + this.id + " = new mlNodeEmail;\n";	
		str += "$node_" + this.id + "->data['id'] = '" + this.id + "';\n" ;
		str += "$node_" + this.id + "->data['object'] = \"" + this.content.input.value.replace(/\"/g, "\\\"") + "\";\n" ;
		str += "$node_" + this.id + "->data['content'] = \"" + this.emailContent.content.writer.definitveHtml().replace(/\"/g, "\\\"") + "\";\n" ;
		str += "$node_" + this.id + "->data['emailType'] = '" + this.content.type.value + "';\n" ;

		return str;
	}

}
