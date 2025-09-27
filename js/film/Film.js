class Film
{
    //elmts are dom elmts you can after the button 'Lecture'
    constructor(filmCode, parent=B, elmts=[])
    {

        this.elmtsToAddOnVideos = [];
        this.elmtsToAddOnTrailer = [];
        this.parent = parent;
        this.elmts = elmts;
        this.dataPath = "/data/films";
        if (location.href.includes("localhost/"))
            this.dataPath = "/motion-live" + this.dataPath;

        DistFile.content(this.dataPath + "/" + filmCode + ".json", 
        (json) => this.read(json), 
        true);

        this.interface();
        this.cmds = new CmdCatcher(this);
    }

    read(json)
    {
        this.data = json; 
        this.fillInterface();
    }

    interface()
    {
        this.div = this.parent.newNode("div", "film");
        this.div.bgImg = this.div.newImg("");
        this.div.bgImg.classList.add("bg-img");
        this.div.bgImg.style.objectFit = "cover";
        const fg = this.div.fg = this.div.newNode("div", "fg");
        fg.titre = fg.newNode("div", "title");
        fg.resume = fg.newNode("div", "resume");
        fg.buttons = fg.newNode("div", "buttons");
        fg.buttons.play = fg.buttons.newButton("", () => this.play(), "play");
        fg.buttons.play.imgPlay = fg.buttons.play.newImg("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMyAyMnYtMjBsMTggMTAtMTggMTB6Ii8+PC9zdmc+");
        fg.buttons.play.txt = fg.buttons.play.newTitle("div", "Lecture");
        this.additionalElments();
        addEventListener("resize", () => this.placeElmts());
        addEventListener("load", () => this.placeElmts());
    }

    fillInterface()
    {
        if (!this.div)
        {
            console.log( "Can't fill the interface, it does not exist yet.");
            return;
        }

        this.div.bgImg.src = this.data.bgImg;
        this.div.bgImg.addEventListener("load", () => {this.placeElmts(); this.loadBgVideoIfExists()});

        if (this.data.titleImg)
            this.div.fg.titre.innerHTML = "<img src='" + this.data.titleImg + "' />";
        else 
            this.div.fg.titre.innerHTML = this.data.name;
        this.div.fg.resume.innerHTML = this.data.resume;
        if (this.data.date)
            this.date = Date.fromStr(this.data.date);
        const today = this.isToday();

        if (this.date && !today && this.date>new Date())
        {
            importScripts([mkJs(FM + "/js/calendrier/CalendarPres.js"), 
                mkJs(FM + "/js/chrono/Chrono.js")], () => 
                {
                    if (this.data.hour)
                    {
                        const t = this.data.hour.split(":");
                        const h = parseInt(t[0]);
                        const m = parseInt(t[1]);
                        this.date.setHours(h);
                        this.date.setMinutes(m);
                    }
                    this.div.fg.buttons.remove();
                    this.div.fg.date = this.div.fg.newTitle("div", "Sortie le : <b>" + this.date.getDate() + " " + MONTHS[this.date.getMonth()] + "</b>", "date");
                    if (this.data.hour)
                        this.div.fg.date.innerHTML += " à <b>" + this.date.getHours().toString().padStart(2, '0') + ":" + this.date.getMinutes().toString().padStart(2, '0') + "</b>";
                    this.div.fg.chrono = this.div.fg.newNode("div", "chrono-container");
                    this.chrono = Chrono.fromEndDate(this.date, this.div.fg.chrono);
                    if (this.data.hour)
                        this.div.fg.calendarBtn = this.div.fg.newButton("<img class='icon' src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/1024px-Google_Calendar_icon_%282020%29.svg.png' /> Ajouter un rappel", () => window.open(this.generateGoogelCalendarLink()), "calendar");

                    if (this.data.trailer)
                    {
                        this.div.fg.trailer = this.div.fg.newNode("div", "trailer");
                        this.div.fg.trailer.txt = this.div.fg.trailer.newNode("div", "txt");
                        this.div.fg.buttons = this.div.fg.trailer.buttons = this.div.fg.trailer.newNode("div", "buttons");
                        const b = this.div.fg.trailer.buttons.play = this.div.fg.trailer.buttons.newButton("", () => this.watchTrailer(), "play");

                        b.imgPlay = b.newImg("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMyAyMnYtMjBsMTggMTAtMTggMTB6Ii8+PC9zdmc+");
                        if (this.data.trailer.txt)
                            this.div.fg.trailer.txt.innerHTML = this.data.trailer.txt;
                        else 
                            this.div.fg.trailer.txt.innerHTML = "Regarde le trailer du film maintenant :";

                        if (this.data.trailer.button)
                            b.innerHTML += this.data.trailer.button;
                        else 
                            b.innerHTML += "Voir la bande annonce";
                        this.additionalElments();

                    }
                });
        }

        else if (today && this.data.liveId)
        {
            newCss(FM + "/css/ytPlayer.css");
            importScripts([mkJs(FM + "/js/YTPlayer.js")], () => 
                {
                    this.live = new YTPlayer(this.div.fg, {id : this.data.liveId, logoColor : "white"}, "");
                    this.live.displayTchat = true;
                });
            this.div.fg.buttons.remove();
        }

        else if (this.date< new Date())
        {
            
        }


    }

    isToday()
    {
        if (!this.date)
            return false;
        let d = new Date();
        return d.isTheSameDay(this.date);
    }

    generateGoogelCalendarLink()
    {
        let home = "https://calendar.google.com/calendar/render?action=TEMPLATE";
        let title = "&text=" + this.data.name;
        let details = "&details=" + this.data.resume.replace(/<br>/g, "\n");
        let loc = "&location=" + location.href;
        let day = this.date.getFullYear().toString() + (this.date.getMonth() + 1).toString().padStart(2, "0") + this.date.getDate().toString().padStart(2, "0");
        let startH = this.date.getUTCHours().toString().padStart(2, "0") + this.date.getMinutes().toString().padStart(2, "0") + "00Z";
        let endH = (this.date.getUTCHours() + 1).toString().padStart(2, "0") + this.date.getMinutes().toString().padStart(2, "0") + "00Z";
        let dates = "&dates=" + day + "T" + startH + "/" + day + "T" + endH;


        return encodeURI(home + title + details + loc + dates);
    }

    placeElmts()
    {
        const fg = this.div.fg;
        const bg = this.bg();

        fg._height = fg.h();
        bg._height = bg.h();
        bg.style.height = fg._height + "px";

        if (bg.w()<= innerWidth)
            bg.style.width = innerWidth + "px";
        else 
            bg.style.width = "initial";
    }

    bg()
    {
        if (this.div.bgVideo)
            return this.div.bgVideo;
        else 
            return this.div.bgImg;
    }

    additionalElments()
    {
        for (const elmt of this.elmts)
            this.div.fg.buttons.append(elmt);
    }

    loadBgVideoIfExists()
    {
        if (!this.data.bgVideo)
            return;
        this.div.bgVideo = this.div.prependNode("video", "bg-img");
        this.div.bgVideo.src = this.data.bgVideo;
        this.div.bgVideo.loop = true; 
        this.div.bgVideo.autoplay = true;
        this.div.bgVideo.mute = true;

        this.div.bgVideo.addEventListener("canplay", () => this.div.bgImg.hide());
    }

    play()
    {
        this.div.lecteurMask = this.div.newNode("div", "lecteur-container");
        this.lecteur = new Lecteur(this.data.path, this.data.playImg, this.div.lecteurMask, null, null, true, true, true, true);
        for (const el of this.elmtsToAddOnVideos)
            this.lecteur.addElmtOnVideo(el.elmt, el.options);

        this.lecteur.addOnLoad(() => this.placeVideo());
        this.lecteur.addOnStart(() => this.placeVideo());
    }

    placeVideo()
    {
        let left = innerWidth - this.lecteur.div.w();
        left = left/2;
        this.lecteur.div.style.left = left + "px";

        let top = innerHeight - this.lecteur.div.h();
        top = top/2;
        this.lecteur.div.style.top = top + "px";
    }

    watchTrailer()
    {
        this.div.lecteurMask = this.div.newNode("div", "lecteur-container");
        this.lecteur = new Lecteur(this.data.trailer.path, this.data.trailer.playImg, this.div.lecteurMask, null, null, true, true, true, true);
        for (const el of this.elmtsToAddOnTrailer)
            this.lecteur.addElmtOnVideo(el.elmt, el.options);

        this.lecteur.addOnLoad(() => this.placeVideo());
        this.lecteur.addOnStart(() => this.placeVideo());
    }

    height()
    {
        return this.div.bgImg.h();
    }

    width()
    {
        return this.div.bgImg.w();
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
        const el = {}; 
        el.elmt = elmt; 
        el.options = options;

        this.elmtsToAddOnVideos.push(el);
    }

    addElmtOnTrailer(elmt, options)
    {
        const el = {}; 
        el.elmt = elmt; 
        el.options = options;

        this.elmtsToAddOnTrailer.push(el);
    }
}

class CmdCatcher
{
    constructor(film, url="/data/lives/live-cmd")
    {
        this.film = film;
        this.url = url;
        this.currentCmd = "none";
        this.h3d2Doned = false;
        this.init();
    }

    init()
    {
        setInterval(()=>
        {
            DistFile.read(this.url, (xhr) => 
                {
                    const r = xhr.responseText;
                    if (r == "none")
                        return;
                    else if (r == this.currentCmd)
                        return;
                    if (!this[r])
                        return;
                    this[r]();
                    this.currentCmd = r;
                })
        }, 2500)
    }

    showH3D2Btn(film)
    {
        if (!film)
            film = this.film;
        const b = B.newButton("Clique ici pour en savoir plus sur l'école H3D2<br>(et pourquoi pas déposer ta candidature)", () => window.open(H3D2 + "/inscription.php?prenom=" + prenom() + "&email=" + email()), ["h3d2", "master", "show-anim"]);

        B.addEventListener("click", (e) => b.remove());

        if (!this.h3d2Doned)
        {
            const b2 = film.div.fg.newButton("Clique ici pour en savoir plus sur l'école H3D2<br>(et pourquoi pas déposer ta candidature)", () => window.open(H3D2 + "/inscription.php?prenom=" + prenom() + "&email=" + email()), ["h3d2", "show-anim"]);
            this.h3d2Doned = true;
        }
    }

}
