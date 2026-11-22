const TCHAT_AJAX_URL = FM + "/php/tchat/ajax.php";

class Conv 
{
	constructor(ip, container, isML, Tchat, timer = 1000) 
	{
		this.ip = ip;
		this.messages = []; 
		this.container = container;
		this.isML = isML;
		this.tchat = Tchat;
		this.email = this.tchat.email;
        this.timer = timer;
		this.ajaxRead();

		if (this.isML)
			this.tchat.div.header.poste.innerHTML = "Envoie à : <b>" + this.receiver() + "</b>";
	}

    receiver()
    {
        return this.ip.replace("_a_", "@");
    }

	read(s, isConv2=false)
	{
		let t = s.split("//MESSAGE//"); 
		t.pop(); 
		if (t.length == 0 && !isConv2)
		{
			this.messages = [];
			this.container.innerHTML = "";
			let dateObj = new Date(); 
			let date = parseInt(dateObj.getTime()/1000);
			let firstMessage = new Message ("Rrominet", date, this.tchat.tchatter.message, this)
			this.messages.push(firstMessage);
		}
		else
		{
			for(let i=0; i<t.length; i++)
			{
                if (i == this.messages.length - 1)
                {
                    const tmp = new Message;
                    tmp.read(t[i]);
                    if (tmp.date != this.messages.last().date)
                    {
                        this.messages.last().setFailed(true);
                        this.createMessage(t[i]);
                    }
                }
				if (i >= this.messages.length)
					this.createMessage(t[i]);
			}
		}

		this.drawMessages();
        if (!this.tchat.loaded)
        {
            this.tchat.onLoaded(); 
            this.tchat.loaded = true;
        }
	}

    removeLast25()
    {
        let start = this.messages.length - 25; 
        if (start<0)
            start = 0;
        for (let i = this.messages.length - 1; i>=start; i--)
        {
            this.messages[i].remove();
            this.messages.remove(this.messages[i]);
        }
    }

	createMessage(data)
	{
		let message = new Message; 
		message.read(data);
		message.conv = this;
		this.messages.push(message);
	}

	save()
	{
		let s  = ""; 

		for (let m of this.messages)
			s += m.save() + "//MESSAGE//";

		return s; 
	}

	ajaxSave()
	{
		if (!this.email)
			this.email = "";
		let params = [
			["function", "saveConv"],
			["data", this.save()],
			["ip", this.ip],
			["email", this.email.clean(false)],
		];

		let func = function (xhr) 
		{
            if (xhr.responseText == "false")
                this.messages.last().setFailed(true);
            else 
                this.read(xhr.responseText.replace(/\/\/amp;\/\//g, "&"));
        }.bind(this);

        const xhr = HttpRequest(); 
		xhr.sendListAsPost(TCHAT_AJAX_URL, params, func);
	}

	ajaxRead()
	{
		if (!this.tchat.isVisible())
			return;

		let params  = "function=readConv"; 
			params += "&ip=" + this.ip;
			if (!this.email)
				this.email = email();
			
			if (this.email)
				params += "&email=" + this.email.clean(false);


		let func = function (xhr) 
		{
            if (xhr.status === 200)
                this.read(xhr.responseText.replace(/\/\/amp;\/\//g, "&"));
            else
            {
                let html = "<div class='error'>Il semble y avoir eu une erreur, merci de rafraichir cette page.<br><br>Voici plus d'informations : <br>Code d'erreur : " + xhr.status;                
                if (xhr.status == 0)
                    html += "<br>Aucune connection internet détectée...";
                html += "</div>"; 
                this.container.innerHTML = html;
            }
            this.startReadTimer();
        }.bind(this);

        const xhr = HttpRequest(); 
		xhr.sendAsPost(TCHAT_AJAX_URL, params, func);
	}

    startReadTimer()
    {
        setTimeout(() => this.ajaxRead(), this.timer);
    }

	drawMessages()
	{
		let needScroll = this.container.isToBottom();
		
        if (this.container.children.length == 0 )
            this.container.innerHTML = "";
		for (let i = 0; i<this.messages.length; i++)
		{
			if (i>=this.container.children.length)
			{
				this.messages[i].draw(this.container);
			}
		}

		if (needScroll)
			this.container.scrollTop = this.container.scrollHeight;

        this.setImages();
    }

    // sendEmail is only for Romain Gilliot
	newMessage(txt, sendEmail=true)
	{
		if (txt == "")
			return;
		let dateObj = new Date(); 
		let date = parseInt(dateObj.getTime()/1000);
		let message;
		if (this.isML)
        {
            message = new Message("Rrominet", date, txt, this);

            //if the email is not for Romain Gilliot
            //it's for the student who receive a message
            const xhr = HttpRequest();
            const url = FM + "/php/tchat/ajax.php";
            const params = [
                ["function", "emailToEleve"],
                ["msg", txt],
                ["email", this.receiver()],
            ];

            xhr.sendListAsPost(url, params);
        }
		else
		{
			message = new Message(this.ip, date, txt, this);
		    if (sendEmail)	
            {
                const xhr = HttpRequest();

                const url = FM + "/php/tchat/ajax.php";
                const params = [
                    ["function", "email"],
                    ["msg", txt],
                    ["ip", this.ip],
                    ["email", this.email],
                ]

                xhr.sendListAsPost(url, params);
            }

		}

		this.messages.push(message); 
        this.drawMessages();
		this.ajaxSave(); 
        return message;
	}

    setImages()
    {
        for (let c of this.container.deepChildren())
        {
            if (c.tagName == "IMG")
            {
                if (!c.classList.contains("clickable"))
                {
                    c.classList.add("clickable");
                    c.addEventListener("click", () => c.requestFullscreen());
                }
            }
        }
    }
}

class ConvFor2 extends Conv
{
	constructor(container, Tchat, currentUser, user2)
	{
		super("0", container, false, Tchat);
		this.currentUser = currentUser; 
		this.user2 = user2;
		let id_arr = [currentUser.email.split("@")[0].clean(), user2.email.split("@")[0].clean()]; 
		id_arr.sort();
		this.id = id_arr[0] + "_" + id_arr[1];
		this.ajaxRead();
	}

	ajaxSave()
	{
		let params = 
		[
			["function", "saveConv2"],
			["data", this.save()], 
			["id", this.id],
			["email1", this.currentUser.email],
			["email2", this.user2.email],
		];

		let func = () => this.ajaxRead();
        const xhr = HttpRequest(); 
		xhr.sendListAsPost(TCHAT_AJAX_URL, params, func);
	}

	ajaxRead()
	{
		if (!this.tchat.isVisible())
			return;
		let xhr = HttpRequest();
		
		let params = 
		[
			["function", "readConv2"],
			["id", this.id],
			["email", email()],
		]; 

		let func = () => this.read(xhr.responseText.replace(/\/\/amp;\/\//g, "&"), true);
		xhr.sendListAsPost(TCHAT_AJAX_URL, params, func);
	}

	sendNotif()
	{
		if (!MLT_Forum)
			return;
		let xhr = HttpRequest();
		
		let json = {}; 
		json.func = "messageNotif"; 
		json.msg = {}; 
		json.msg.from = email(); 
		json.msg.to = this.user2.email; 
		json.msg.date = new Date().getTimePhp();

		xhr.sendJsonAsPost(FORUM_AJAX_URL, json);
	}

	newMessage(txt)
	{
		if (txt == "")
			return;
		let dateObj = new Date(); 
		let date = parseInt(dateObj.getTime()/1000);
		let message = new Message2(this.currentUser, date, txt, this);
		this.messages.push(message);
		this.ajaxSave();
		this.sendNotif();
        return message;
	}

	createMessage(data)
	{
		let message = new Message2(this.currentUser); 
		message.read(data);
		message.conv = this;
		this.messages.push(message);
	}
}
