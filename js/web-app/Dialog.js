class Dialog
{
    constructor()
    {
        this.div = null;
        this.mask = null;
        this.title = "";
        this.events = new Events();
        this._main = D.createElement("main");
    }

    // override this is in child class for custom drawing
    draw()
    {
        this.div = B.newNode("div", "dialog");
        this.mask = B.newNode("div", "mask");
        this.div.header = this.div.newNode("div", "header");
        this.div.header.titre = this.div.header.newNode("div", "titre");
        this.div.header.titre.innerHTML = this.title;
        this.div.header.close = this.div.header.newButton("x", () => this.hide());

        // this is the node you use as a user
        this.div.main = this._main;
        this.div.appendChild(this.div.main);

        this.div.footer = this.div.newNode("div", "footer");
        this.div.footer.cancel = this.div.footer.newButton("Cancel", () => this.cancel());
        this.div.footer.valid = this.div.footer.newButton("OK", () => this.valid());
    }

    show()
    {
        if (!this.div)
            this.draw();
        this.div.show();
        this.mask.show();
        this.events.emit("shown", this);
    }

    hide()
    {
        if (!this.div)
            return
        this.div. hide();
        this.mask.hide();
        this.events.emit("hidden", this);
    }

    remove()
    {
        if (this.div)
            this.div.remove();
        if (this.mask)
            this.mask.remove();
        this.events.emit("removed", this);
    }

    cancel()
    {
        this.hide();
        this.events.emit("canceled", this);
    }

    valid()
    {
        this.hide();
        this.events.emit("valided", this);
    }

    add(domelmt)
    {
        let elmt = domelmt;
        if (typeof (domelmt) == "string")
        {
            elmt = D.createElement("div");
            elmt.innerHTML = domelmt;
        }
        try
        {
            this.main().appendChild(elmt);
        }
        catch (e)
        {

        }
    }

    main()
    {
        if (!this.div)
            return this._main;
        return this.div.main;
    }

    setTitle(title)
    {
        if (this.div)
        {
            this.div.header.titre.innerHTML = title;
            this.events.emit("title-changed", title);
        }
        else 
        {
            this.title = title;
        }
    }
}
