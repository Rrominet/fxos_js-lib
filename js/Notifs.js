//old : this should be updated.


if (!self.notifs_path)
    self.notifs_path = "global";
class Notif
{
    constructor(html, title, redirect, cta="", img="", footer="", type="notif")
    {
        this.data = {};
        this.data.html = html;
        this.data.title = title;
        this.data.redirect = redirect;
        this.data.cta = cta;
        this.data.img = img;
        this.data.footer = footer;
        this.data.adddata = "";
        this.user = "";
        this.data.user="";
        this.data.type = type;

        this.onClick = [];
        this.onError = [];
        this.onShow = [];
        this.onClose = [];

        this.onClose.push(() => this.read(this.user));
        this.onClick.push(() => this.read(this.user));
    }

    static fromData(data)
    {
        const n = new Notif;
        n.data = data;
        n.data.html = n.data.html.replaceAll("*prenom*", prenom());

        if (data.redirect)
            n.onClick.push(() => window.open(data.redirect));
        return n;
    }

    send(to, from, onSended=null, onError=null, options={email : true, browser : true})
    {
        this.data.adddata = options;
        Notifs._send(to, from, this, onSended, onError, options);
    }

    read(user, onReaded=null)
    {
        Notifs.read(user, this.data.id, onReaded);
    }
}
class Notifs
{
    static permissions()
    {
        return new Promise((resolve) => 
            {
                if (!("Notification" in self))
                    resolve(false);
                else if (Notification.permission == "granted")
                    resolve(true);
                else if (Notification.permission != "denied")
                {
                    Notification.requestPermission().then((perm) => 
                        {
                            if (perm == "granted")
                                resolve(true);
                            else 
                                resolve(false);
                        });
                    setTimeout(() => 
                        {
                            if (Notification.permission == "granted")
                                resolve(true);
                            else 
                                resolve (false);
                        }, 30000);
                }
                else 
                    resolve (false);
            });
    }

    static subscribe(user, onDoned=null, onError=null)
    {
        Notifs.permissions().then((val) =>
            {
                if (!val)
                {
                    if (onError)
                        onError();
                }

                navigator.serviceWorker.register("/worker_notifs.js").then((reg) => 
                    {
                        navigator.serviceWorker.ready.then((reg) => 
                            {
                                testlog("Service worker ready !"); 
                                testlog(reg);
                                reg.active.postMessage(user);
                            });
                    });
            });
    }

    static create(html, title, icon="", onclick=null, onclose=null, onshow=null, onerror=null, data=null)
    {
        const options = 
            {
                body : html, 
                icon : icon, 
                data : data,
            };
        return new Promise((resolve) => 
            {
                Notifs.permissions().then((val) => 
                    {
                        if (val)
                        {
                            options.body = self.htmltotext(html);
                            if (self.document)
                            {
                                const n = new Notification(title, options);
                                if (onclick)
                                    n.onclick = onclick;
                                if (onclose)
                                    n.onclose = onclose;
                                if (onshow)
                                    n.onshow = onshow;
                                if (onerror)
                                    n.onerror = onerror;
                                resolve(n);
                            }
                            else 
                            {
//                                 if (onclick)
//                                     addEventListener("notificationclick", onclick);
//                                 if (onclose)
//                                     addEventListener("notificationclose", onclose);
                                self.registration.showNotification(title, options);
                            }
                        }
                        else if (self.document) 
                        {
                            const n = B.newNode("div", "notif");
                            n.newTitle("h2", title);
                            if (icon)
                                n.newImg(icon);
                            const p = n.newTitle("p");
                            p.innerHTML = html;
                            n.footer = n.newNode("footer");
                            n.footer.newButton("Voir", () => 
                                {
                                    if (onclick)
                                        onclick();
                                    n.remove();
                                });
                            n.footer.newButton("Ignorer", () => 
                                {
                                    if (onclose)
                                        onclose();
                                    n.remove();
                                });
                            newCss(FM + "/css/notifs.css");

                            setTimeout(() => n.remove(), 30000);
                            if (onshow)
                                onshow();
                            resolve (n);
                        }
                    })
            })
    }

    static createNotif(notif)
    {
        const execList = (list) => 
        {
            if (!list)
                return;
            for (const l of list)
                l();
        }

        const onclick = () => execList(notif.onClick);
        const onerror = () => execList(notif.onError);
        const onshow = () => execList(notif.onShow);
        const onclose = () => execList(notif.onClose);

        return Notifs.create(notif.data.html, notif.data.title, notif.data.img, onclick, onclose, onshow, onerror, notif.data);
    }

    //data is a json
    //onRes take the raw responseText
    static request(data, onRes=null)
    {
        data.path = self.notifs_path;
        fetch(FM + "/bin/notifications-server.cgi", {
            method : "POST",
            cache : "no-cache",
            body : JSON.stringify(data),
        }).then((response) => response.text()).then((text) => 
            {
                if (onRes)
                    onRes(text);
            });
    }

    static setPath(path)
    {
        self.notifs_path = path;
    }

    static get(user, onlyIds=false, onGetted, stream=false)
    {
        if (typeof(onlyIds) == "function")
        {
            onGetted = onlyIds;
            onlyIds = false;
        }

        const data = {};
        if (user.includes("@"))
            user = user.replaceAll("@", "_a_");
        data.user = user;
        data.cmd = "get";
        data.onlyIds = onlyIds;
        if (!stream)
            Notifs.request(data, onGetted);
        else 
        {
            data.mode = "stream";
            data.path = self.notifs_path;
            return request.stream(FM + "/bin/notifications-server.cgi", data, onGetted);
        }
    }

    static getNotif(id, onGetted=null)
    {
        const data = {}
        data.notifId = id;
        data.cmd = "get-notif"
        Notifs.request(data, onGetted);
    }

    //onCreated will be executes for each notif created.
    static createNotifs(ids, user, onCreated=null)
    {
        if (typeof(ids) == "string")
            ids = [ids];
        for (let i=0; i<5; i++)
        {
            if (ids.length<=i)
                break;
            
            Notifs.getNotif(ids[i], (res) => 
                {
                    const n = Notif.fromData(JSON.parse(res));
                    n.user = user;
                    n.data.user = user;
                    this.createNotif(n, onCreated);
                })
        }
    }

    //onCreated will be executed for each notif created.
    static showNotReadedNotifs(user, onCreated=null)
    {
        Notifs.get(user, true, (data) => Notifs.createNotifs(JSON.parse(data)["non-readed"], user, onCreated));
    }

    // options can make the comportement of the notif change
    // for example : email : false will not send any email
    // other example : brower : false will not fire any browser notification
    static _send(users, from, notif, onSended=null, onError=null)
    {
        if (typeof(users) == "string" && users != "everyone") 
            users = [users];

        Notifs.request({
            cmd : "send",
            to : users,
            notif : notif.data,
            from : from,
        }, (res) => 
            {
                if (res.includes("true"))
                {
                    if (onSended)
                        onSended();
                }
                else 
                {
                    if (onError)
                        onError();
                }
            });
    }

    static read(user, notifId, onReaded=null)
    {
        if (!notifId)
        {
            testlog("Error, notifId is empty : " + notifId);
            return;
        }
        Notifs.request({
            cmd : "read",
            notifId : notifId,
            to : user
        }, (res) => 
            {
                if (onReaded)
                    onReaded();
            });
    }
}

