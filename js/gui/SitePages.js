class SitePages
{
    constructor(parent=B)
    {
        this.root = "";
        this.parent = parent;
        this.dom = this.parent.newNode("div", "pages");
        this.pages = [];

        //list of function executed when a page change (not when it is finished to load)
        //take the Page object that emit the change event in arg 
        this.onPageChange = [() => this.load()];

        //list of function executed when a page loaded (executed after the change event, when it loaded, if already loaded, it will fire just after the 'change' event)
        //take the Page object that emit the change event in arg 
        this.onPageLoaded = [() => this.loader.hide()];
        this.onPageShown = [];
    }

    newHomePage(id="/")
    {
        const p = new SitePage(this);
        p.id = id;
        p.func = () => location.href = this.root + "/";
        this.pages.push(p);
        return p;
    }

    newPageFromUrl(url, id="")
    {
        const p = new SitePage(this, url);
        if (id == "")
            p.id = url;
        else 
            p.id = id;
        this.pages.push(p);
        return p;
    }

    newPageFromHtml(htmldata, id="")
    {
        const p = new SitePage(this, "", htmldata);
        p.id = id;
        this.pages.push(p);
        return p;
    }

    newPageFromFunc(func, id="", useHistory=true)
    {
        const p = new SitePage(this);
        p.id = id;
        p.func = func;
        p.useHistory = useHistory;
        this.pages.push(p);
        return p;
    }

    //this function can be overwritten ! 
    //this show a load UI on the interface this.parent
    //in default in the onPageChange event
    load()
    {
        if (!this.loader)
            this.loader = this.dom.newNode("div", "loader");
        this.loader.show();
    }

    //get pages by id
    get(id)
    {
        for (const p of this.pages)
        {
            if (p.id == id)
                return p;
        }
        return null;
    }
    //get pages by id
    getByUrl(url)
    {
        for (const p of this.pages)
        {
            if (p.url == url)
                return p;
        }
        return null;
    }

    show(id, onDoned = null)
    {
        const p = this.get(id)
        if(onDoned)
            p.onShownOnce.push(onDoned);
        if (p)
            p.load();
    }

    current()
    {
        for (const p of this.pages)
        {
            if (p.visible())
                return p;
        }
        return null;
    }

    //to launch at the beginig of the JS code after the pages are created.
    updateFromURL()
    {
        for (const p of this.pages)
        {
            if (p.showIfOnTheGoodUrl())
                break;
        }
    }
}

class SitePage
{
    constructor(SitePages, url="", htmldata="")
    {
        this.sitePages = SitePages;
        this.url = url;
        this.id = url;
        // will be executed at the place of load/or show 
        this.func = null;
        this.htmldata = htmldata;
        this.onLoaded = [() => this.show()];
        this.onShown = [];
        this.onShownOnce = [];
        this.loaded = false;
        this.useHistory = true;
        this.scripts = ["js/" + this.url.replace(".html", ".js")];
        this.dom = null;

        this.setEvents();
    }

    setEvents()
    {
        window.addEventListener("popstate", () => 
            {
                if (history.state == this.id)
                    this.load(false, false, false);
            });
    }

    showIfOnTheGoodUrl()
    {
        const u = new URL(location.href);
        let id = u.pathname.split("/").last();
        if (id == "")
            id = "./"
        if (id == this.id)
        {
            this.load(false, false, false);
            return true;
        }
        return false;
    }

    pushHistory()
    {
        if (!this.useHistory)
            return;
        history.pushState(this.id, "", this.id);
    }

    load(force=false, background=false, _history=true)
    {
        if (!this.url)
        {
            if (!background)
                this.sitePages.onPageChange.exec(this);
            this.show();
            if (_history)
                this.pushHistory();
            return;
        }
        if (!background)
            this.sitePages.onPageChange.exec(this);
        if (!force && this.loaded)
        {
            this.show();
            if (_history)
                this.pushHistory();
            return;
        }

        scripts.import(FM + "/js/HttpRequest.js", () => 
            {
                DistFile.read(this.url, (xhr) => 
                    {
                        this.htmldata = xhr.responseText;
                        this.createDom();
                        scripts.import(this.scripts, () => 
                            {
                                this.onLoaded.exec();
                                this.sitePages.onPageLoaded.exec(this);
                                this.loaded = true;
                            });
                    }, false);
            });

        if (_history)
            this.pushHistory();
    }

    reload(){this.load(true);}

    // by default this method is in onLoaded event
    createDom()
    {
        if (!this.dom && this.htmldata)
        {
            this.dom = this.sitePages.dom.newNode("div", "page");
            this.dom.innerHTML = this.htmldata;
        }
    }
    show()
    {
        if (this.func)
        {
            this.func();
            return;
        }
        if (!this.htmldata)
        {
            testlog("no htmldata...");
            return;
        }

        for (const c of this.sitePages.dom.children)
            c.hide();

        this.dom.show();
        this.onShown.exec();
        this.onShownOnce.exec();
        this.onShownOnce = [];

        this.sitePages.onPageShown.exec(this);
    }

    visible()
    {
        if (!this.dom)
            return false;
        return this.dom.isVisible();
    }

    updateUiFromData()
    {
        if (this.dom)
            this.dom.innerHTML = this.htmldata;
    }
}
