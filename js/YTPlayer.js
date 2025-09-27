class YTPlayer
{
    // object is like this : 
    // {
    //    id : "skldfjsdlfk", 
    //    title : "My title", (optional)
    //    logoColor : "black" (optional) white or black
    // }
    // if titleBalise == "", the video will have no title
    constructor(parent, object, titleBalise = "h2", inter=true)
    {
        this.parent = parent;
        this.titleBalise = titleBalise;
        this.id = object.id; 
        this.title = object.title;
        this.thumnail = "maxresdefault";
        if (object.thumnail)
            this.thumnail = object.thumnail;
        this.logoColor = object.logoColor;
        this.loaded = false;
        this.live = false;
        this.displayTchat = false;

        if (inter)
        {
            this.interface();
            this.setEvents();
        }
    }

    static fromUrl(parent, url, title="", titleBase="h2", logoColor="", inter=true)
    {
        const obj = {};
        obj.id = url.idFromVideo();
        if (!obj.id)
            return null;

        if (title)
            obj.title = title;
        if (logoColor)
            obj.logoColor = logoColor;

        return new YTPlayer(parent, obj, titleBase, inter);
    }

    static embedStr(url)
    {
        let id = url.idFromVideo();
        let iframe = D.createElement("iframe");
        iframe.classList.add("player");
        iframe.src ="https://www.youtube.com/embed/" + id;
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "1");
        return iframe.outerHTML;
    }

    setEvents()
    {
        addEventListener("resize", () => this.placeYoutubeLogo());
        addEventListener("load", () => this.placeYoutubeLogo());
        addEventListener("scroll", () => this.placeYoutubeLogo());
        this.img.addEventListener("load", () => this.placeYoutubeLogo());
    }

    static newAfter(before, object, titleBalise = "h2")
    {
        const yt = new YTPlayer(before.parentNode, object, titleBalise, false);
        yt.div = D.createElement("div");
        yt.div.classList.add("video");
        if (yt.titleBalise != "" && yt.title)
            yt.div.titre = yt.div.newTitle(yt.titleBalise, yt.title);
        yt.div.ytIframe = yt.div.newNode("div", "youtube", yt.id);
        yt.createImg();
        yt.setEvents();

        before.insertAfter(yt.div);
        return yt;
    }

    interface()
    {
        this.div = this.parent.newNode("div", "video");
        if (this.titleBalise != "" && this.title)
            this.div.titre = this.div.newTitle(this.titleBalise, this.title);
        this.div.ytIframe = this.div.newNode("div", "youtube", this.id);
        this.createImg();
    }

    setSize()
    {
        this.w = this.img.width;
        this.h = this.img.height;
    }

    createImg()
    {
        this.play = this.div.ytIframe.newImg(MLT + "/images/icons/youtube-logo.png");
        this.play.classList.add("logo");
        if (this.logoColor == "white")
            this.play.style.filter = "invert(1)";
        this.img = this.div.ytIframe.newImg("https://img.youtube.com/vi/" + this.id + "/sddefault.jpg");
        this.img.addEventListener("load", () => this.placeYoutubeLogo());
        this.img.classList.add("yt");
        this.div.ytIframe.addEventListener("click", () => this.createYoutubePlayer());
    }

    placeYoutubeLogo()
    {
        this.play.center(this.img);
    }

    createYoutubePlayer()
    {
        importScripts([mkJs("https://www.youtube.com/iframe_api")], () => 
            {
                if (this.loaded)
                    return;
                this.setSize();
                YT.ready(() => 
                    {
                        this.div.yt = new YT.Player(this.id, 
                            {
                                height : this.h, 
                                width : this.w, 
                                videoId : this.id,
                                events :
                                {
                                    'onReady' : () => this.div.yt.playVideo(),
                                    'onError' : (e) => console.error(e),
                                }
                            });

                        if (this.displayTchat)
                            this.createTchat();

                        if (this.live)
                            this.div.classList.add("live");
                        this.loaded = true;
                    });
            });
    }

    createTchat()
    {
        if (this.div.titre)
            this.div.titre.remove();
        this.live = true;
        this.div.tchat = this.div.newNode("iframe");
        this.div.tchat.setAttribute("frameborder", "0");
        this.div.tchat.src="https://youtube.com/live_chat?v=" + this.id + "&embed_domain=" + domain();
        this.div.tchat.classList.add("tchat");
    }

    remove()
    {
        this.div.remove();
    }
}
