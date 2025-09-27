class PodcastsList
{
	constructor(relativePath, title = "", node=null, appleLink = "https://podcasts.apple.com/gb/podcast/le-podcast-de-motion-live-teach/id1475703505", isNodeParent=false)
	{
		this.path = relativePath;
		this.after = node;
		this.podcasts = [];
        this.appleLink = appleLink;
        this.parent = isNodeParent;
		this.load();
		this.interface(title);

	}

	interface(title)
	{
		this.div = D.createElement("div"); 
		this.div.classList.add("podcastList");
		if (!this.after)
			B.appendChild(this.div);
		else if (!this.parent)
			this.after.parentNode.insertBefore(this.div, this.after);
        else 
            this.after.appendChild(this.div);

        this.div.header = this.div.newNode("div", "header");
        this.div.header.titre = this.div.header.newTitle("h2", title);
        this.div.header.eval = this.div.header.newButton("", () => open(this.appleLink), "eval");
        this.div.header.eval.append(Icons.byName("apple-podcat.svg"));
        this.div.header.eval.newTitle("span", "Laisser une évalution");
	}

	load()
	{
		newCss(FM + '/css/podcasts.css');

		this.Podcast_js = D.createElement("script"); 
		this.Podcast_js.src = FM + "/js/podcasts/Podcast.js";
		B.appendChild(this.Podcast_js);

		this.Podcast_js.addEventListener("load", this.read.bind(this));
	}

	read()
	{

		this.xhr = HttpRequest(); 
		let url = "ajax.php"; 
		let params  = "function=podcastList";
			params += "&path=" + this.path;

		let func = function () 
		{
			let tmp = this.xhr.responseText.split("//PODCAST//");
			tmp.pop(); 

            let i = 0;
			for (let pStr of tmp)
			{
				let p = new Podcast(this.path + "/" + pStr, this.div); 
                p.div.id = i;
				this.podcasts.push(p); 
                i++;
			}
            
            const b = this.div.newButton("", () => open(this.appleLink), "eval");
            b.append(Icons.byName("apple-podcat.svg"));
            b.newTitle("span", "Laisser une évalution");

            const id = location.id(); 
            if (!id)
                return;

            const active = D.getElementById(id);
            if (!active)
                return;

            for (let podcast of this.podcasts)
                podcast.hide();
            this.podcasts[parseInt(id)].show();
            active.scrollIntoView({behavior : "smooth"});

            B.newButton("Voir tous les podcasts", () => location.href = MLT + "/podcasts", "see-all-podcasts");

		}.bind(this);

		this.xhr.sendAsPost(url, params, func);

	}
}
