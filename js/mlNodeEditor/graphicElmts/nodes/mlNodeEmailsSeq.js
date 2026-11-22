class mlNodeEmailsSeq extends mlNode
{
    constructor(nodeEditor, name = "My node", x =null, y=null)
	{
		super(nodeEditor, name, x, y);
        this.type = EMAILS_SEQ;
        this.subtype = INDEX_EMAIL_SEQ;
        this.interface = new EmailsSeqInterface (this);
    }
    
    drawContent() 
	{
        let options = [["Index", "index"], ["Date", "date"]];
        this.typeSelect = this.content.labelSelect(options, "Mode : ");
        this.typeSelect.addEvent("change", () => this.onTypeChange());
        this.emailTypeSelect = this.content.newNode("select");
        this.emailTypeSelect.addOption("normal");
        this.emailTypeSelect.addOption("broadcast");
        this.content.newBr();
        this.content.newButton ("Options", this.show.bind(this));
		this.addInput("Contact List");
		this.indexSocket = this.addInput("Minimum Index", "grey");
		this.dateSocket = this.addInput("Start Date", "purple");
        this.dateSocket.hide();
		this.addOutput("Last Index", "grey");
    }

    onTypeChange()
    {
        if (this.typeSelect.getValue() == "index")
        {
            this.dateSocket.hide(); 
            this.indexSocket.show(); 
            this.subtype = INDEX_EMAIL_SEQ;
        }
        else 
        {
            this.dateSocket.show(); 
            this.indexSocket.hide(); 
            this.subtype = DATE_EMAIL_SEQ;
        }
    }

    date()
    {
        if (this.subtype == INDEX_EMAIL_SEQ)
            return null; 
        let n = this.getDateNode(); 
        if (!n) 
            return null;
        return n.time();
    }

    getDateNode()
    {
        if (this.subtype == INDEX_EMAIL_SEQ)
            return null; 
        let socket = this.socketByName("Start Date");
        if (!socket)
            return null;
        return socket.connectedNode();
    }
    
    show()
    {
        this.interface.updateUi();
        this.interface.show();
    }

    serialize() 
	{
        let json = super.serialize();
        json.subtype = this.subtype;
        json.emailType = this.emailTypeSelect.value;

        let nodes = []; 
        for (let e of this.interface.nodes)
            nodes.push(e.serialize());

        json.nodes = nodes;

		return json;
	}

	deserialize(json, useId=true)
	{
        super.deserialize(json, useId);
        if (json.emailType)
            this.emailTypeSelect.value = json.emailType;
        if (json.nodes)
        {
            for (let e of json.nodes)
            {
                let node = this.interface.getNode(e); 
                node.deserialize(e);
            }
        }

        else if (json.emails)
        {
            for (let e of json.emails)
            {
                let node = this.interface.newEmail(); 
                node.deserialize(e);
            }
        }

        if (json.subtype)
            this.subtype = json.subtype;

        if (this.subtype == INDEX_EMAIL_SEQ)
            this.typeSelect.setValue("index");
        else 
            this.typeSelect.setValue("date");
        this.onTypeChange();

        this.interface.updateUi();
    }

    initStr()
	{
		super.initStr();

		let str = "$node_" + this.id + " = new mlNodeEmailsSeq;\n";	
		str += "$node_" + this.id + "->data['id'] = '" + this.id + "';\n" ;
		str += "$node_" + this.id + "->data['name'] = '" + this.name() + "';\n" ;
		str += "$node_" + this.id + "->data['subtype'] = '" + this.typeSelect.getValue() + "';\n" ;
		str += "$node_" + this.id + "->data['emailType'] = '" + this.emailTypeSelect.value + "';\n" ;
        str += "$node_" + this.id + "->data['nodes'] = [] ;\n" ;
        for (let e of this.interface.nodes)
        {
            str += e.phpStr();
            str += "$node_" + this.id + "->data['nodes'][] = $node;\n";
        }

		return str;
	}
	
}
