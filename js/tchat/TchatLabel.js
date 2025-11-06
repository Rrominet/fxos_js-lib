class TchatLabel 
{
	constructor (Tchat, parent=B)
	{
		this.tchat = Tchat; 
        this.tchat.onLoaded = () => this.setReadedFromConv();
        this.parent = parent;
        this.readed = false;
        this.created = false;

        TchatLabel.startSortHandler();
	}

	interface() 
	{
        if (this.created)
            return;
        let nom;
        this.tchatList = D.getElementById("tchatsList");
        if (this.tchatList)
            this.parent = this.tchatList;
		this.button = this.parent.newNode("button"); 
        this.button.nom = this.button.newNode("div", "nom");
        let i = D.createImg("images/read.svg");
        this.button.readed = this.button.newButton(i, (e) => this.toggleReaded(e));
		if (this.tchat.email && this.tchat.email != "")
            nom = this.tchat.email.replace(/_a_/g, "@");
        else
			nom = this.tchat.conv.ip.replace(/_a_/g, "@");
        this.button.nom.innerHTML = nom;
		this.button.classList.add("tchatLabel");
		this.button.addEventListener("click", this.onClick.bind(this));
        this.created = true;
        this.setReaded(this.readed);
    }

	onClick() 
	{
		for (let t of ML_tchats)
			t.hide(); 

        this.tchat.show();
        this.tchat.conv.startReadTimer();
	}

    toggleReaded(e)
    {
        e.stopPropagation();
        this.setReaded(!this.readed);
    }

    setReaded(val=true)
    {
        this.readed = val; 
        if (!this.created)
            return;
        if (val)
            this.button.classList.add("readed");
        else 
            this.button.classList.remove("readed");
    }

    setReadedFromConv()
    {
        const c = this.tchat.conv; 
        if (c.messages.last().mine)
            this.setReaded(true);
    }

    static sort()
    {
       ML_tchatLabels.sort(TchatLabel.compare);
    }

    static startSortHandler()
    {
        const handler = setInterval(() => 
            {
                for (const t of ML_tchats)
                {
                    if (!t.loaded)
                        return;
                }
                TchatLabel.sort();
                for (const t of ML_tchatLabels)
                    t.interface();
                clearInterval(handler);
            }, 100); 
    }

    static compare(a, b)
    {
        const ta = parseInt(a.tchat.conv.messages.last().date);
        const tb = parseInt(b.tchat.conv.messages.last().date);

        if (ta<tb || isNaN(ta))
            return 1;
        else if (!isNaN(ta) && isNaN(tb))
            return 1
        else 
            return -1;
    }
}
