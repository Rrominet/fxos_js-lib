class SiteMenu
{
    static get REAL_LINKS(){return 1;}
    static get FUNCS(){return 2;}
    constructor(mode=SiteMenu.REAL_LINKS, parent=B)
    {
        this.mode = mode;
        this.closed = false;
        this.parent = B;
        this.links = [];
        this.onPhoneResize = [() => 
            {
                this.dom.classList.add("phone");
                this.createPhoneMenuElmts();
                this.placePhoneMenu();
            }];
        this.onComputerResize = [() => 
            {
                this.dom.classList.remove("phone");
                this.removePhoneMenuElmts();
                this.dom.style.transform = "translateX(0)";
            }];
        this.draw();
    }

    draw()
    {
        this.dom = this.parent.newNode("menu");
        this.dom.moveToTop();
        this.setEvents();
        this.onResize();
    }

    //txt could be HTML
    //if blank, the link will open in a new window
    addLink(txt, link, classList="", blank=false)
    {
        const lk = new SiteMenuLink(this, txt, link, classList, blank);
        this.links.push(lk);
        return lk;
    }

    setEvents()
    {
        addEventListener("resize", () => this.onResize());
        addEventListener("load", () => this.onResize());
    }

    onResize()
    {
        if (isPhone())
            this.onPhoneResize.exec(innerWidth);
        else 
            this.onComputerResize.exec(innerWidth);
    }

    createPhoneMenuElmts()
    {
        if (this.dom.openButton || this.dom.closeBtn)
            return;
        this.dom.openButton = this.dom.prependNode("button");
        this.dom.openButton.innerHTML = ">";
        this.dom.openButton.classList.add("open");
        this.dom.openButton.addEventListener("click", () => this.open())
        this.dom.closeBtn = this.dom.prependNode("button");
        this.dom.closeBtn.innerHTML = "X";
        this.dom.closeBtn.classList.add("close");
        this.dom.closeBtn.addEventListener("click", () => this.close());
    }

    close()
    {
        if (!this.dom.openButton || !this.dom.closeBtn)
            return;
        this.closed = true;
        this.placeClosedPhoneMenu();
    }

    open()
    {
        if (!this.dom.openButton || !this.dom.closeBtn)
            return;
        this.closed = false;
        this.dom.style.transform = "translateX(0px)";
    }

    removePhoneMenuElmts()
    {
        if (this.dom.openButton)
        {
            this.dom.openButton.click();
            this.dom.openButton.remove()
            this.dom.openButton = null;
        }

        if (this.dom.closeBtn)
        {
            this.dom.closeBtn.remove()
            this.dom.closeBtn = null;
        }
        this.closed = false;
    }

    placeClosedPhoneMenu()
    {
        this.dom.style.transform = "translateX(-" + ( innerWidth + 2 ) + "px)";
    }

    placePhoneMenu()
    {
        if (this.closed)
            this.placeClosedPhoneMenu();
        else 
            this.dom.style.transform = "translateX(0px)";
    }
}

class SiteMenuLink
{
    constructor(SiteMenu, txt, link, classList,  blank=false)
    {
        this.menu = SiteMenu;
        this.txt = txt;
        this.link = link;
        this.blank = blank;
        this.classList = classList;
        this.onClick = [() => this.setActive(), () => this.menu.close()];
        this.draw();
    }

    setActive()
    {
        for (const l of this.menu.links)
            l.a.classList.remove("active");
        this.a.classList.add("active");
    }

    draw()
    {
        this.a = this.menu.dom.addA(this.txt, this.link, this.classList);
        if (this.blank)
            this.a.setAttribute("target", "_blank");

        if (this.menu.mode == SiteMenu.FUNCS)
        {
            this.a.addEventListener("click", (e) => 
                {
                    e.preventDefault();
                    this.onClick.exec(e);
                });

        }
    }
}
