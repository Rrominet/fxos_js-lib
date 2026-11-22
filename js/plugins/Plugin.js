class Plugin
{
    constructor(files = [], name="")
    {
        // the files needed to load this plugin
        this.name = name;
        this.files = files;
    }

    // doned could be a function to exec after the initialisation is doned
    init(doned = null)
    {
        let ls = [];
        for (const f of this.files)
            ls.push(mkJs(f));
        importScripts(ls, doned);
    }

    unload(){}

    // a plugin instance need a static function who return an instance of the child plugin class
    // ex : static create()
    // {
    //      return new Plugin;
    // }
}
