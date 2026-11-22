window.keybinds = [];

class keybinds
{
    static add(keybind, func)
    {
        const kb = {keybind: keybind, func: func};
        window.keybinds.push(kb);
    }

    static keybindFromEvent(event)
    {
        let keybind = event.key;
        keybind = keybind.toLowerCase();
        if (keybind == " ")
            keybind = "space";

        if (event.ctrlKey)
            keybind = "ctrl " + keybind;
        if (event.altKey)
            keybind = "alt " + keybind;
        if (event.shiftKey)
            keybind = "shift " + keybind;
        if (event.metaKey)
            keybind = "meta " + keybind;
        
        return keybind;
    }

    static _onKeyDown(event)
    {
        if (activeElmtAnInput())
            return;

        const keybind = keybinds.keybindFromEvent(event);
        for (const kb of window.keybinds)
        {
            if (kb.keybind == keybind)
            {
                kb.func(event);
                event.preventDefault();
            }
        }
    }
}

window.addEventListener("keydown", (event) => keybinds._onKeyDown(event));

