ML_tchatLabels = [];
ML_tchats = [];

const ORANGE = 1; 
const GREEN = 2;

class Tchat
{
	// tchatter {nom : '', poste : '', img : 'path/to/img.jpg', message : "My awesom msg !"}
	constructor(Tchatter, ip, motionLive = false, reduced=false, createConv=true, parent=B) 
	{
        this.loaded = false;
		this.tchatter = Tchatter;
		if (Tchatter.email != "romain.gilliot@motion-live.com")
			this.email = Tchatter.email;
		this.motionLive = motionLive;
        this.parent = parent;
		this.interface();

		this.conv = null;
		if (createConv)
			this.conv = new Conv(ip, this.div.msgs, this.motionLive, this);
		this.setKeyEvent();
		if (reduced)
			this.div.classList.add("reduced");
    }

	// Statut de la persone qui répond dans l'entreprise
	static create(Personne, reduced=false, color=GREEN)
	{
		let xhr = HttpRequest(); 
		let url = FM + "/php/tchat/ajax.php";
		let params = "function=getIp"; 

		let func = function (xhr)
		{
			let tchat = new Tchat(Personne, xhr.responseText, false, reduced);
			ML_tchats.push(tchat);
			tchat.setColor(color);
		}

		xhr.sendAsGet(url + "?" + params, func);
	}

	//users are User object from Forum
	static create2(user1, user2, reduced = true)
	{
		let tchatter = {}; 
		let currentUser;
		let other;
		if (user1.email == email())
		{
			tchatter.nom = user2.profil.nom; 
			tchatter.img = user2.profil.photo; 
			currentUser = user1;
			other = user2;
		}

		else
		{
			tchatter.nom = user1.profil.nom; 
			tchatter.img = user1.profil.photo; 
			currentUser = user2;
			other = user1;
		}

		if (other.email == "romain.gilliot@motion-live.com")
			tchatter.poste = "Formateur";
		else 
			tchatter.poste = "Étudiant";

		let tchat = new Tchat(tchatter, "0", false, reduced, false);
		tchat.conv = new ConvFor2(tchat.div.msgs, tchat, currentUser, other);
		tchat.recipient = other;
		return tchat; 
	}

    static createMulti(id, color=GREEN)
    {
        let tchatter = {}; 
        tchatter.nom = prenom(); 
        tchatter.poste = ""; 
        let tchat = new Tchat(tchatter, "0", false, false, false);
        tchat.conv = new ConvMulti(tchat.div.msgs, tchat, id);
        tchat.setColor(color);
        return tchat;
    }

	interface() 
	{
		this.div = D.createElement("div"); 
		this.div.classList.add ("tchat");
		this.div.classList.add ("parent");
		this.parent.appendChild(this.div);

		this.div.header = D.createElement("div"); 
		this.div.header.classList.add("header");
		this.div.appendChild(this.div.header); 

		this.drawHeader(this.div.header);

		this.div.msgs = D.createElement("div"); 
		this.div.msgs.classList.add("msgs"); 
		this.div.appendChild(this.div.msgs);

		addEventListener("resize", () => this.responsive());
		addEventListener("load", () => this.responsive());

		this.drawMsgs(this.div.msgs);

		this.div.msg = D.createElement("div"); 
		this.div.msg.classList.add("msg"); 
		this.div.appendChild(this.div.msg);

		this.div.msg.tchat = () => this;

		this.drawMsg(this.div.msg);

		this.responsive();
        this.setEvents();
	}

	responsive()
	{
        if (innerWidth<840)
        {
			this.div.msgs.style.minHeight = "60%";
			this.div.msgs.style.maxHeight = "60%";
            return;
        }
		let res=((innerHeight-200) * 0.6) + "px"; 
		this.div.msgs.style.maxHeight = res;
		let mh = parseInt(getComputedStyle(this.div.msgs).minHeight);
		if (mh >= parseInt(res))
			this.div.msgs.style.minHeight = res;
	}

	setColor(c=ORANGE)
	{
		if (c == GREEN)
		{
			this.div.header.classList.add("green");
			this.div.msg.classList.add("green");
			this.div.msg.send.classList.add("green");
		}

	}

	drawHeader (h)
	{
		h.img = h.newImg(this.tchatter.img);
		h.img.classList.add("profil");

		h.nom = D.createElement("font"); 
		h.nom.innerHTML = this.tchatter.nom;
		h.nom.classList.add("nom"); 
		h.appendChild(h.nom); 

		h.poste = D.createElement("font"); 
		h.poste.innerHTML = this.tchatter.poste;
		h.poste.classList.add("poste"); 
		h.appendChild(h.poste);

		h.reduce = D.createElement("button"); 
		h.reduce.classList.add("reduce"); 
		h.title = "Réduire";
		h.appendChild(h.reduce);

		h.addEventListener("click", function () 
		{
			if (this.div.classList.contains("reduced"))
            {
				this.div.classList.remove ("reduced");
                this.conv.ajaxRead();
            }
			else
				this.div.classList.add("reduced")
		}.bind(this));

	}

    isReduced()
    {
        return this.div.classList.contains("reduced");
    }

	drawMsgs (msgs)
	{
        msgs.innerHTML = "Chargement...";
	}

	drawMsg(msg)
	{
		msg.content = new TxtWriter(msg, TXT_WRITER_SMALL_VERSION);
		msg.send = D.createElement("button"); 
		msg.send.classList.add("send");
		msg.send.innerHTML = "Envoyer..."; 
		msg.send.title = "Appuyez sur 'Entree' pour envoyer."; 
        msg.send.disabled = true;
		msg.appendChild(msg.send);
		msg.send.addEventListener("click", this.sendMsg.bind(this));
	}

	sendMsg(html=null)
	{
		if (!html || typeof(html) != "string")
		{
			this.conv.newMessage(this.div.msg.content.definitiveHtml());
			this.div.msg.content.clear();
		}
		else 
			this.conv.newMessage(html);

	}

	setKeyEvent()
	{
        addEventListener("keydown", (e) => 
        {
           if (e.key == "Enter" && e.ctrlKey)
            {
                if (this.div.msg.content.div.writer == D.activeElement)
                {
                    e.preventDefault();
                    this.sendMsg();
                }
            }
        })
	}

    setEvents()
    {

        this.div.msg.content.div.writer.addEventListener("input", () => this.onMessageContentChange())
        this.div.msg.content.div.writer.addEventListener("change", () => this.onMessageContentChange())
            
        setInterval(()=>this.checkUploads(), 250);
    }
   
    currentMsgAsHtml()
    {
        return this.div.msg.content.definitveHtml();
    }

    onMessageContentChange()
    {
        if (this.currentMsgAsHtml().includes("Votre texte...") || !this.currentMsgAsHtml())    
            this.div.msg.send.disabled = true; 
        else 
            this.div.msg.send.disabled = false;
    }

    checkUploads()
    {
        if (this.div.msg.content.uploading)
            this.div.msg.send.disabled = true;
        else 
            this.onMessageContentChange();
    }

	show()
	{
		this.div.show();
	}

	hide()
	{
		this.div.hide();
	}

	isVisible()
	{
        let visible = true; 
        visible = !this.isReduced(); 
        if (visible)
            return this.div.isVisible();
        else 
            return visible;
    }

	static readAll(parent = B) 
	{
		let xhr = HttpRequest(); 
		let url = FM + "/php/tchat/ajax.php";
        const params = [["function", "readAllConv"]];

		let func = function (xhr) 
		{
			let p = { "nom" : "Romain Gilliot",
				  "poste" : "Gérant",
				  "img" : "",
				  "message" : "Bonjour, comment puis-je vous aidez ? "
			}

			let tmp = xhr.responseText.split("//CONV//"); 
			tmp.pop(); 
			for (let c of tmp)
			{
				let t = new Tchat(p, c.split("//IP//")[0], true);
				t.hide();
				const tl = new TchatLabel(t, parent);
                ML_tchatLabels.push(tl);
				ML_tchats.push(t);
			}
		}

		xhr.sendListAsPost(url, params, func);
	}

    static importJS(callback, includeCss=true, local=false)
    {
        let fmPath = ""; 
        if (local)
            fmPath = FML; 
        else 
            fmPath = FM

        const HttpRequest = mkJs(fmPath + "/js/HttpRequest.js"); 
        const urlParameter = mkJs(fmPath + "/js/urlParameters.js"); 
        const fonts = mkJs(fmPath + "/js/txtWriter/fonts.js");
        const html_utils = mkJs(fmPath + "/js/html_utils.js");
        const Youtube = mkJs("https://www.youtube.com/iframe_api"); 
        const Vimeo = mkJs("https://player.vimeo.com/api/player.js"); 
        const Window = mkJs(fmPath + "/js/windows-manager/Window.js");
        const Mouse = mkJs(fmPath + "/js/mouse.js");
        const MessageWindow = mkJs(fmPath + "/js/windows-manager/MessageWindow.js");
        const WindowsManager = mkJs(fmPath + "/js/windows-manager/WindowsManager.js");
        const TxtWriter = mkJs(fmPath + "/js/txtWriter/TxtWriter.js");
        const ProgressBar = mkJs(fmPath + "/js/ProgressBar.js")
        const Icons = mkJs(fmPath + "/js/icons.js");
        const Message = mkJs(fmPath + "/js/tchat/Message.js");
        const Conv = mkJs(fmPath + "/js/tchat/Conv.js");
        const ConvMulti = mkJs(fmPath + "/js/tchat/ConvMulti.js");
        const TchatLabel = mkJs(fmPath + "/js/tchat/TchatLabel.js");

        let scripts = [
            HttpRequest, 
            urlParameter, 
            html_utils, 
            fonts, 
            Youtube, 
            Vimeo, 
            Mouse, 
            Window, 
            MessageWindow, 
            WindowsManager,
            TxtWriter, 
            ProgressBar, 
            Icons, 
            Message, 
            Conv, 
            ConvMulti, 
            TchatLabel, 
        ]; 

        if (includeCss)
        {
            newCss(fmPath + "/css/TxtWriter.css");
            newCss(fmPath + "/css/tchat.css");
            newCss(fmPath + "/css/windows-manager.css");
        }

        importScripts(scripts, callback);
    }

    //to add as event handler
    onLoaded()
    {

    }
} 
