class WindowsManager
{
    constructor(target=B)
    {
        this.windows = [];
        this.target = target;
        this.target.classList.add("windows-manager");
        this.dragging = false;
        this.lang = "fr";

        this.setEvents();
    }

    newWindow(title, content = null, draggable= false)
    {
        const w = new mlWindow(this, title, content, draggable);
        this.windows.push(w);
        return w;
    }

    newFromDomElmt(elmt, title=null, draggable=false)
    {
        const w = new mlWindow(this, title, elmt, draggable);
        this.windows.push(w);
        w.show();
        return w;
    }

    newStyleWindow()
    {
        const w = new StyleWindow(this);
        this.windows.push(w);
        return w;
    }

    // msg is a div elmt or a str
    message(msg, onOk, title=null, draggable=false, hideOnOk=true, btnText="OK")
    {
        const w = new MessageWindow(this, title, msg, draggable, hideOnOk, btnText); 
        this.windows.push(w);
        if (onOk)
            w.addEventOnButton(onOk);
        w.showWithAnimation();
        return w;
    }

    emailPopup(title, content, onButton, button=null, footer=null)
    {
        const w = new EmailPopup(this, title, content, onButton, button, footer);
        this.windows.push(w);
        return w;
    }

    setEvents()
    {
        addEventListener("keydown", (e) => this.onKey(e));
        addEventListener("mousemove", (e) => this.onMove(e));
        addEventListener("mouseup", () => this.stopMouses());
    }

    active()
    {
        for (const w of this.windows)
        {
            if (w.isFocused())
                return w;
        }
    }

    dragged()
    {
        for (const w of this.windows)
        {
            if (w.dragged)
                return w;
        }
    }

    scaled()
    {
        for (const w of this.windows)
        {
            if (w.scaling)
                return w;
        }
    }

    drag(e)
    {
        const d = this.dragged();
        if (!d)
            return;
        this.dragged().move(e.movementX, e.movementY);
    }

    onMove(e)
    {
        this.drag(e);
        this.scale(e);
    }

    stopDrag()
    {
        for (const w of this.windows)
            w.drag(false);
    }

    stopScale()
    {
        for (const w of this.windows)
            w.scaling=false;
    }

    stopMouses()
    {
        this.stopDrag();
        this.stopScale();
    }

    onKey(e)
    {
        if (this.active())
            this.active().onKey(e);
    }

    focused()
    {
        if (this.active())
            return true;
        return false;
    }

    loadDependencies(onLoaded, all=false)
    {
        if (this.dependenciesLoaded)
        {
            onLoaded();
            return;
        }
        const Window = mkJs(FM + "/js/windows-manager/Window.js") ;
        const MessageWindow = mkJs(FM + "/js/windows-manager/MessageWindow.js") ;
        const EmailPopup = mkJs(FM + "/js/windows-manager/EmailPopup.js") ;
        const StyleWindow = mkJs(FM + "/js/windows-manager/StyleWindow.js");

        let scripts = [
            Window, 
            MessageWindow, 
            EmailPopup, 
        ]; 

        if (all)
            scripts.push(StyleWindow);

        importScripts(scripts, onLoaded);
        this.dependenciesLoaded = true;
        newCss(FM + "/css/windows-manager.css");
    }

    remove(win)
    {
        win.div.remove();
        this.windows.remove(win);
    }

    scale(e)
    {
        const w = this.scaled();
        if (!w)
            return;
        w.addSize(e.movementX, e.movementY);
    }

    //show and create (if necessarry a new) window
    //inst is the instance that should contain the attribute attr that itself (will) contain the new created or shown window
    //wincls constructor should at least take 1 arg : THIS windowManager Instance and an optional second one : the inst containing the window 
    show(inst, attr, wincls)
    {
        if (!inst[attr])
            inst[attr] = new wincls(this, inst);
        inst[attr].show();
    }
}
