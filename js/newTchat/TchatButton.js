class TchatButton
{
    constructor(Tchat, movable=false) 
    {
        this.tchat = Tchat;
        this.x = 50;
        this.y = 250;
        this.conv = this.tchat.conversation;
        this.movable = movable;

        this.conv.addOnLoaded(() => this.interface());
    }

    interface()
    {
        const d = D.createElement("div");
        d.appendChild(Icons.byName("comment-black-oval-bubble-shape"));
        d.newTitle("span", this.conv.name);
        this.btn = this.elmt = B.newButton(d, null, "tchat-button");
        this.btn.alert = this.btn.newNode("div", ["alert", "hidden"]);
        this.btn.alert.innerHTML = "!";

        this.setEvents();

        if (!this.tchat.showButton)
            this.btn.hide();
        if (this.movable)
            return;
    }

    setEvents()
    {
        if (!this.movable) 
        {
            this.btn.addEventListener("click", () => 
                {
                    for (const f of this.tchat.toExecOnButton)
                        f();
                    this.toggleConv();
                })
            return;
        }
        
        scripts.import(FM + "/js/windows-manager/windows-utils.js").then(() => 
            {
                this.btn.setDraggable(this.x, this.y);
                this.btn.onClicked.push(() => 
                    {
                        for (const f of this.tchat.toExecOnButton)
                            f();

                        this.toggleConv();
                    })

                this.btn.addEventListener("contextmenu", (e) => 
                    {
                        e.preventDefault();
                        this.btn.hide();
                    })
            })
    }

    toggleConv()
    {
        if (this.conv.div.isVisible())
        {
            this.conv.div.hide();
            this.elmt.classList.remove("active");
            this.tchat._onHideConv.exec();
        }
        else 
            this.showConv();
    }

    showConv()
    {
        if (this.conv.div.isVisible())
            return;
        this.conv.div.show();
        this.conv.div.style.animation="show-tchat 0.3s";
        this.elmt.classList.add("active");
        if (this.conv.first)
            this.conv.div.msgs.msgs.scrollBy(0, 10000000000);
        this.conv.first = false;

        const data = {
            "person" : Tchat.me(),
        }
        this.tchat.send("set-readed", data);
        this.hideAlert();
        this.tchat._onShowConv.exec();
    }

    showAlert()
    {
        if (this.btn)
            this.btn.alert.classList.remove("hidden");
    }

    hideAlert()
    {
        if (this.btn)
            this.btn.alert.classList.add("hidden");
    }

    show()
    {
        if (this.btn)
            this.btn.show();
    }

    hide()
    {
        if (this.btn)
            this.btn.hide();
    }

    w()
    {
        if (!this.btn)
            return 0;
        return this.btn.w();
    }

    h()
    {
        if (!this.btn)
            return 0;
        return this.btn.h();
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
        if (this.btn)
        {
            this.btn.style.left = x + "px";
            this.btn.style.top = y + "px";
        }
    }
}
