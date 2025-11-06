class mlNodeValue extends mlNode 
{
    constructor (nodeEditor, name="Value", x=null, y=null)
    {
        super(nodeEditor, name, x, y); 
        this.type = VALUE; 
    }

    drawContent()
    {
        this.content.value = this.content.addInput("number", "value"); 
        this.addOutput("Value", "grey");
    }

    serialize() 
	{
        let json = super.serialize();
        json.value = this.content.value.value;

		return json;
	}

	deserialize(json, useId=true)
	{
        super.deserialize(json, useId);
        this.content.value.value = json.value;
    }

    initStr()
	{
		super.initStr();

		let str = "$node_" + this.id + " = new mlNodeValue;\n";	
		str += "$node_" + this.id + "->data['id'] = '" + this.id + "';\n" ;
        str += "$node_" + this.id + "->data['value'] = " + this.content.value.value + ";\n" ;
		return str;
	}
}
