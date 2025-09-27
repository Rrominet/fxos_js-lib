class Rdvs
{
	constructor (name) 
	{
		this.name = name;
		this.container = D.createElement("div"); 
		this.container.classList.add("rdvs"); 

		this.container.pTitle = D.createElement("div"); 
		this.container.pTitle.classList.add("rdvsTitles"); 
		this.container.pTitle.innerText = "Rendez-vous : " + this.name; 

		this.container.scroll = D.createElement("div"); 
		this.container.scroll.classList.add("scrolls");

		B.appendChild(this.container); 
		this.container.appendChild(this.container.pTitle);
		this.container.appendChild(this.container.scroll);

		this.rdvs = [];

		this.readAjax();

	}

	readAjax() 
	{
		this.xhr = HttpRequest(); 
		let url = "https://motion-live.com/frameworks/php/calendrier/ajax.php";
		let params  = "function=getRdvs";
		    params += "&name=" + this.name;

		let func = function (xhr) 
		{
			// console.log(xhr.responseText);
			this.read(xhr.responseText);
		}.bind(this);

		this.xhr.sendAsPost(url, params, func);
	}

	read(str)
	{
		let t = str.split("//RDV_INFOS//"); 
		t.pop();
		for (let rdv of t)
		{
			this.createRdvLine(rdv);
		}
	}

	createRdvLine(s)
	{
		let t = s.split("::&&::"); 
		let html = t[0] + " - " + t[1]; 
		let date = new Date(parseInt(t[2])); 
		let day = date.toLocaleDateString(); 
		let hour = date.getHours() + ":00";

		html += " -> <b>" + day + " - " + hour + "</b>";

		let div = D.createElement("div"); 
		div.classList.add("lines");
		div.innerHTML = html; 
		this.rdvs.push(div); 
		this.container.scroll.appendChild(div);

		for (let d of c.days)
		{
			for (let h of d.hours)
			{
				if (h.date.getTime() == date.getTime())
					h.th.className = "rdvs";
			}
		}

		function remove () 
		{
			let xhr = HttpRequest(); 
			let url = "https://motion-live.com/frameworks/php/calendrier/ajax.php";
			let params  = "function=deleteRdv"; 
			    params += "&name="  + this.name; 
			    params += "&email=" + t[1];

			let func = function (x) 
			{
				console.log (x.responseText);
			};

			xhr.sendAsPost(url, params, func);

			div.parentNode.removeChild(div);

			for (let d of c.days)
			{
				for (let h of d.hours)
				{
					if (h.date.getTime() == date.getTime())
						h.setTaken(false);
				}
			}

			c.save();

		};

		div.ctx = new ContextMenu(div); 
		div.ctx.delete = new MenuButton(div.ctx, "Supprimer", remove.bind(this));
	}
}