class Video
{
	constructor (src, x, y, img="", muted=true, loop=true, playOnLoad=true)
	{
		this.src = src; 
		this.x = x;
		this.y = y;
        this.imgsrc = img;
		this.ratio = this.y*1.0/this.x;
		this.muted = muted; 
		this.loop=loop;
		this.playOnLoad = playOnLoad;

		this.loaded = false;
        this.created = false;
        this.events = [];

		this.create();
		this.setEvents();

        this.resizeMode = Video.PARENT;
	}

    static get ABSOLUTE(){return 1;}
    static get PARENT(){return 2;}
    static get VIDEO(){return 3;}
    static get IMAGE(){return 4;}

    create()
    {
        this.dom = D.createElement("div");
        this.dom.classList.add("video-container");

        if (this.imgsrc)
        {
            this.dom.img = this.dom.newImg(this.imgsrc) ;
            this.dom.img.classList.add("video");
            this.dom.img.src = this.imgsrc;
        }
        this.createVideo();
        if (this.imgsrc && this.mode != Video.IMAGE)
            this.dom.video.hide();
    }

    removeImg()
    {
        if (this.dom.img.tagName)
            this.dom.img.remove();
    }

	createVideo()
	{
        if (this.created) 
            return;
        if (innerWidth<500)
        {
            this.mode = Video.IMAGE;
            this.created = true;
            return;
        }
		this.dom.video = this.dom.newNode("video"); 
		this.dom.video.src = this.src; 
		this.dom.video.muted = this.muted; 
        if (this.loop)
            this.dom.video.loop = this.loop;
		this.dom.video.preload = "none";
		this.dom.video.width=this.x
		this.dom.video.height= this.y

        for (let ev of this.events)
            this.dom.video.addEventListener(ev.type, ev.func);

        this.created = true;
        this.resize();
	}

	setEvents()
	{
		addEventListener("resize", () => this.resize());
		if (this.dom.video)
			this.dom.video.addEventListener("canplaythrough", () => this.resize());
        if (this.imgsrc)
            this.dom.img.addEventListener("load", () => this.resize());
        if (innerWidth>500)
        {
            addEventListener("scroll", () => this.load());
            this.dom.video.addEventListener("abort", (e) => this.onAbort(e)); 
            this.dom.video.addEventListener("error", (e) => this.onError(e)); 
            this.dom.video.addEventListener("suspend", (e) => this.onAbort(e)); 
            this.dom.video.addEventListener("canplay", () => this.onCanPlay()); 
            this.dom.video.addEventListener("loadstart", () => this.onLoadStart());
            this.resize();
            this.load();

            setInterval(() => this.tryPlay(), 500);
        }
	}

	resize()
	{
        if (!this.created)
            return;
        if (this.mode == Video.IMAGE)
            return;
		let nx = 0;
		let cl = this.dom.video.getClientRects()[0]; 
        if (!cl && this.dom.img)
            cl = this.dom.img.getClientRects()[0];

        if (this.resizeMode == Video.ABSOLUTE)
        {
            if (innerWidth*0.8>this.x)
            {
                this.setWidth(this.x);
                this.setHeight(this.y);
                return;
            }

            else
            {
                nx = innerWidth * 0.9;
                this.setWidth(nx);
            }

            if (cl)
            {
                if (this.dom.video.width + 100>= innerWidth - (cl.left*2))
                    this.setWidth(innerWidth*0.8);
            }
        }

        else if (this.resizeMode == Video.PARENT)
        {
            if (!this.dom.parentNode)
                return;
            const parentW = this.dom.parentNode.w();
            nx = parentW;
            if (nx<this.x)
                this.setWidth(nx);
            else 
                this.setWidth(this.x);
        }

		let ny = this.dom.video.width * this.ratio; 
        this.setHeight(ny);
	}

    setWidth(v)
    {
        this.dom.video.width = v;
        if (this.imgsrc)
            this.dom.img.style.width = v + "px";
    }

    setHeight(v)
    {
        this.dom.video.height = v;
        if (this.imgsrc)
            this.dom.img.style.height = v + "px";
    }

	load()
	{
        if (!this.created && this.dom.onScreen())
        {
            this.createVideo();
        }

		if (this.dom.video && this.loaded && !this.dom.onScreen())
		{
			this.dom.video.pause();
			return;
		}
		
		if (this.dom.video && !this.loaded && this.dom.onScreen())
		{
			this.dom.video.load();
		}
		
		if (this.dom.video && this.dom.video.paused && this.playOnLoad)
        {
            this.tryPlay();
        }
	}

    play()
    {
        if (!this.dom.video.isVisible())
            this.dom.video.show();
        if (this.dom.img && this.dom.img.isVisible())
            this.dom.img.hide(); 
        this.dom.video.play();
    }

    tryPlay()
    {
        if (!this.dom.onScreen())
            return;
        if (this.dom.video.readyState >= 3 )
        {
            if (this.loop)
                this.play();
        }
    }

    onError(e)
    {
        if (this.imgsrc)
        {
            this.dom.video.hide(); 
            this.dom.img.show();
            return;
        }
        this.dom.innerHTML = "Erreur : impossible de lire cette vidéo."; 
    }

    onAbort(e)
    {
        if (this.dom.video.readyState >=2 )
            return;
        if (this.imgsrc)
        {
            this.dom.video.hide(); 
            this.dom.img.show();
        }
    }

    onCanPlay()
    {
        if (this.loaded)
            return;
		this.loaded = true;
        this.play();
    }

    onLoadStart()
    {

    }

	DOMElmt()
	{
		return this.dom;
	}

    replaceDomElmt(elmt)
    {
        elmt.insertAfter(this.dom); 
        elmt.remove();
        addEventListener("load", () => this.resize());
    }

    addEventListener(ptype, pfunc)
    {
        if (!this.dom.video)
        {
            let ev = {type : ptype, func : pfunc};
            this.events.push(ev);
        }
        else 
            this.dom.video.addEventListener(ptype, pfunc);
    }
}
