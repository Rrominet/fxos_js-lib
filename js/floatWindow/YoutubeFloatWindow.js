class YoutubeFloatWindow extends MaskFloatWindow
{
    constructor()
    {
        super(B, false, false);
        this.div.youtube = this.div.newNode("div");
    }

    static fromId(id)
    {
        let w = new YoutubeFloatWindow; 
        YT.ready(() => w.createYoutubePlayer(id));
        return w;
    }

    static fromUrl(url)
    {

    }

    margin()
    {
        return innerWidth*0.02;
    }

    createYoutubePlayer(id)
    {
        this.div.youtube.id = id; 
        let m = this.margin();
        this.youtubePlayer = new YT.Player(id, 
            {
                width :  this.div.w() - m, 
                height : (this.div.w() - m) * 0.5,
                videoId : id,
                events : 
                {
                    'onReady' : () => {
                        this.onResize();
                        this.youtubePlayer.playVideo()
                    }
                }
            });
    }

    setEvents()
    {
        super.setEvents();
        addEventListener("resize", () => this.onResize());
    }

    onResize()
    {
        let m = this.margin();
        this.youtubePlayer.setSize(this.div.w() - m, (this.div.w() - m) * 0.5);
    }

    show()
    {
        super.show(); 
        try{
            this.youtubePlayer.playVideo();
        }catch(e){};
    }

    hide()
    {
        super.hide(); 
        if (this.youtubePlayer)
            this.youtubePlayer.pauseVideo();
    }
}
