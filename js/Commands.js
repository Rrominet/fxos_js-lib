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
    exec(args=null)
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
        history.pushState(data, this.name, "?" + new URLSearchParams(urlData).toString());
    }
}

class Commands
{
    static get maj(){return "ABCDEFGIJKLMNOPQRSTUVWXYZ";};
    constructor()
    {
        this.cmds = {};
        this.lastCmdExected = "";
        window.addEventListener("popstate", (event) => {this.onPopState(event.state);});
        window.addEventListener("keydown", (event) => {this._onKeyDown(event);});
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
            cmd.exec(state.args);
        else 
            cmd.exec();
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

        return ("cmd-id" in data);
    }

    //this gonna exec the good command from the current url parameters
    //take the current utl in browser is no url is passed ar argument.
    //return true if the command was executed, false otherwise
    execFromURL(url=null)
    {
        if (!url)
            url = window.location.href;
        url = new URL(url);
        const params = new URLSearchParams(url.search);
        const data = Object.fromEntries(params);

        if (!"cmd-id" in data)
            return false;

        if (data["cmd-id"] == this.lastCmdExected)
            return false;

        let cmd = null;
        cmd = this.get(data["cmd-id"]);
        if (!cmd)
        {
            console.error(data["cmd-id"] + " is not a valid command.");
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

        this.lastCmdExected = data["cmd-id"];
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
HTMLElement.prototype.addCommand = function(cmd, overrideText="")
{
    if (overrideText == "")
        overrideText = cmd.name;
    return this.newButton(overrideText, () => cmd.exec());
}
