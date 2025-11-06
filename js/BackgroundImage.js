class BackgroundImage
{
    constructor (block, src=null, createImg=true)
    {
        this.block = block; 
        if (createImg)
        {
            this.img = D.createElement("img"); 
            this.img.src = src;
            this.img.classList.add("background"); 
            this.block.addBefore(this.img);
            this.init();
        }
    }

    static fromExisting(contentBlock, imgBlock)
    {
        let bg = new BackgroundImage(contentBlock, null, false); 
        bg.img = imgBlock; 
        bg.init();
    }

    addClass(cls)
    {
        this.img.classList.add(cls);
        if (this.video)
            this.video.classList.add(cls);
    }

    init()
    {
        this._h = this.img.height; 
        this._w = this.img.width;
        this.img.style.left = "initial"; 
        this.img.style.right = "initial"; 
        this.img.style.display = "block";
        this.img.style.position = "fixed";
        this.setEvents();
    }

    setEvents()
    {
        addEventListener("resize", () => {
            this.setHeight(); 
            this.setPos();
            this.setClipPath();
        });
        this.img.addEventListener("loadedmetadata", () => {
            this.setHeight(); 
            this.setPos();
            this.setClipPath();
        });
        this.img.addEventListener("load", () => {
            this.setHeight(); 
            this.setPos();
            this.setClipPath();
        });
        addEventListener("load", () => {
            this.setHeight(); 
            this.setPos();
            this.setClipPath();
        });
    }

    setPos()
    {
        this.img.style.marginLeft = this.x() + "px";
    }

    x()
    {
        const cw = this.contentW();
        const iw = this.img.w();

        let x = (iw - cw)/2;
        return -x;
    }

    contentW()
    {
        if (!this.block)
            return innerWidth;
        return this.block.getBoundingClientRect().width;
    }

    setHeight()
    {
        if (!this.img)
            return;
        this.img.style.width = "initial";
        if (!this.block)
            return;
        let h = this.block.getBoundingClientRect().height; 
        this.img.style.height = h + "px"; 

        if (this.img.width<=this.contentW())
        {
            this.img.style.height = "initial"; 
            this.img.style.width = "100%";
        }
        else 
        {
            this.img.style.width = "initial";
        }
    }

    setClipPath()
    {
        if (!this.img)
            return;
        const x = -this.x();
        const w = this.contentW();

        let bottom = this.img.bottom() - this.block.bottom();
        if (bottom<=0)
            bottom = 0;
        
        const clp = "inset(0 " + x + "px " + "0px " + x + "px)";
        this.img.style.clipPath = clp;
    }
}

class BackgroundVideo extends BackgroundImage
{
    //video is the url of the src
    constructor(block, video, imgSrc=null, loop=true, ratio=1.7777778)
    {
        super (block, imgSrc);
        this.ratio = ratio;
        this.createVideo(video, loop);
    }

    createVideo(video, loop)
    {
        this.video = D.createElement("video");
        this.video.classList.add("background");
        this.video.src = video;
        this.video.muted = true;
        this.video.loop = loop;
        this.video.style.opacity = 0;
        this.img.insertAfter(this.video);
        this.setVideoEvents();
    }

    setVideoEvents()
    {
        this.video.addEventListener("canplay", () => this.play())
        this.video.addEventListener("loadedmetadata", () => {
            this.setHeight(); 
                this.setPos();
            });
    }

    play()
    {
        if (this.img)
        {
            this.img.remove();
            this.img = null;
        }
        this.video.style.opacity = 1; 
        this.setPos(); 
        this.setHeight();
        this.video.play();
    }

    setPos()
    {
        if (this.img)
            super.setPos();
        if (!this.video)
            return;
        this.video.center(this.block);
        this.video.style.marginTop = "0";
    }

    setHeight()
    {
        if (this.img)
            super.setHeight();
        if (!this.video)
            return;
        
        let h = this.block.h(); 
        this.video.height = h; 
        this.video.style.height = h + "px"; 
        this.video.width = h*this.ratio;

        if (this.video.width<=this.contentW())
        {
            this.video.width = this.block.w();
            this.video.style.width = this.block.w() + "px";
            this.video.height = this.video.width * 1/this.ratio;
            this.video.style.height = this.video.height + "px";
        }
        else 
        {
            this.video.style.width = h*this.ratio + "px";
        }
    }
}
