class PluginManager
{
    constructor()
    {
        this.plugins = [];

        //useful for keep tracks of all file imported
        this.loaded = [];
    }

    // construct is a function that return a instance of the plugin
    // files are the files that need to be loaded when the plugin init.
    newPlugin(src, typeName, files=[], onloaded=null)
    {
        let filesOk = [];
        // useful to prevent double imports
        for (const f of files)
        {
            if (!this.loaded.includes(f))
            {
                filesOk.push(f);
                this.loaded.push(f);
            }
        }
        importScripts([mkJs(src)], () => 
            {
                let p = eval(this.cmd(typeName, filesOk));
                p.init(onloaded);
                this.plugins.push(p);
            })
    }

    cmd(typeName, files)
    {
        let cmd = "new ";
        cmd += typeName + "(" + files.toCode() + ",'" + typeName + "');" ;
        return cmd;
    }

    byName(name)
    {
        for (const p of this.plugins)
        {
            if (p.name == name)
                return p;
        }
        return null;
    }
}
