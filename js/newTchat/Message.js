class Message
{
    constructor(Conversation)
    {
        this.conv = Conversation;
        this.tchat = this.conv.tchat;
        this.editing = false;
        this.enventsSetted = false;
        this.interface();
    }

    interface()
    {
        this.div = D.createElement("div");
        this.div.classList.add("msg");

        this.div.header = this.div.newNode("header") ;
        this.div.header.name = this.div.header.newNode("span", "name");
        this.div.header.inter = this.div.header.newTitle("span", "le");
        this.div.header.inter.style.marginLeft = "0.25em";
        this.div.header.inter.style.marginRight = "0.25em";
        this.div.header.time = this.div.header.newNode("span", "time");

        this.div.content = this.div.newNode("main");
        
        this.div.footer = this.div.newNode("footer");

        const f = () => 
        {
            if (typeof(Icons) == "undefined")
            {
                setTimeout(f, 16);
                return;
            }
            if (this.div.classList.contains("me"))
            {
                this.div.footer.modify = this.div.footer.newButton(Icons.byName("font-selection-editor"), () => this.modify());
                this.div.footer.remove = this.div.footer.newButton(Icons.byName("trash"), () => this.remove())
            }
            this.div.footer.like = this.div.footer.newButton(Icons.byName("heart-shape-silhouette"), () => this.like())
        }
        setTimeout(f, 16);

    }

    setId(id)
    {
        this.data.id = id;
        this.div.id = id;
    }

    setSending(val=true)
    {
        if (val)
            this.div.classList.add("sending");
        else
            this.div.classList.remove("sending");
    }

    sending()
    {
        return this.div.classList.contains("sending");
    }

    setEvents()
    {
        if(this.enventsSetted)
            return;
        this.enventsSetted = true;
        this.div.addEventListener("mouseenter", () => this.showFooter());
        this.div.addEventListener("mouseleave", () => this.hideFooter());

        this.div.main.addEventListener("keydown", (e) => 
            {
                if (e.key == "Enter" && e.ctrlKey)
                    this.modify();
            });

        this.div.main.addEventListener("contextmenu", (e) => 
            {
                if (this.tchat.onMsgRightClick.length == 0)
                    return;
                e.preventDefault();
                for (const f of this.tchat.onMsgRightClick)
                    f(this, e);
            });
    }

    read(data)
    {
        if (this.data && (data.time == this.data.time && data.html == this.data.html))
            return;
        this.data = data;
        this.id = data.id; 
        if (this.div)
            this.div.id = data.id;
        if (data.sender.name)
            this.div.header.name.innerHTML = data.sender.name
        else if (data.sender.email)
            this.div.header.name.innerHTML = data.sender.email
        else 
            this.div.header.name.innerHTML = data.sender.ip

        if (data.time.toString().length <=10 )
            data.time = data.time * 1000;
        this.div.header.time.innerHTML = Date.readableFromSeconds(data.time/1000);

        this.div.content.innerHTML = this.clean(data.html);
        for (const i of this.div.content.querySelectorAll("img"))
        {
            i.classList.add("clickable");
            i.addEventListener("click", () => i.requestFullscreen());
        }
        this.div.main = this.div.content;

        if (this.data.sender.email == email() || this.data.sender.ip == ip())
            this.div.classList.add("me");
        
        const f = () => 
        {
            if (typeof(Icons) == "undefined")
            {
                setTimeout(f, 16);
                return;
            }
            this.div.end = this.div.newNode("div", "end");
            this.div.end.appendChild(Icons.byName("heart-shape-silhouette"))
            if (this.data.likes && this.data.likes.length)
                this.div.end.likes = this.div.end.newTitle("span", this.data.likes.length);
            else 
            {
                this.div.end.likes = this.div.end.newTitle("span", 0);
                this.div.end.hide();
            }
        }

        setTimeout(f, 16);
        this.setEvents();
    }

    clean(html)
    {
        html = html.replaceAll("\n", "");
        while (html.substring(html.length-6) == "&nbsp;")
            html = html.substring(0, html.length - 6);
        while (html.substring(html.length-4) == "<br>")
            html = html.substring(0, html.length - 4);
        if (html.substring(0, 6) == "&nbsp;")
            html = html.substring(6);
        if (html.substring(0, 4) == "<br>")
            html = html.substring(4);
        return html;
    }

    email(){return this.data.sender.email;}

    showFooter()
    {
        this.div.footer.style.opacity = 1;
        this.div.footer.style.pointerEvents = "initial";
    }

    updateLikes()
    {
        if (this.data.likes)
            this.div.end.show();
        this.div.end.likes.innerHTML = this.data.likes.length;
    }

    hideFooter()
    {
        if (this.editing)
            return;
        this.div.footer.style.opacity = 0;
        this.div.footer.style.pointerEvents = "none"
    }

    setEditing(val)
    {
        this.editing = val;
        this.div.main.contentEditable = val;
        if (val)
        {
            this.div.footer.remove.hide();
            this.div.main.focus();
            this.div.footer.classList.add("editing");
        }
        else 
        {
            this.div.footer.remove.show();
            this.div.main.blur();
            this.div.footer.classList.remove("editing");
        }
    }

    modify()
    {
        if (!this.editing)        
            this.setEditing(true);

        else 
        {
            this.setEditing(false);
            const data = {
                "id" : this.conv.id,
                "msg-id" : this.data.id,
                "html" : this.div.main.innerHTML,
                "time" : new Date().getTime(),
                "sender" : Tchat.me(),
            };
            this.tchat.send("modify-message", data, (res) => 
                {
                    if (res.success)
                    {
                        this.data.html = this.div.main.innerHTML;
                        this.div.classList.remove("deleting");
                    }
                    else 
                    {
                        this.div.main.innerHTML = this.data.html;                        
                        this.conv.report(Tchat.ERROR, res.message);
                    }
                });
            this.div.classList.add("deleting");
        }
    }

    remove()
    {
        const data = {
            "id" : this.conv.id,
            "msg-id" : this.data.id,
            "sender" : Tchat.me(),
        };
        this.tchat.send("delete-message", data, (res) => 
            {
                if (res.success)
                {
                    this.div.remove();
                    this.conv.messages.remove(this);
                }
                else 
                {
                    this.conv.report(Tchat.ERROR, "Impossible de supprimer le message...");
                    this.div.classList.remove("deleting");
                }
            })

        this.div.classList.add("deleting");
    }

    like()
    {
        const data = {
            "id" : this.conv.id,
            "msg-id" : this.data.id,
            "person" : Tchat.me(),
        };

        this.tchat.send("like", data, (res) => 
            {
                if (res.success)
                    this.addALike(Tchat.me());
                else 
                    this.conv.report(Tchat.ERROR, res.message);
            })
    }

    alreadyLike(person)
    {
        for (const l of this.data.likes)
        {
            if (l.email == person.email || l.ip == person.ip)
                return true;
        }
        return false;
    }

    addALike(person)
    {
        if (!this.data.likes)
            this.data.likes = [];
        if (this.alreadyLike(person))
            return;
        this.data.likes.push(person);
        this.updateLikes();
    }

    setContent(html)
    {
        this.div.main.innerHTML = html;
    }
}
