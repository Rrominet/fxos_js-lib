class mlNodeSingleCompte extends mlNode
{
    constructor(nodeEditor, name="Single Compte", x=null, y=null)
    {
        super(nodeEditor, name, x, y); 
        this.type = SINGLE_COMPTE; 
    }

    drawContent()
    {
        this.content.email = this.content.addInput("email", "Email lié au compte"); 
        this.addOutput("Contact List"); 
    }
    
    serialize() 
	{
        let json = super.serialize();
        json.email = this.content.email.value;
		return json;
	}

	deserialize(json, useId=true)
	{
        super.deserialize(json, useId);
        this.content.email.value = json.email;
    }

    initStr()
	{
		super.initStr();

		let str = "$node_" + this.id + " = new mlNodeSingleCompte;\n";	
		str += "$node_" + this.id + "->data['id'] = '" + this.id + "';\n" ;
		str += "$node_" + this.id + "->data['email'] = '" + this.content.email.value + "';\n" ;
    return str;
    }
}

