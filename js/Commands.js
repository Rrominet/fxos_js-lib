class Command
{
    constructor(id, name="", func=null)
    {
        this.cmds = null;
        this.id = id;

        this.name = name;
        if (this.name == "")
            this.name = this.id;

        this._exec = func;

        //should return true if the command should be executed depending of the context
        this._check = null;

        //keybinds format : 
        //ctrl s ctrl S (meaning shift s)
        //don't put + or - only a space
        //modifiers are : ctrl alt meta (not shift because it basicly when you put the letter in Maj, meta and super are interpreted the same)
        this.keybinds = [];

        this.args = null;
    }

    check()
    {
        if (!this._check)
            return true;
        return this._check(this);
    }

    //you can override args here or just set them before with cmd.args = ...
    exec(args=null, pushHistory=true)
    {
        if (args)
            this.args = args;

        if (!this.check())
            return;

        this._exec(this.args);
        const _args = {...this.args};
        const data = {"cmd-id" : this.id};
        data.args = _args;

        this.cmds.lastCmdExected = this.id;

        const urlData = {"cmd-id" : this.id};
        for (const key in this.args)
            urlData[key] = this.args[key];

        let url_id = this.cmds.url_id();
        if (url_id == "")
        {
            if (pushHistory)
                history.pushState(data, this.name, "?" + new URLSearchParams(urlData).toString());
        }
        else
        {
            if (pushHistory && !location.pathname.includes(url_id))
                history.pushState(data, this.name, url_id);
        }
    }
}

class Commands
{
    static get maj(){return "ABCDEFGIJKLMNOPQRSTUVWXYZ";};

    //the url_prefix if useful if your app is not at the root of your domain.
    //just add the part after the domain and the main page of your app.
    constructor(url_prefix="")
    {
        this.url_prefix = url_prefix;
        this.cmds = {};

        this.lastCmdExected = "";
        window.addEventListener("popstate", (event) => {this.onPopState(event.state);});
        window.addEventListener("keydown", (event) => {this._onKeyDown(event);});
    }

    //get the cmd_id from url if the id is not in the cmd-id key but simply a route.
    url_id()
    {
        let url_cmd_id = "";
        url_cmd_id = location.pathname.replace(this.url_prefix, "");
        url_cmd_id = url_cmd_id.replaceAll("/", "");
        return url_cmd_id;
    }

    onPopState(state)
    {
        let cmd = null;
        try 
        {
            cmd = this.get(state["cmd-id"]);
        }
        catch(e){
            return;
        }

        if ("args" in state)
            cmd.exec(state.args, false);
        else 
            cmd.exec({}, false);
    }

    //checkfunc take one arg the cmd itself
    create(id, name="", func=null, checkfunc=null)
    {
        const cmd = new Command(id, name, func);
        cmd.cmds = this;
        if (checkfunc)
            cmd._check = checkfunc;
        this.cmds[id] = cmd;
        return this.cmds[id];
    }

    get(id)
    {
        return this.cmds[id];
    }

    urlHasCmdToExec(url=null)
    {
        if (!url)
            url = window.location.href;
        url = new URL(url);
        const params = new URLSearchParams(url.search);
        const data = Object.fromEntries(params);

        if ("cmd-id" in data)
            return true;

        if (this.url_cmd_id != "")
            return true;
        return false;
    }

    //this gonna exec the good command from the current url parameters
    //take the current url in browser is no url is passed ar argument.
    //return true if the command was executed, false otherwise
    execFromURL(url=null)
    {
        if (!url)
            url = window.location.href;
        console.log("Executing from url...");
        url = new URL(url);
        const params = new URLSearchParams(url.search);
        const data = Object.fromEntries(params);

        let cmd_id = "";

        if (!("cmd-id" in data))
        {
            console.log("No cmd-id in url.");
            cmd_id = this.url_id();
            console.log(cmd_id);
        }
        else
            cmd_id = data["cmd-id"];
        
        if (cmd_id == "")
        {
            console.log("No id given...");
            return false;
        }

        if (cmd_id == this.lastCmdExected)
        {
            console.log("Last command already executed.");
            return false;
        }

        let cmd = null;
        cmd = this.get(cmd_id);
        if (!cmd)
        {
            console.log(cmd_id + " is not a valid command.");
            return false;
        }

        const args = {};
        for (const key in data)
        {
            if (key == "cmd-id")
                continue;
            args[key] = data[key];
        }
        cmd.exec(args);

        this.lastCmdExected = cmd_id;
        console.log("Executed : " + cmd_id);
        return true;
    }

    _onKeyDown(event)
    {
        if (activeElmtAnInput())
            return;

        this.execFromKeybind(keybinds.keybindFromEvent(event));
    }

    execFromKeybind(keybind)
    {
        for (const [key, cmd] of Object.entries(this.cmds))
        {
            if (cmd.keybinds.includes(keybind))
            {
                cmd.exec();
                event.preventDefault();
            }
        }
    }
}


//TODO : could do a lot here.
//automaticly add a help popup, keybinds, loader in the button, etc...
HTMLElement.prototype.addCommand = function(cmd, overrideText="", cls="", id="")
{
    if (overrideText == "")
        overrideText = cmd.name;
    return this.newButton(overrideText, () => cmd.exec(), cls, id);
}
