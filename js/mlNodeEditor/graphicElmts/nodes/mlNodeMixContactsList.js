class mlNodeMixContactsList extends mlNode
{
	constructor(nodeEditor, name = "My node", x =null, y=null)
	{
		super(nodeEditor, name, x, y);
		this.type = MIX_CONTACTS_LIST;
	}

	drawContent()
	{
		this.content.operator = newNode("select", this.content, "content");

		this.content.operator.add = newNode("option", this.content.operator);
		this.content.operator.add.value = "add";
		this.content.operator.add.innerText = "Add";

		this.content.operator.sub = newNode("option", this.content.operator);
		this.content.operator.sub.value = "substract";
		this.content.operator.sub.innerText = "Substract";

		// events // 
			this.content.operator.addEventListener("change", function () 
			{
				for (let c of this.content.operator.children)
					if (c.value == this.content.operator.value)
					{
						this.content.label.innerText = c.innerText;		
					}
			
			}.bind(this))
		// events //


		this.content.label.innerText = this.content.operator.add.innerText;

		this.addInput("List 1")
		this.addInput("List 2")
		this.addOutput("List");
	}

	serialize() 
	{
		let json = super.serialize();
		json.operator = this.content.operator.value;

		return json

	}

	deserialize(json, useId=true)
	{
        super.deserialize(json, useId);
		this.content.operator.value = json.operator;

	}

	initStr()
	{
		super.initStr();

		let str = "$node_" + this.id + " = new mlNodeMixContactsList;\n";	
		str += "$node_" + this.id + "->data['operator'] = '" + this.content.operator.value + "';\n" ;

		return str;
	}
}