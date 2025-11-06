class EmailsSeqInterface
{
    constructor (mlNode)
    {
        this.node = mlNode;
        this.nodes = [];
        this.interface();
        this.setContextMenu();
        this.setEvents();
        this.outFocus = true;
    }

    interface()
    {
        this.div = B.newNode("div", ["emails-seq", "interface"]);
        this.div.header = this.div.newNode("div", "head"); 
        this.div.header.close = this.div.header.newButton("Close", this.hide.bind(this), "close");
        this.div.content = this.div.newNode("div", "content");
        this.div.footer = this.div.newNode("div", "footer");
        this.div.exportToFile = this.div.footer.newButton("Export", () => this.exportToFile());
        this.div.hidden = true;

        this.snr = new EmailsSeqSnR(this);
        newCss(FM + "/css/windows-manager.css");
    }

    exportToFile()
    {
        let html = "";
        for (const n of this.nodes)
        {
            if (!n.html)
                continue;
            html += n.html();
        }
        const w = window.open();
        newCss(FM + "/css/nodeEditor/emails.css", w.document);
        w.document.body.innerHTML = html;
    }

    setEvents()
    {
        B.addEventListener("keydown", this.keyboard.bind(this));
        this.div.content.addEventListener("contextmenu", this.onContext.bind(this));
    }

    hide()
    {
        this.div.hidden = true;
        this.outFocus = true;
        this.node.editor.outFocus = false;
        this.updateLastSeq();
    }

    show()
    {
        this.div.hidden = false;
        this.outFocus = false;
        this.node.editor.outFocus = true;
        this.updateLastSeq();
    }

    updateLastSeq()
    {
        if (this.node.subtype != INDEX_EMAIL_SEQ)
            return;
        if (!this.node.inputs[1].connectedNode())
            return;
        if (this.node.inputs[1].connectedNode().type == EMAILS_SEQ)
        {
            if (this.nodes[0].name() != "Last Seq Email")
            {
                let n = this.newNode(); 
                n.div.name.innerText = "Last Seq Email";
                n.div.classList.add("automatic");
                this.moveEmailFirst(n);
            }
        }
    }

    newEmail()
    {
        let node = new EmailsSeqEmailNode(this, this.node.date()); 
        this.nodes.push(node); 
        this.updateUi();
        return node;
    }

    newFinalEmail()
    {
        let node = new EmailsSeqFinalEmailNode(this, this.node.date()); 
        this.nodes.push(node); 
        this.updateUi();
        return node;
    }

    newNode()
    {
        let node = new EmailsSeqNode(this, this.node.date()); 
        this.nodes.push(node); 
        this.updateUi();
        return node;
    }

    removeNode(node)
    {
        this.nodes.remove(node);
        this.updateUi();
    }

    selected() 
    {
        let _r = [];
        
        for (let e of this.nodes)
        {
            if (e.selected)
                _r.push(e);
        }

        return _r;
    }

    selectAll()
    {
        for (let e of this.nodes)
        {
            e.setSelected(true);
        }
    }

    deselectAll()
    {
        for (let e of this.nodes)
        {
            e.setSelected(false);
        }
    }

    removeSelected()
    {
        for (let e of this.selected())
            this.removeNode(e);
    }

    removeAll()
    {
        this.nodes.clear();
        this.updateUi();
    }

    moveEmailBackward(node)
    {
        let i = this.nodes.indexOf(node);
        if (i==0)
            return;

        this.nodes.move(i, i-1);
        this.updateUi();
    }

    moveBackwardSelected()
    {
        for (let e of this.selected())
            this.moveEmailBackward(e);
    }

    moveEmailForward(node)
    {
        let i = this.nodes.indexOf(node);
        if (i>=this.nodes.length -1)
            return;

        this.nodes.move(i, i+1);
        this.updateUi();
    }

    moveForwardSelected()
    {
        for (let e of this.selected())
            this.moveEmailForward(e);
    }

    moveEmailFirst(node)
    {
        let i = this.nodes.indexOf(node);
        this.nodes.move(i, 0);
        this.updateUi();
    }

    moveEmailLast(node)
    {
        let i = this.nodes.indexOf(node);
        this.nodes.move(i, this.nodes.length -1);
        this.updateUi();
    }

    updateDate()
    {
        if (this.node.subtype == INDEX_EMAIL_SEQ)
        {
            for (let node of this.nodes)
                node.hideDate();
            return;
        }

        let d = this.node.date();
        if (!d)
            return;
        for (let node of this.nodes)
        {
            node.showDate();
            node.updateDate(d);
            d.setDate(d.getDate() + 1);
        }
    }

    updateUi()
    {
        this.updateDate();
        this.div.content.innerHTML = ""; 
        for (let node of this.nodes)
            this.div.content.append(node.div);
    }

    setContextMenu()
	{
		this.contextMenu = new ContextMenu(this.div.content);
		this.contextMenu.newBlank = new MenuButton(this.contextMenu, "Blank", this.newNode.bind(this));
		this.contextMenu.newEmailNode = new MenuButton(this.contextMenu, "Email", this.newEmail.bind(this));
		this.contextMenu.newFinalEmailNode = new MenuButton(this.contextMenu, "Final Email", this.newFinalEmail.bind(this));
        this.contextMenu.toggleForced = new MenuButton(this.contextMenu, "Toggle Forced", () => 
            {
                for (const n of this.selected())
                    n.setForce(!n.force);
            })
    }
    
    getNode(json)
    {
        if (json.type == EMAIL)
            return this.newEmail(); 
        else if (json.type == FINAL_EMAIL)
            return this.newFinalEmail();
        else 
            return this.newNode();
    }

	onContext(e)
	{
		e.preventDefault();
	}

    keyboard(e)
	{
		if (D.activeElement.tagName == "TEXTAREA" ||
			D.activeElement.contentEditable == true ||
			D.activeElement.contentEditable == "true" ||
			(D.activeElement.tagName == "INPUT" && D.activeElement.type == "text")||
            (D.activeElement.tagName == "INPUT" && D.activeElement.type == "email")||
            this.outFocus
			)
			return; 

		let c = e.keyCode;

		if (c == 88 || c==46)
		 	this.removeSelected();

		if (c == 65 && !e.shiftKey && !e.altKey)
		 	this.selectAll();

		if (c == 65 && e.shiftKey)
		 	this.deselectAll();

		if (c == 65 && e.altKey)
            this.newEmail();

        if (c == 72)
        {
            e.preventDefault(); 
            for (let n of this.nodes)
            {
                try{n.hide();}
                catch(e){};
            }
        }
            
        if (c == 38)
        {
            e.preventDefault();
            this.moveBackwardSelected();
        }
            
        if (c == 40)
        {
            e.preventDefault();
            this.moveForwardSelected();
        }

        if (c == 83 && e.ctrlKey && !e.shiftKey && !e.altKey)
        {
            e.preventDefault();
            this.node.editor.save(this.node.editor.menu.menuBar.content.fileName.innerText);
        }

        if (e.key == "r" && e.ctrlKey)
        {
            e.preventDefault(); 
            this.updateUi();
        }

        if (e.key == "f" && e.ctrlKey && !D.activeElement.isEditable())
        {
            e.preventDefault();
            this.snr.show();
        }
	}
}
