class Conversation
{
    constructor(tchat, id="", parent=B)
    {
        this.tchat = tchat;
        this.id = id;
        this.onLoaded = [];
        this.loaded = false;
        this.parent = parent;
        this.sender = Tchat.me();
        this.sending = false;
        this.loadingMessages = false;
        this.load();
        this.first = true;
        this.loadingTxtWriter = false;
        this.messages = [];
    }

    setSenderName(name)
    {
        this.sender.name = name;
    }

    load()
    {
        const data = {};
        if (this.id)
            data["id"] = this.id;
        this.tchat.get("conversation", data, (res) => 
            {
                if (!res.success)
                    return;

                this.id = res.data.id;
                if (!this.name)
                    this.name = res.data.name;
                if (!this.name)
                    this.name = this.id;
                let contains = false;
                if (res.data.readed)
                {
                    for (const p of res.data.readed)
                    {
                        if (p.email == this.sender.email || p.id == this.sender.ip)
                        {
                            contains = true;
                            break;
                        }
                    }
                }
                if (!contains)
                    this.tchat.btn.showAlert();

                this.interface();
                this.loaded = true;
                for (const f of this.onLoaded)
                    f();
                this.onLoaded = [];

                if (!window._convs.includes(this))
                    window._convs.push(this);
                Tchat.addStreamId(this.id);
            });
    }

    // only used when the tchat is not created by a TchatButton
    loadMessages()
    {
        this.loadLastMessages();
    }

    interface()
    {
        if (this.div)
        {
            this.div.remove()
            this.div = null;
        }
        this.div = this.parent.newNode("div", "tchat");
        this.div.header = this.div.newNode("header");
        this.div.header.name = this.div.header.newTitle("div", this.name, "name");
        this.div.header.filter = this.div.header.newButton("<l></l><l></l><l></l>", () => this.showFilters(), "filters");
        this.div.header.big = this.div.header.newButton("", () => this.toggleBig(), "big");
        this.div.header.close = this.div.header.newButton("", () => this.tchat.btn.toggleConv(), "close");
        this.div.msgs = this.div.newNode("div", "msgs");
        this.div.msgs.msgs = this.div.msgs.newNode("div", "msgs-interior");
        this.loader = this.div.msgs.msgs.createLoader();
        this.loader.show();

        newCss(Tchat.FM + "/css/loader.css");
        this.div.msgs.infos = this.div.msgs.newNode("div", "infos");
        this.div.writerC = this.div.newNode("div", "writer-container");
        this.writerInterface();
        this.div.footer = this.div.newNode("footer");
        this.div.footer.btn = this.div.footer.newButton("Envoyer", () => this.send());
        if (this.mkbtn)
            this.div.hide();
        else 
        {
            this.tchat.btn.showConv();
            this.div.header.big.hide();
            this.hideCloseBtn();
        }

        this.setReadonly(this.tchat.readonly);
    }

    setReadonly(val=true)
    {
        if (!this.div)
            return;
        if (val)
        {
            this.div.writerC.hide();
            this.div.footer.hide();
        }
        else 
        {
            this.div.writerC.show();
            this.div.footer.show();
        }
    }

    removeLoader()
    {
        if (this.loader)
        {
            this.loader.remove();
            this.loader = null;
        }
    }

    addProfilImage(src)
    {
        this.div.header.img = this.div.header.newImg(src);
        this.div.header.img.classList.add("profil");
        this.div.header.img.moveToTop();
    }

    toggleBig()
    {
        if (this.div.classList.contains("big"))    
            this.div.classList.remove("big");
        else 
            this.div.classList.add("big");
    }

    addOnLoaded(func)
    {
        if (!this.loaded)
            this.onLoaded.push(func);
        else 
            func();
    }

    send()
    {
        if (this.tchat.disabled)
        {
            this.tchat.error("disabled");
            return;
        }
        if (this.writer.definitiveHtml() == "Votre texte..." || this.writer.definitiveHtml() == "" || this.writer.definitiveHtml().replaceAll("&nbsp;", "") == "")
            return;

        this.setSending(true);
        const data = {
            id : this.id,  // id of the conv !
            sender : this.sender,
            html : this.writer.definitiveHtml(),
            time : new Date().getTime(),
        }
        const m = this.newMessage(data, true);
        m.setSending(true);
        this.tchat.send("new-message", data, (res) => 
            {
                if (!res.success)
                {
                    this.report(Tchat.ERROR, "Le message, n'a pas pu être envoyé.") ;
                    this.setSending(false);
                }
                else 
                {
                    m.setId(res.message);
                    m.setSending(false);
                    this.setSending(false);
                    for (const f of this.tchat.toExecOnSend)
                        f(data.html, data.sender, this.id, res.message);
                }
            });
        this.writer.clear();
        this.writer.div.writer.focus();
        this.scrollMessagesDown();
    }

    setSending(val=true)
    {
        this.sending = val;
        if (val)
        {
            this.div.footer.btn.innerHTML = "";
            this.div.footer.btn.disabled = true;
            this.div.footer.btn.createLoader().show();
            this.writer.div.writer.contentEditable = false;
        }
        else 
        {
            this.div.footer.btn.innerHTML = "Envoyer";
            this.div.footer.btn.disabled = false;
            this.writer.div.writer.contentEditable = true;
        }
    }

    writerInterface()
    {
        if (this.loadingTxtWriter)
            return;
        this.loadingTxtWriter = true;
        importScripts([mkJs(Tchat.FM + "/js/txtWriter/TxtWriter.js")], () => 
            {
                TxtWriter.load(() => 
                    {
                        this.writer = new TxtWriter(this.div.writerC, TXT_WRITER_SMALL_VERSION);
                        this.setEvents();

                        this.writer.addOnUploadDoned((xhr) => 
                            {
                                for (const f of this.tchat.toExecOnFileUploaded)
                                    f(xhr);
                            })
                        this.loadingTxtWriter = false;
                    });
            });
    }

    report(type, msg)
    {
        if (type == Tchat.ERROR)
            this.div.msgs.infos.classList.add("error");
        else 
            this.div.msgs.infos.classList.remove("error");

        this.div.msgs.infos.innerHTML = msg;
        setTimeout(() => {this.div.msgs.infos.innerHTML = ""}, 10000);
    }

    loadLastMessages(scroll=true)
    {
        if (this.loadingMessages)
            return;

        this.loadingMessages = true;
        const data = {}
        const count = 10;
        if (this.messages.length == 0)
            data.number = count;
        else 
        {
            data.start = this.messages.length;
            data.end = this.messages.length + count;
        }
        this.tchat.get("messages", data, async (res) => 
            {
                await scripts.import(Tchat.JS_DIR + "/Message.js");
                this.removeLoader();
                if (res.data)
                {
                    for (const m of res.data)
                    {
                        if (!this.containMessage(m.id))
                            this.newMessage(m);
                    }

                    if(scroll)
                        setTimeout(() => this.scrollMessagesDown(), 100);

                    for (const f of this.tchat.toExecOnReceived)
                        f(res.data.last);

                }
                this.loadingMessages = false;
            });
    }

    scrollMessagesDown()
    {
        if (!this.div)
            return;
        if (c_navigator() == "firefox")
            this.div.msgs.msgs.scrollBy(0, this.div.msgs.msgs.scrollTopMax);
        else 
            this.div.msgs.msgs.scrollTo(0, 100000);
    }

    newMessage(data)
    {
        if (!data.sender)
            return null;

        const m = new Message(this, data);
        m.read(data);
        this.insertMessage(m)
        return m;
    }

    // this function should always be used to ass a new messages in this.messages and add its div.
    // because this ensure that the messages are correctly sorted.
    insertMessage(message)
    {
        let index = -1;
        if (this.messages.length == 0)
            index = 0;
        for (let i = 0; i < this.messages.length; i++)
        {
            if (i == 0 && message.data.time < this.messages[0].data.time)
            {
                index = i;
                break;
            }

            else if (i == this.messages.length - 1 && message.data.time >= this.messages[i].data.time)
            {
                index = this.messages.length;
                break;
            }

            else if(message.data.time>= this.messages[i].data.time && message.data.time <= this.messages[i+1].data.time)
            {
                index = i;
                break;
            }
        }


        if (index == -1)
            throw "Could not find index for the message : " + message.data.html;

        if (index == 0)
            this.div.msgs.msgs.prepend(message.div);
        else if (index>=this.messages.length)
            this.div.msgs.msgs.appendChild(message.div);
        else
            this.div.msgs.msgs.insertBefore(message.div, this.div.msgs.msgs.children[index + 1]);
        this.messages.splice(index, 0, message);
    }

    findMessage(id)
    {
        for (const m of this.messages)
        {
            if (m.id == id)
                return m;
        }
        return null;
    }

    containMessage(id)
    {
        if (this.findMessage(id))
            return true;
        return false;
    }

    removeMessage(id)
    {
        for (const m of this.messages)
        {
            if (m.id == id)
            {
                m.div.remove();
                this.messages.remove(m);
                return;
            }
        }
    }

    reactToSSE(event, data)
    {
        if (event == "new-message")
            this.newMessageFromSSE(data["message"]);
        else if (event == "message-deleted")
            this.deleteMessageFromSSE(data["deleted-id"]);
        else if (event == "message-modified")
            this.modifyMessageFromSSE(data["message"]);
        else if (event == "message-liked")
            this.likeMessageFromSSE(data["message-id"], data["person"]);
    }

    newMessageFromSSE(msg_data)
    {
        if (this.contains(msg_data.id))
        {
            return;
        }
        if (this.sending)
        {
            setTimeout(() => this.newMessageFromSSE(msg_data), 1000);
            return;
        }
        const m = this.newMessage(msg_data);
        this.scrollMessagesDown();

        if (!m.div.classList.contains("me"))
            this.tchat.sounds.play(Tchat.FM + "/sounds/new-message.ogg"); // need to make the sym link in local for mlt tool !

        if (!this.div.isVisible())
            this.tchat.btn.showAlert();
        else 
        {
            const data = {
                "person" : Tchat.me(),
            };
            this.tchat.send("set-readed", data);
        }
        for (const f of this.tchat.toExecOnReceived)
            f(msg_data);
    }

    deleteMessageFromSSE(msg_id)
    {
        this.removeMessage(msg_id);
    }

    modifyMessageFromSSE(msg_data)
    {
        const m = this.messageById(msg_data.id);
        if (m)
            m.setContent(msg_data.html);
    }

    likeMessageFromSSE(msg_id, person)
    {
        const m = this.messageById(msg_id);
        if (m)
            m.addALike(person);
    }

    messageById(id)
    {
        for (const m of this.messages)
        {
            if (m.data.id == id)
                return m;
        }
        return null;
    }

    contains(id)
    {
        if (this.messageById(id))
            return true;
        return false;
    }

    setEvents()
    {
        this.writer.div.writer.addEventListener("keydown", (e) => 
            {
                if (e.key == "Enter" && e.ctrlKey)
                {
                    e.preventDefault();
                    this.send();
                }
            })

        this.div.msgs.msgs.addEventListener("scroll", () => 
            {
                if (this.div.msgs.msgs.scrollTop <= 0)
                    this.loadLastMessages(false);
            })
    }

    setName(name)
    {
        if (name == this.name)
            return;
        this.name = name;
        if (this.div)
            this.div.header.name.innerHTML = this.name;
    }

    showFilters()
    {
        const filter = this.div.newNode("div", "filters-ctn");
        filter.newButton("Sort by date", () => this.sortByDate(filter));
        filter.newButton("Sort by likes", () => this.sortByLikes(filter));
        filter.newButton("Sort by length", () => this.sortByLength(filter));

        filter.style.transform = "translate(" + mouseScreenX + "px," + mouseScreenY + "px)";
        B.addEventListener("click", (e) => 
            {
                if (e.target == filter || filter.contains(e.target) || e.target.classList.contains("filters"))
                    return;
                filter.remove();
            });
    }

    sortByDate(menu)
    {
        menu.remove();
    }

    sortByLikes(menu)
    {
        menu.remove();
        return; // TODO implement
        const data = {
            "order" : "likes",
        };
        this.tchat.request("sorted-messages", data, (res) => 
            {
                this.div.msgs.msgs.innerHTML = "";
                if (res.success)
                {
                    for (const m of res.data)
                        this.newMessage(m);
                }
                else 
                    this.report(Tchat.ERROR, res.message);
            });
        this.div.msgs.msgs.innerHTML = "";
        this.messages = [];
        this.div.msgs.msgs.createLoader().show();
    }

    sortByLength(menu)
    {
        menu.remove();
        return; // TODO implement
        const data = {
            "order" : "contents",
        };
        this.tchat.get("sorted-messages", data, (res) => 
            {
                this.div.msgs.msgs.innerHTML = "";
                if (res.success)
                {
                    for (const m of res.data)
                        this.newMessage(m);
                }
                else 
                    this.report(Tchat.ERROR, res.message);
            });
        this.div.msgs.msgs.innerHTML = "";
        this.messages = [];
        this.div.msgs.msgs.createLoader().show();
    }

    hideCloseBtn()
    {
        if (this.div)
            this.div.header.close.hide();
    }
}
