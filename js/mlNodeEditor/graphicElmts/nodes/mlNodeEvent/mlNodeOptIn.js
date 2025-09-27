class mlNodeOptIn extends mlNodeEvent
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

		this.addOutput("Contact");
	}

	serialize() 
	{
		let json = super.serialize();
		json.optIn = this.content.optIn.value;

		return json

	}

	deserialize(json)
	{
		super.deserialize(json);
		this.content.optIn.value = json.optIn;
	}

	initStr()
	{
		super.initStr();
		
		let str = "$node_" + this.id + " = new mlNodeOptIn;\n";
		str += "$node_" + this.id + "->data['optIn'] = '" + this.content.optIn.value + "';\n";
		return str;
	}

	executeStr(isEvent = false)
	{
		if (!isEvent || this.executed)
			return "";

		this.executed = true;

		let s = "if ($_POST['event'] == '" + this.id + "' %26%26 $_POST['optIn'] == $node_" + this.id + "->data['optIn'])  ";
		s += "$res_" + this.id + " = $node_" + this.id + "->execute([$_POST]);\n";

		return s;
	}
}