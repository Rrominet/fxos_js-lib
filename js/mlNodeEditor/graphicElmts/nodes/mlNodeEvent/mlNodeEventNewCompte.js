class mlNodeEventNewCompte extends mlNodeEvent
{
	constructor(nodeEditor, name = "My node", x=null, y=null)
	{
		super(nodeEditor, name, x, y);
		this.type = NEW_COMPTE_EVENT;
	}

	drawContent()
	{
        const options = [
            ["teach.motion-live.com", "mlt"],
            ["progress.spacewarp.fr", "pgr-spacewarp"],
            ["Tous les sites progress (from email)", "pgr-all"],
        ];
        this.compteType = this.content.newNode("select");
        this.compteType.setOptions(options);
		this.addOutput("Compte");
	}

	initStr()
	{
		super.initStr();
		
		let str = "$node_" + this.id + " = new mlNodeEventNewCompte;\n";
        str += "$node_" + this.id + "->data['compteType'] = '"+ this.compteType.value + "';\n";
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
        return "new-compte_" + this.compteType.value;
    }

	serialize() 
	{
		let json = super.serialize();
        json.compteType = this.compteType.value;
		return json;
	}

	deserialize(json, useId=true)
	{
		super.deserialize(json, useId);
        this.compteType.value = json.compteType;
	}
}
