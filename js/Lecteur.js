const IMAGES_PATH = FM + "/images/lecteur";
class Lecteur
{
    static get ALL_QUALITY()
    {
        return 2;
    }

    static get MIN_QUALIY()
    {
        return 1;
    }

    static get NO_QUALITY()
    {
        return 0;
    }

    constructor(src, img, parent = B, fullScreenElmt=null, replaceElmt=null, hover=true, quality=Lecteur.NO_QUALITY, startOnLoad = false, hideButon=false)
    {
        this.playing = false;
        this.quality = quality;
        this.funcToExecuteOnStart = [];
        this.onPlayf = [];
        this.onPause = [];
        this.onDownload = [];
        this.onReady = [];
        this.startOnLoad = startOnLoad;
        this.hideButon = hideButon;
        this.preInterface(src, img, parent);
        this.createDiv(replaceElmt, fullScreenElmt);
        this.imgInterface(hover);

        // attribute change when the video tag is created
        this.started = false;
        scripts.import(FM + "/js/time.js");
    }

    static newFromElmt(elmt, src, img, fullScreenElmt=null, hover=true, quality=false, startOnLoad = false, hideButon=false)
    {
        return new Lecteur(src, img, elmt.parentNode, fullScreenElmt, elmt, hover, quality, startOnLoad, hideButon);
    }

    enable()
    {
        this.div.classList.remove("disabled");
    }

    disable()
    {
        this.div.classList.add("disabled");
    }

    preInterface(src, img, parent)
    {
        this.parent = parent;
        this.events = [];
        this.move = false;
        this.imgsrc = img.replace(".jpg", "");
        this.volumeDown = false;
        this.src = src;
    }

    createDiv(elmtToReplace=null, fullScreenElmt = null)
    {
        if (!elmtToReplace)
            this.container = this.parent.newNode("div", "lecteur-container");
        else 
        {
            this.container = D.createElement("div", "lecteur-container");
            this.container = elmtToReplace.replace(this.container);
        }

        this.div = this.container.newNode("div"); 
        this.div.classList.add("video");
        this.div.classList.add("lecteur");
        this.container.allow = "fullscreen";
        this.div.setAttribute("tabindex", 1);

        if (!fullScreenElmt)
            this.fullScreenElmt = this.container; 
        else 
            this.fullScreenElmt = fullScreenElmt;

        if (this.hideButon)
            this.div.close = this.div.newButton("", () => this.remove(), "close");
    }

    remove()
    {
        if (this.div.parentNode.classList.contains("lecteur-container"))
            this.div.parentNode.remove();
        else 
            this.div.remove();
    }

    interface()
    {
        this.div.video = this.div.newNode("video"); 
        this.gradient = new LecteurGradient(this);
        this.seeker = new Seeker(this);
        this.buttons = new LecteurButtons(this);
        this.settings = new LecteurSettings(this);

        for (let el of this.div.getElementsByTagName("IMG"))
            el.draggable = false;

        this.div.video.addEventListener("canplay", () =>
        {
            for (const f of this.funcToExecuteOnStart)
                f();
            this.funcToExecuteOnStart = [];
        });
// 

//         this.setResponsiveStyle();
        this.started = true;
    }

    addEventListener(type, func)
    {
        if (this.div.video)
        {
            this.div.video.addEventListener(type, func);
            return;
        }

        let e = new Event(type, func);
        this.events.push(e);
    }

    addOnLoad(func)
    {
        if (!this.imgNode)
            return;

        this.imgNode.addEventListener("load", func);
    }

    addOnStart(func)
    {
        this.funcToExecuteOnStart.push(func);
    }

    addAllEvents()
    {
        if (!this.div.video)
            return;
        for (let e of this.events)
            this.div.video.addEventListener(e.type, e.func);
    }

    // to reimplement in child class or in an event
    onStart(){}

    start()
    {
        this.onStart();
        this.interface();
        if (!this.src.includes(".mp4") && !this.src.includes(".webm"))
            this.src += ".mp4";
        this.div.video.rec = 0;
        this.div.video.src = this.src;
        this.setEvents();
        this.wait = new Wait(this);

        if (this.quality != Lecteur.NO_QUALITY)
            this.setQuality("hd");

        const promise = this.onPlay();
        this.imgNode.remove(); 
        if(this.imgHoverNode)
            this.imgHoverNode.remove();
        if (this.playButton)
            this.playButton.remove();
        if (this.downloadButton)
            this.downloadButton.classList.add("video");
        return promise;
    }

    imgInterface(hover=true)
    {
        this.imgHoverNode = null;
        if (hover)
        {
            this.imgHoverNode = this.div.newImg(this.imgsrc + "Hover.jpg");
            this.imgHoverNode.className = "videoHoverImgs"; 
            this.imgHoverNode.style.opacity = "0";
        }
        
        if (!this.imgsrc.includes(".webp"))
            this.imgNode = this.div.newImg(this.imgsrc + ".jpg");
        else 
            this.imgNode = this.div.newImg(this.imgsrc);
        this.imgNode.className = "videoImgs"; 
        this.imgNode.style.opacity = "1";
        this.imgNode.addEventListener("click", () => this.start());

        if (this.imgHoverNode)
        {
            this.imgNode.addEventListener("mouseover", () =>
                {
                    this.imgHoverNode.style.opacity = 1; this.imgNode.style.opacity = 0;
                    this.imgHoverNode.style.width = this.imgNode.width + "px";
                    this.imgHoverNode.style.height = this.imgNode.height + "px";
                });
            this.imgNode.addEventListener("mouseleave", () => {this.imgHoverNode.style.opacity = 0; this.imgNode.style.opacity = 1});
        }

        this.imgNode.addEventListener("load", () => this.onReady.execs());
        if (this.startOnLoad)
            this.imgNode.addEventListener("load", ()=>this.start());

    }

    setEvents()
    {
        this.div.video.addEventListener("click", () => this.onPlay());
        this.div.video.addEventListener("dblclick", () => this.toggleFullScreen());
        this.div.video.addEventListener("loadedmetadata", () => this.wait.setPos());
        this.div.video.addEventListener("canplay", () => this.videoLoaded());
        this.div.video.addEventListener("contextmenu", (e) => e.preventDefault());
        this.div.addEventListener("mouseenter", () => 
            {
                if (!this.downloadable)
                    return;
                this.downloadButton.style.opacity = 1
            }
        );
        this.div.addEventListener("mousemove", () => 
            {
                if (!this.downloadable)
                    return;
                this.downloadButton.style.opacity = 1
            }

        );
        this.div.addEventListener("mouseleave", () => 
            {
                if (!this.downloadable)
                    return;
                if (!this.video().paused)
                    this.downloadButton.style.opacity = 0;
            });

        this.handler = setInterval(() => 
            {
                if (!this.isfullscreen())
                    return;

                if (!this.video().paused)
                {
                    this.buttons.div.style.opacity = 0;
                    this.settings.div.style.opacity = 0;
                    this.seeker.div.style.opacity = 0;
                    this.gradient.div.style.opacity = 0;
                }
            }, 1000);

        this.video().addEventListener("pause", () => 
            {
                this.buttons.div.style.opacity = 1;
                this.settings.div.style.opacity = 1;
                this.seeker.div.style.opacity = 1;
                this.gradient.div.style.opacity = 1;
            });

        this.hideMouseHandler = null;

        this.div.addEventListener("mousemove", () => 
            {
                if (this.hideMouseHandler)
                    clearTimeout(this.hideMouseHandler);

                this.video().style.cursor = "pointer";

                if (this.isfullscreen())
                {
                    this.hideMouseHandler = setTimeout(() => 
                        {
                            this.video().style.cursor = "none";
                        }, 1000);
                }
            });

        addEventListener("resize", ()=> this.setFullScreenSize());
        addEventListener("fullscreenchange", () => this.onFullScreenChange());
        this.setKeyEvents();
        this.addAllEvents();
    }

    isFocused()
    {
        if (this.container == D.activeElement)
            return true;

        for (const c of this.container.deepChildren()) // should check this, there is an error here un MLT Tools (Maxime J)
        {
            if (c == D.activeElement)
                return true;
        }
        return false;
    }

    setKeyEvents()
    {
        addEventListener("keydown", (e) => 
        {
            if (!this.isFocused())
                return;

            if (e.keyCode == 32 || e.key == "k")
            {
                e.preventDefault();
                this.onPlay();
            }

            else if (e.key == "ArrowRight" || e.key == "l") // right arrow
                this.div.video.currentTime += 5;
            
            else if (e.key == "ArrowLeft" || e.key == "j") // left arrow
                this.div.video.currentTime -= 5;

            else if (e.key == "PageUp")
                this.div.video.currentTime = this.div.video.duration;

            else if (e.key == "PageDown")
                this.div.video.currentTime = this.div.video.duration;

            else if (e.key == "ArrowUp" && !e.ctrlKey)
                this.div.video.volume += 0.1;

            else if (e.key == "ArrowDown" && !e.ctrlKey)
                this.div.video.volume -= 0.1;

            else if (e.key == "ArrowUp" && e.ctrlKey)
                this.div.video.playbackRate += 0.5;

            else if (e.key == "ArrowDown" && e.ctrlKey)
                this.div.video.playbackRate -= 0.5;

            else if (e.key == "m")
                this.div.video.muted = !this.div.video.muted;

            else if (e.key == "Escape") // esc
            {
                e.cancelBubble = true;
                e.stopPropagation();            
                this.fullscreenOff();
                return false;
            }

            else if (e.ctrlKey && e.key == "c")
            {
                scripts.import(FM + "/js/urlParameters.js", () => 
                    {
                        const _email = email();
                        if (_email == "romain.gilliot@motion-live.com" || 
                            _email == "angela.mikrut@gmail.com" || 
                            _email == "paxproject@outlook.fr" || 
                            _email == "monti.3dvfx@gmail.com" || 
                            _email == "yohann.peraldi@gmail.com")
                        {
                            navigator.clipboard.writeText(this.div.video.src).then(() => 
                                {
                                    if (typeof(h3d2) == "undefined")
                                        return;
                                    h3d2.message("Lien de la vidéo copié dans le clipboard.");
                                });
                        }
                    });
            }
        });
    }

    setQuality(qual)
    {
        let type = "mp4";
        if (this.div.video.src.includes(".webm"))
            type = "webm";
        let src = this.div.video.src.replace(".mp4", "");
        src = src.replace(".webm", "");
        src = src.replace("_ultra", "");
        src = src.replace("_hd", "");
        src = src.replace("_med", "");
        src = src.replace("_low", "");
        if (type == "mp4")
            src += "_" + qual + ".mp4";
        else if (type == "webm")
            src += "_" + qual + ".webm";
        const time = this.div.video.currentTime;
        this.div.video.rec = 0;
        this.div.video.src = src;
        this.div.video.currentTime = time;
    }

    videoLoaded()
    {
        if (this.playing)
            this.div.video.play();
    }

    fullscreen()
    {
        fullScreenOn(this.fullScreenElmt);
    }

    fullscreenOff()
    {
        fullScreenOff(this.fullScreenElmt);
    }

    onFullScreenChange()
    {
        if (this.isfullscreen())
        {
            this.setFullScreenSize();
            this.hideMouseHandler = setTimeout(() => 
                {
                    this.video().style.cursor = "none";
                });
        }
        else 
        {
            this.video().style.cursor = "pointer";
            this.div.style.width = "";
        }
    }

    isfullscreen()
    {
        return D.fullscreenElement == this.container;
    }

    toggleFullScreen()
    {
        if (D.fullscreenElement == this.container)
            this.fullscreenOff();
        else
            this.fullscreen();
    }

    setFullScreenSize()
    {
        if (!this.isfullscreen())
            return;
        let v_ratio = parseFloat(this.video().videoWidth)/parseFloat(this.video().videoHeight);
        let s_ratio = parseFloat(innerWidth)/parseFloat(innerHeight);

        if (s_ratio > v_ratio)
            this.div.style.width = (innerHeight * v_ratio) + "px";
        else
            this.div.style.width = "100%";
    }

    onPlay()
    {
        let promise = null;
        if (this.div.video.paused)
        {
            this.playing = true;
            promise = this.div.video.play();
            for (const f of this.onPlayf)
                f();
        }

        else 
        {
            this.playing = false;
            promise = this.div.video.pause();
            for (const f of this.onPause)
                f();
        }

        return promise;
    }

    pause()
    {
        for (const f of this.onPause)
            f();
        return this.div.video.pause();
    }

    play()
    {
        for (const f of this.onPlayf)
            f();
        return this.div.video.play();
    }

    // options : 
    // {
    //      x (float 0<=x<=1)
    //      y (float 0<=x<=1)
    //      timeShow (int - the time in second to show the element)
    //      timeHide (int - the time in second to hide the elment)
    // }
    addElmtOnVideo(elmt, options)
    {
        this.div.prepend(elmt);
        elmt.style.position = "absolute";
        elmt.style.opacity = 0;
        elmt.hide();

        function place()
        {
            elmt.show(false);
            if (innerWidth>840)
            {
                elmt.style.marginLeft = (options.x * this.div.w()) + "px";
                elmt.style.marginTop = (options.y * this.div.h()) + "px";
            }

            else 
            {
                if (options.phoneX)
                    elmt.style.marginLeft = (options.phoneX * this.div.w()) + "px";
                else 
                    elmt.style.marginLeft = (options.x * this.div.w()) + "px";

                if (options.phoneY)
                    elmt.style.marginTop = (options.phoneY * this.div.h()) + "px";
                else 
                    elmt.style.marginTop = (options.y * this.div.h()) + "px";
            }
        }

        function show()
        {
            if (options.timeShow && this.div.video.currentTime>=options.timeShow)
            {
                elmt.style.animation = "show-video-elmt 0.3s";
                elmt.style.opacity = 1;
            }
            else if (options.timeHide && this.div.video.currentTime>=options.timeHide)
                elmt.style.opacity = 0;
            else 
                elmt.style.opacity = 0;
        }

        addEventListener("resize", place.bind(this));
        this.addEventListener("playing", place.bind(this));

        this.addEventListener("timeupdate", show.bind(this))
    }

    createPlayButton()
    {
        const img = D.createImg(MLT + "/images/play.png", "play");
        this.playButton = this.div.newButton(img, () => this.start(), "play-button", "", true);
        img.style.width = "100%";

        this.playButton.style.width = this.div.w()/4 + "px";
        this.playButton.style.maxWidth = "512px";

        this.playButton.style.position = "absolute";
        
        this.playButton.center(this.div);

        if (this.imgNode)
            this.imgNode.addEventListener("load", () => this.playButton.center(this.div));
        img.addEventListener("load", () => this.playButton.center(this.div));
        addEventListener("resize", () => this.playButton.center(this.div));
    }

    setDownloadable()
    {
        this.downloadable = true;
        const img = D.createImg(MLT + "/images/icons/download-hdd.png", "download");
        this.downloadButton = this.div.newButton(img, () => this.download(), "download");
        img.style.width = "100%";
    }

    download()
    {
        const a = D.createElement("a");
        a.href = this.src;
        a.setAttribute("download", this.src.split("/").last());
        a.click();

        for (const f of this.onDownload)
            f();
    }

    addOnDownload(f){this.onDownload.push(f);}
    addOnPlay(f){this.onPlayf.push(f);}
    addOnPause(f){this.onPause.push(f);}

    serialize()
    {
        const r = {};
        r.src = this.src;
        r.imgsrc = this.imgsrc;
        return r;
    }

    video(){return this.div.video;}

}

class LecteurGradient
{
    constructor(lecteur)
    {
        this.lecteur = lecteur;
        this.draw();
        this.setEvents();
    }

    draw()
    {
        this.div = this.lecteur.div.newNode("div", "gradient");
    }

    setEvents()
    {
        this.lecteur.div.addEventListener("mouseenter", () => this.div.style.opacity = 1);
        this.lecteur.div.addEventListener("mousemove", () => this.div.style.opacity = 1);
        this.lecteur.div.addEventListener("mouseleave", () => 
            {
            if (!this.lecteur.video().paused)
                this.div.style.opacity = 0;
        });
    }
}

class Seeker
{
    constructor(lecteur)
    {
        this.lecteur = lecteur;
        this.draw();
        this.setEvents();
    }

    draw()
    {
        this.container = this.lecteur.div.newNode("div", "seeker-container");
        this.div = this.container.newNode("div", "seeker");
        this.seekableBar = this.div.newNode("div", ["bar", "seekable"]);
        this.playBar = this.div.newNode("div", ["bar", "play"]);
        this.mousePosBar = this.div.newNode("div", ["bar", "mouse-position"]);
        this.point = this.div.newNode("div", "point");

        this.timeLabel = this.div.newNode("div", "time");
        this.timeLabel.innerText = "00:00";
        this.timeLabel.style.opacity = 0;
    }

    setEvents()
    {
        this.lecteur.addEventListener("durationchange", () => this.updateCurrentTime());
        this.lecteur.addEventListener("timeupdate", () => this.updateCurrentTime());

        this.lecteur.addEventListener("canplay", () => this.updateSeekable());
        this.lecteur.addEventListener("canplaythrough", () => this.updateSeekable());
        this.lecteur.addEventListener("seeked", () => this.updateSeekable());
        this.lecteur.addEventListener("seeking", () => this.updateSeekable());
        this.lecteur.addEventListener("waiting", () => this.updateSeekable());

        this.container.addEventListener("mouseenter", () => this.onMouseEnter());
        this.container.addEventListener("mouseleave", () => this.onMouseLeave());

        this.container.addEventListener("mousemove", (e) => this.onMouseMove(e));
        this.container.addEventListener("click", (e) => this.onSeek(e));

        this.lecteur.addEventListener("play", () => this.container.style.opacity = 0);
        this.lecteur.addEventListener("pause", () => this.container.style.opacity = 1);

        this.lecteur.div.addEventListener("mouseenter", () => this.container.style.opacity = 1);
        this.lecteur.div.addEventListener("mousemove", () => this.container.style.opacity = 1);
        this.lecteur.div.addEventListener("mouseleave", () => 
            {
            if (!this.lecteur.video().paused)
                this.container.style.opacity = 0;
        });
    }

    onMouseEnter()
    {
        this.div.classList.add("hover");
        this.mousePosBar.style.opacity = 1;
        this.timeLabel.style.opacity = 1;
        this.point.style.transform = "scale(1)";
    }

    onMouseLeave()
    {
        this.div.classList.remove("hover");
        this.mousePosBar.style.opacity = 0;
        this.timeLabel.style.opacity = 0;
        this.point.style.transform = "scale(0)";
    }

    updateCurrentTime()
    {
        this.playBar.style.width = (this.lecteur.video().currentTime / this.lecteur.video().duration) * 100 + "%";
        this.placePoint();
        this.updateSeekable();
    }

    placePoint()
    {
        this.point.style.marginLeft = (this.playBar.w() - 5) + "px";
    }

    currentRange()
    {
        for (let i=0; i<this.lecteur.video().buffered.length; i++)
        {
            if (this.lecteur.video().buffered.start(i) <= this.lecteur.video().currentTime && this.lecteur.video().buffered.end(i) >= this.lecteur.video().currentTime)
                return i;
        }
        return 0;
    }
    
    updateSeekable()
    {
        const current = this.currentRange();
        try
        {
            this.seekableBar.style.width = (this.lecteur.video().buffered.end(current) / this.lecteur.video().duration) * 100 + "%";
        }catch(e){}
    }

    updateMousePosBar(e)
    {
        const x = parseFloat(e.offsetX);
        const w = parseFloat(this.div.w());
        this.mousePosBar.style.width = (x / w) * 100 + "%";
    }

    updateTimeLabelPos(e)
    {
        let margin = e.offsetX;
        margin -= this.timeLabel.w()/2;
        this.timeLabel.style.marginLeft = margin + "px";

        const w = parseFloat(this.div.w());
        let time = parseFloat(e.offsetX)/w * this.lecteur.video().duration;

        this.timeLabel.innerText = Time.readableFromSecs(time);
    }

    onMouseMove(e)
    {
        this.updateMousePosBar(e);
        this.updateTimeLabelPos(e);
        if (e.button == 1 || e.buttons == 1)
            this.onSeek(e)
    }

    onSeek(e)
    {
        const x = parseFloat(e.offsetX);
        const w = parseFloat(this.div.w());
        this.lecteur.video().currentTime = (x / w) * this.lecteur.video().duration;
    }
}

class LecteurButtons
{
    constructor(Lecteur)
    {
        this.lecteur = Lecteur;
        this.draw();
        this.setEvents();
    }

    draw()
    {
        this.div = this.lecteur.div.newNode("div", "buttons");
        this.play = this.div.newButton("", () => this.onPlay(), "play");
        this.play.playimg = this.play.newImg(IMAGES_PATH + "/play.png");
        this.play.pauseimg = this.play.newImg(IMAGES_PATH + "/pause.png");

        this.volume = this.div.newButton("", () => this.onVolume(), "volume");
        this.volume.on = this.volume.newImg(IMAGES_PATH + "/volume.png");
        this.volume.off = this.volume.newImg(IMAGES_PATH + "/volume-off.png");
        this.volume.off.hide();

        this.time = this.div.newNode("div", "time");
        this.time.current = this.time.newTitle("div", "00:00:00");
        this.time.sep = this.time.newTitle("div", "/", "sep");
        this.time.total = this.time.newTitle("div", "00:00:00");

        this.settings = this.div.newButton("", () => this.onSettings(), "settings");
        this.settings.img = this.settings.newImg(IMAGES_PATH + "/settings.png");

        this.fullscreen = this.div.newButton("", () => this.onFullScreen(), "fullscreen");
        this.fullscreen.img = this.fullscreen.newImg(IMAGES_PATH + "/full.png");
    }

    setEvents()
    {
        this.lecteur.video().addEventListener("play", () => {
            this.play.pauseimg.show();
            this.play.playimg.hide();
        });
        this.lecteur.video().addEventListener("pause", () => {
            this.play.playimg.show();
            this.play.pauseimg.hide();
        });

        this.lecteur.video().addEventListener("volumechange", () => {
            if (this.lecteur.video().muted || this.lecteur.video().volume == 0)
            {
                this.volume.on.hide();
                this.volume.off.show();
            }
            else
            {
                this.volume.off.hide();
                this.volume.on.show();
            }
        });

        this.lecteur.video().addEventListener("timeupdate", () => {
            this.time.current.innerText = Time.readableFromSecs(this.lecteur.video().currentTime);
        });

        this.lecteur.video().addEventListener("loadedmetadata", () => {
            this.time.total.innerText = Time.readableFromSecs(this.lecteur.video().duration);
        });

        this.lecteur.div.addEventListener("mouseenter", () => this.div.style.opacity = 1);
        this.lecteur.div.addEventListener("mousemove", () => this.div.style.opacity = 1);
        this.lecteur.div.addEventListener("mouseleave", () => 
            {
            if (!this.lecteur.video().paused)
                this.div.style.opacity = 0;
        });

        this.settings.img.addEventListener("load", () => this.lecteur.settings.placeSettingsBlock());

    }

    onPlay()
    {
        this.lecteur.onPlay();
    }

    onVolume()
    {
        this.lecteur.video().muted = !this.lecteur.video().muted;
    }

    onSettings()
    {
        this.lecteur.settings.toggle();
        this.settings.toggleClass("active");
    }

    onFullScreen()
    {
        this.lecteur.toggleFullScreen();
    }
}

class LecteurSettings
{
    constructor(Lecteur)
    {
        this.lecteur = Lecteur;
        this.draw();
        this.setEvents();
    }

    draw()
    {
        this.div = this.lecteur.div.newNode("div", "settings-bloc");
        this.rate = this.div.newNode("div", "rate");
        let rate = 0.5;
        while (rate <=3.0)
        {
            const b = this.rate.newTitle("button", round(rate, 1) + "x", ["rate-" + round(rate, 1)]);
            b.rate = rate;
            b.addEventListener("click", () => this.onRateButtonClick(b));
            if (rate == 1.0)
                b.classList.add("active");
            rate += 0.5;
        }

        if (this.lecteur.quality == Lecteur.NO_QUALITY)
        {
            this.placeSettingsBlock();
            this.hide();
            return;
        }

        this.qualities = this.div.newNode("div", "qualities");
        let qla = [];
        if (this.lecteur.quality == Lecteur.ALL_QUALITY || this.lecteur.quality === true)
            qla = ["ultra", "hd", "med", "low"];

        else if (this.lecteur.quality == Lecteur.MIN_QUALIY)
            qla = ["hd", "low"];

        for (const qual of qla)
        {
            const b = this.qualities.newTitle("button", qual.capitalize(), ["quality-" + qual]);
            b.quality = qual;
            b.addEventListener("click", () => this.onQualityButtonClick(b));
        }

        this.placeSettingsBlock();
        this.hide();
    }

    onRateButtonClick(button)
    {
        for (const b of this.rate.children)
            b.classList.remove("active");
        button.classList.add("active");
        this.lecteur.video().playbackRate = button.rate;
    }

    onQualityButtonClick(button)
    {
        for (const b of this.qualities.children)
            b.classList.remove("active");
        button.classList.add("active");
        this.lecteur.setQuality(button.quality);
    }

    placeSettingsBlock()
    {
        if (isPhone() && innerHeight> innerWidth)
            this.div.style.marginTop = "";
        else 
        {
            let t = this.div.h();
            t += 55;
            this.div.style.marginTop = "-" + t + "px";
        }
    }

    setEvents()
    {
        addEventListener("resize", () => this.placeSettingsBlock());
        this.lecteur.div.addEventListener("mouseenter", () => this.div.style.opacity = 1);
        this.lecteur.div.addEventListener("mousemove", () => this.div.style.opacity = 1);
        this.lecteur.div.addEventListener("mouseleave", () => 
            {
                if (!this.lecteur.video().paused)
                    this.div.style.opacity = 0;
            });
    }

    show(){this.div.show(); this.placeSettingsBlock();}
    hide(){this.div.hide();}

    toggle()
    {
        if (this.div.isVisible())
            this.hide()
        else 
            this.show();
    }
}

class Wait
{
    constructor(Lecteur)
    {
        this.lecteur = Lecteur;
        this.div = this.lecteur.div.prependNode("div", "wait-container");
        this.div.content = this.div.newNode("div", "wait");
        this.div.hide();
        this.setEvents();
        this.setPos();
    }

    setEvents()
    {
        this.lecteur.div.video.addEventListener("waiting", () => this.show());
        this.lecteur.div.video.addEventListener("playing", () => this.hide());
        this.lecteur.div.video.addEventListener("canplay", () => this.hide());
        this.lecteur.div.video.rec = 0;
        addEventListener("resize", () => this.setPos());
        addEventListener("load", () => this.setPos());

        this.lecteur.div.video.addEventListener("error", () => {
            if (this.lecteur.div.video.rec > 1)
                return;
            this.lecteur.div.video.src = this.lecteur.div.video.src.replace(".mp4", ".webm");
            this.lecteur.div.video.rec++;
        });
    }

    setPos()
    {
        const h = this.lecteur.div.video.h();
        const w = this.lecteur.div.video.w();
        this.div.style.transform = "translate(" + (w/2 - this.div.w()/2) + "px, " + (h/2 - this.div.h()/2) + "px)";
    }

    show()
    {
       this.div.show();
        this.div.style.animation = "show-loader 0.5s";
        this.div.classList.remove("error");
    }

    hide()
    {
        this.div.hide();
    }
}

class Event
{
    constructor(type, func)
    {
        this.type = type; 
        this.func = func;
    }
}
