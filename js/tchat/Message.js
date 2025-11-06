class Message
{
	constructor(ip = "", date = 0, msgHtml = "", conv=null, short=false) 
	{
		this.ip = ip; 
		this.date = date;
		this.msgHtml = msgHtml; 
		this.conv = conv;
        this.short = short;
        this.failed = false;
        this.mine = false;
	}

	draw(container)
	{
		this.div = D.createElement("div"); 
		this.div.classList.add("message");

		this.div.ip = D.createElement("font"); 

		this.div.ip.classList.add("infos"); 
		this.drawInfos();

		this.div.ip.date = D.createElement("date"); 
		this.div.ip.appendChild(this.div.ip.date);
		this.setDate(this.div.ip.date);
		this.div.ip.innerHTML += " : ";
		this.div.appendChild(this.div.ip)

		this.div.message = D.createElement("p");
		this.div.message.innerHTML = this.msgHtml;
		this.div.appendChild(this.div.message);

		container.appendChild(this.div);
	}

	drawInfos()
	{
		if (this.ip == "Rrominet")
        {
			this.div.ip.innerHTML = "<b>Romain Gilliot</b> a écrit "; 
            if (this.conv && this.conv.isML)
                this.mine = true;
        }
		else
		{
			if (this.conv && this.conv.isML)
				this.div.ip.innerHTML = "<b>" + this.ip + "</b> a écrit ";
			else if (prenom() == this.ip) 
            {
				this.div.ip.innerHTML = "<b>Vous</b> avez écrit ";
                this.mine = true;
            }

            else if (!this.ip.includes(".") && !this.ip.includes("::"))
                this.div.ip.innerHTML = "<b>" + this.ip + "</b> a écrit ";

			else 
            {
				this.div.ip.innerHTML = "<b>Vous</b> avez écrit ";
                this.mine = true;
            }

            if (this.short)
            {
                this.div.ip.innerHTML = this.div.ip.innerHTML.replace(" a écrit", "");
                this.div.ip.innerHTML = this.div.ip.innerHTML.replace(" avez écrit", "");
            }
		} 

        if (this.mine)
            this.div.classList.add("mine");
	}

	setDate (node)
	{
		let dateObj = new Date(parseInt(this.date) * 1000);
        if(this.short)
            node.innerHTML = "";
        else 
            node.innerHTML += "(" + dateObj.toHumanReadable() + ")";
    }

    setShort(bool)
    {
        try{
            this.short = bool;
            this.div.classList.add("short");
            this.drawInfos(); 
            this.setDate(this.div.ip.date); 
        }catch(e){};
    }

	save(prenom=null)
	{
		let s =  ""; 
        if (prenom)
			s += prenom + "//MESSAGE_ATTR//" + this.date + "//MESSAGE_ATTR//" + this.msgHtml;
        else 
			s += this.ip + "//MESSAGE_ATTR//" + this.date + "//MESSAGE_ATTR//" + this.msgHtml;
		return s;
	}

	read(s)
	{
        this.data = s;
		let t = s.split("//MESSAGE_ATTR//"); 
        if (t.length == 1)
        {
            this.msgHtml = t[0];
            return;
        }
		this.ip   = t[0];
		this.date = t[1];
		this.msgHtml  = t[2];
	}

    remove()
    {
        this.div.remove();
    }

    setFailed(val=true)
    {
        this.failed = val;
        if (this.failed)
        {
            this.div.classList.add("failed");
            this.div.error = this.div.newTitle("div", "Le message n'a pas pu être envoyé.", "error");
            this.div.retry = this.div.newButton("Réessayer ?", () => this.sendAgain());
        }
        else 
        {
            this.div.classList.remove("failed");
            this.div.error.remove();
            this.div.retry.remove();
        }
    }

    sendAgain()
    {
        this.conv.messages.remove(this); 
        this.div.remove(); 
        this.conv.newMessage(this.msgHtml);
    }
}

class Message2 extends Message
{
	constructor(user, date = 0, msgHtml = "", conv=null)
	{
		super("0", date, msgHtml, conv);
		this.user = user;
	}

	drawInfos()
	{
		if (MLT_Forum.activeUser.email == this.user.email)
			this.div.ip.innerHTML = "<b>Tu</b> as écrit ";
		else 
		{ 
			if (!this.user)
				this.div.ip.innerHTML = "Message ";
			else 
			{
				this.div.ip.innerHTML = "<b>" + this.user.profil.nom + "</b> as écrit ";
			}
		}
	}

	save()
	{
		let s =  ""; 
			s += this.user.email + "//MESSAGE_ATTR//" + this.date + "//MESSAGE_ATTR//" + this.msgHtml;
		return s;
	
	}

	read(s)
	{
		let t = s.split("//MESSAGE_ATTR//"); 
		this.user = MLT_Forum.userFromEmail(t[0]);
		this.date = t[1];
		this.msgHtml  = t[2];
	}
}
