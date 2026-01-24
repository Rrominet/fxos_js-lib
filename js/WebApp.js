// careful, when you create a new WebApp object, it will be a singleton in window.app
// if you create a second one, you will have an error.
//You only can have one app.
// Do not use the constructor of WebApp directly or the constructor of your child ClassName
// use the static function create(Class) that will take the class of your Child class from WebApp 
// It will unsure that the auth system is loaded as expected before the webapp itself.
    //
class WebApp
{
    static scriptsToLoad()
    {
            return [FM + "/js/web-app/Menu.js", FM + "/js/Events.js", FM + "/js/web-app/Dialog.js", FM + "/js/web-app/Page.js", FM + "/js/HttpRequest.js"];
    }

    static async load(onDoned)
    {
        await scripts.import(WebApp.scriptsToLoad(), onDoned);
    }

    constructor()
    {
        if (typeof(window.app) !== "undefined")
            throw "window.app already exists.\n You can't have more than one app.";
        window.app = this;
        this.pages = [];
        this.menu = new Menu;
        this.events = new Events;
        this._timedInfos = null;

        this.setBasicsKeybind();
    }

    static create(Class, connect=true)
    {
        if (!connect)
            return new Class;
        else 
        {
            const onConnected  = () =>
            {
                new Class;
            }

            window.auth = new Auth;
            window.auth.connect(localStorage["code"] || "");
            window.auth.events.add("connected", onConnected);
        }
    }

    createPage(ClassName, addToMenu=true)
    {
        const page = new ClassName; 
        this.addPage(page, addToMenu);
        return page;
    }

    addPage(page, addToMenu=true)
    {
        this.pages.push(page);
        if (addToMenu)
            this.menu.add(page.title(), () => this.showPage(page));
        page.hide();
        return page;
    }

    showPage(page)
    {
        this.pages.forEach(p => p.hide());
        page.show();
    }

    static dialog(title, content=null)
    {
        const dialog = new Dialog;
        dialog.setTitle(title);
        if (content)
            dialog.add(content);
        dialog.show(); 
        return dialog;
    }

    dialog(title, content=null){return WebApp.dialog(title, content);}
    error(content=null)
    {
        const dg = WebApp.dialog("Error", content);
        dg.classList.add("error");
    }


    // func will we execute if the user hit OK
    static confirm(text, func)
    {
        const c = D.createElement("div");
        c.innerHTML = text;
        const dialog = WebApp.dialog("Sure ?", c);

        dialog.events.add("valided", func);
    } 
    confirm(text, func){return WebApp.confirm(text, func);}

    // key should be of the form : ctrl a
    // alt b
    // A (shift a)
    // ctrl shift a
    // no sign like + 
    addkeybind(key, func, page=null)
    {
        let alt = false;
        let ctrl = false;
        let _super = false;
        if (key.includes("super"))
            _super = true;
        if (key.includes("alt"))
            alt = true;
        if (key.includes("ctrl") || key.includes("control"))
            ctrl = true;

        key = key.replaceAll("super", "");
        key = key.replaceAll("alt", "");
        key = key.replaceAll("ctrl", "");
        key = key.replaceAll("control", "");
        
        const f = (event) => {
            if (D.activeElement.isEditable())
                return;
            if (key == event.key && alt == event.altKey && ctrl == event.ctrlKey && _super == event.metaKey)
            {
                func(event);
                event.preventDefault();
            }
        }

        if (page)
            page.div.addEventListener("keydown", f);
        else
            document.addEventListener("keydown", f);
    }

    setBasicsKeybind()
    {
        this.addkeybind("m", () => this.menu.toggle());
    }

    // if time == -1, the window is never removed.
    timedInfos(html, time=3500)
    {
        if (this._timedInfos)
            this._timedInfos.remove();
        const dom = D.createElement("div");
        this._timedInfos = dom;
        dom.classList.add("timed-infos");
        if (typeof(html) == "string")
            dom.innerHTML = html;
        else 
            dom.appendChild(html);
        B.appendChild(dom);
        if (time != -1)
            setTimeout(() => dom.remove(), time);

        return dom;
    }

    defaultOnError(res, errorFunc)
    {
        if (errorFunc)
        {
            if (typeof(res) == "string")
                errorFunc(res);
            else if ("infos" in res)
                errorFunc(res.infos);
            else if ("message" in res)
                errorFunc(res.message);
            else
                errorFunc(res);
        }

        if (typeof(res) == "string")
            this.dialog("Error", res);
        else if ("infos" in res)
            this.dialog("Error", res.infos);
        else if ("message" in res)
            this.dialog("Error", res.message);
        else
            this.dialog("Error", res);
    }
}

class Auth
{
    constructor()
    {
        this.events = new Events;
    }

    connect(code)
    {
        const xhr = HttpRequest();
        xhr.sendJsonAsPost("ajax.php", {func : "connect", code : code}, (xhr) =>
            {
                try
                {
                    const res = JSON.parse(xhr.responseText);
                    if (res.success)
                    {
                        if (this.div)
                        {
                            this.div.remove();
                            this.div = null;
                        }

                        localStorage["code"] = code;
                        this.events.emit("connected");
                    }

                    else 
                    {
                        this.createUI();
                        this.events.emit("connexion-failed");
                    }
                }
                catch(e)
                {
                    app.dialog("Error", e);
                    this.events.emit("connexion-failed");
                }
            });
    }

    createUI()
    {
        if (this.div)
            return;
        this.div = B.newNode('div', "connect");
        this.code = this.div.labelInput("password", "Code : ");
        const f = () => {
            this.connect(this.code.getValue());   
        };
        this.code.addEvent("input", f);
        this.code.addEvent("change", f);
    }
}
