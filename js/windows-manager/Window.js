class mlWindow
{
    constructor(wm,
        title, 
        content=null,
        draggable = false )
    {
        if (!wm)
        {
            window.WM = new WindowsManager;
            this.wm = window.WM;
        }
        else 
            this.wm=wm; 
        this.parent = this.wm.target;
        this.x = 0; 
        this.y = 0;
        this.w = 0; 
        this.h = 0;
        this.maskDiv = null;

        // list of functions executed when resized.
        this.onResize = [];
        this.scaling = false;
        this.deleteOnClose = false;
        this.toExecOnClose = [];
        if (innerWidth<600)
            this.draggable = false;
        else 
            this.draggable = draggable;
        this.dragged = false;
        this.setInterface(title, content);
        this.setEvents();
        this.hide();
    }

    setInterface(title, content=null)
    {
        if (innerWidth<600)
        {
            this.mask();
            this.div = this.parent.newNode("div", "window");
        }
        else 
            this.div = this.parent.prependNode("div", "window");
        if (this.draggable)
        {
            this.div.classList.add("draggable");
            this.div.scale = this.div.newNode("div", "scale");
            this.setSize(640, 540);
        }
        this.div.header = this.div.newNode("div", "header");
        this.div.header.titre = this.div.header.newNode("div", "title");
        this.div.header.close = this.div.header.newButton("", () => this.close(), "close");
        this.setTitle(title);
        this.content = this.div.newNode("div", "content");
        this.setContent(content);
        if (!this.draggable)
        {
            let w = 50; 
            if (innerWidth<840)
                w = 100;
            this.setScreenWidth(w);
        }
    }

    fix()
    {
        this.div.style.position = "fixed";
        this.div.style.top = "0";
        this.div.style.left = "0";
        this.div.style.maxHeight = "95%"; 
        this.div.style.overflow = "auto";
    }

    unfix()
    {
        this.div.style.position = "absolute";
        this.div.style.maxHeight = "initial"; 
    }

    close()
    {
        this.hide();
        if (this.deleteOnClose)
        {
            this.div.remove();
            if (this.maskDiv)
            {
                this.maskDiv.remove();
                this.maskDiv = null;
            }
        }
    }

    setFooter(content)
    {
        this.footer().innerHTML = "";
        this.setElmt(content, this.div.footer);
    }

    footer()
    {
        if (!this.div.footer)
            this.div.footer = this.div.newNode("div", "footer");

        return this.div.footer;
    }

    setElmt(content, elmt)
    {
        if (!content)
            return;
        if (typeof(content) == "object")
            elmt.appendChild(content);
        else 
            elmt.innerHTML = content;
    }

    setContent(content)
    {
        this.content.innerHTML = "";
        this.setElmt(content, this.content);
    }

    // return the first child of this.content
    // useful when you want to elmt create with setContent
    getContent()
    {
        return this.content.children[0];
    }

    setTitle(title)
    {
        this.setElmt(title, this.div.header.titre);
    }

    title()
    {
        return this.div.header.titre.innerHTML;
    }

    focus()
    {
        this.setFocused(true);
    }

    setFocused(bool)
    {
        if (bool)
        {
            for (const w of this.wm.windows)
                w.setFocused(false);
            this.div.classList.add("focus")
        }
        else 
            this.div.classList.remove("focus")
    }

    isFocused()
    {
        return this.div.classList.contains("focus");
    }

    setEvents()
    {
        this.div.addEventListener("mousedown", () => this.setFocused(true))
        addEventListener("resize", () => this.onDocumentResize());
        addEventListener("DOMContentLoaded", () => this.onDocumentResize());
        addEventListener("load", () => this.onDocumentResize());
        if (this.draggable)
        {
            this.div.header.addEventListener("mousedown", () => this.drag(true));
            this.div.header.addEventListener("mouseup", () => this.drag(false));
            this.div.scale.addEventListener("mousedown", () => this.scaling = true);
            this.div.scale.addEventListener("mouseup", () => this.scaling = false);
        }
    }

    drag(bool)
    {
        this.dragged = bool;
        this.wm.dragging = bool;
        if (this.dragged)
            this.div.classList.add("dragged");
        else 
            this.div.classList.remove("dragged");
    }

    show()
    {
        this.div.show();
        this.setFocused(true);
        this.onShow();
    }

    showWithAnimation()
    {
        this.show();
        this.div.style.animation = "popup-show 0.5s";
    }

    hide()
    {
        this.onHide();
        for (const f of this.toExecOnClose)
            f();
        this.div.hide();
        if (this.maskDiv)
            this.maskDiv.hide();
        this.setFocused(false);
    }

    move(x, y)
    {
        if (!this.draggable)
            return;
        this.x += x; 
        this.y += y;

        this.div.style.marginLeft = this.x + "px";
        this.div.style.marginTop = this.y + "px";
    }

    setPosition(x, y)
    {
        this.x = x; 
        this.y = y;

        this.div.style.marginLeft = this.x + "px";
        this.div.style.marginTop = this.y + "px";
    }

    setWidth(w)
    {
        if (!this.draggable)
            return;
        this.w = w;
        this.div.style.width = w + "px";
        this.div.scale.style.marginLeft = (w - 12) + "px";
    }

    setHeight(h)
    {
        if (!this.draggable)
            return;
        this.h = h;
        this.div.style.height = h + "px";
        this.div.scale.style.marginTop = (h - 12) + "px";
    }

    setSize(w, h)
    {
        if (!this.draggable)
            return;
        this.setWidth(w);
        this.setHeight(h);

        this.onResize.execs();
    }

    addSize(w, h)
    {
        if (!this.draggable)
            return;
        this.w += w; 
        this.h += h; 
        this.setSize(this.w, this.h);
    }

    resizeAtContent()
    {
        this.div.style.width = "initial";
        this.div.style.height = "initial";
    }

    width()
    {
        return this.div.w();
    }

    height()
    {
        return this.div.h();
    }

    size()
    {
        return {
            w : this.width(),
            h : this.height(),
        };
    }

    remove()
    {
        this.onRemove();
        this.div.remove();
        this.wm.windows.remove(this);
    }

    // to reimplement
    onHide()
    {
    }

    // to reimplement
    onRemove()
    {
    }

    // to reimplement
    onShow()
    {
        if (this.maskDiv)
            this.maskDiv.show();
    }

    //to reimplement
    onKey(e)
    {
        if (D.activeElement && D.activeElement.isEditable())
            return;
        if (e.ctrlKey && e.key == "h")
        {
            e.preventDefault();
            this.close();
        }
    }

    mask(bool=true)
    {
        if (bool)
        {
            if (!this.maskDiv)
                this.maskDiv = this.parent.newNode("div", "mask");
        }

        else
        {
            if (this.maskDiv)
                this.maskDiv.remove();
        }
    }

    // val is the percentage of the screen you want to use
    setScreenWidth(val, padding = "2em")
    {
        this.screenWidth = val;
        this.padding = padding;
        const w = "calc(" + val + "% - " + padding + ")";
        this.div.style.width = w;
    }

    fixed()
    {
        return this.div.style.position == "fixed";
    }

    center()
    {
        if (isPhone())
            return;
        this.needCenter = true;
        let w = 0; 
        let h = 0;

        if (this.fixed)
        {
            w = innerWidth; 
            h = innerHeight;
        }

        else 
        {
            w = this.wm.target.w(); 
            h = this.wm.target.h(); 
        }
        this.setPosition((w - this.div.w())/2.0, (h - this.div.h())/2.0);
    }

    onDocumentResize()
    {
        let w = this.screenWidth;
        if (!this.screenWidth)
            return;
        if (innerWidth<=840 && this.screenWidth<95)
            w = 95;
        else if (innerWidth<=1270 && this.screenWidth<70)
            w = 75;
        this.div.style.width =  "calc(" + w + "% - " + this.padding + ")";
        if (this.needCenter && !this.draggable)
            this.center();
        return w;
    }

    setSizeFromContent()
    {
        if (this.draggable)
        {
            let h = this.content.h();
            h += this.div.header.h() + parseFloat(getComputedStyle(this.div.header).fontSize);
            this.setSize(this.content.w(), h);
        }
    }

    addOnClose(f)
    {
        this.toExecOnClose.push(f)
    }

    classes(){return this.div.classList;}
    classList(){return this.div.classList;}
    cssClasses(){return this.div.classList;}

}

