class mlNodeOptIn extends mlNode
{
	constructor(nodeEditor, name = "My node", x =null, y=null)
	{
		super(nodeEditor, name, x, y);
		this.type = OPT_IN;
	}

	drawContent()
	{
		this.content.optIn = newNode("select", this.content, "content");

		this.content.optIn.innerHTML = `
		<option value='abonne'>Nouvel abonné</option>
		<option value='download'>Téléchargement fichiers</option>
		`

		this.addOutput("Email");
	}

	serialize() 
	{
		let json = super.serialize();
		json.optIn = this.content.optIn.value;

		return json

	}

	deserialize(json, useId=true)
	{
        super.deserialize(json, useId);
		this.content.optIn.value = json.optIn;
	}

	initStr()
	{
		super.initStr();
		return str;
	}
}