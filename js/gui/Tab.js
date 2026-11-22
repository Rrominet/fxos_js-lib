class Tab
{
    //content could be string or HTMLObject
    constructor (tabs, button, content=null)
    {
        this.tabs = tabs;
        this.button = button;
        this.content = content;
        this.interface();
    }

    interface()
    {
        this.div = this.tabs.div.tabs.newNode("div", "tab");
        this.setContent();
    }

    // could be overriden in children class
    setContent(content = null)
    {
        if (!content)
            return;
        this.div.innerHTML = "";
        if (typeof(this.content) == "string")
            content = this.div.newTitle("div", this.content);
        else if (content)
            this.div.appendChild(content);
        if (content)
            this.content = content;
    }

    show()
    {
        for (const t of this.tabs.tabs)
            t.hide();
        this.div.show();
        this.button.classList.add("active");
    }

    hide()
    {
        this.div.hide();
        this.button.classList.remove("active");
    }

    addOnClick(func)
    {
        this.button.addEventListener("click", func);
    }
}

class Tabs
{
    constructor (parent)
    {
        this.tabs = [];
        this.bts = [];
        this.parent = parent;
        this.interface();
    }

    interface()
    {
        this.div = this.parent.newNode("div", "tabs");
        this.div.bts = this.div.newNode("div", "bts");
        this.div.tabs = this.div.newNode("div", "tabs-content");
    }

    newTab(text, content="", onclick=null, _class="")
    {
        let b = this.div.bts.newButton(text);
        let t = new Tab(this, b, content);
        this.tabs.push(t);
        this.bts.push(b);
        b.addEventListener("click", () => t.show());
        if (onclick)
            b.addEventListener("click", onclick);
        if (_class)
            t.div.classList.add(_class);
        return t;
    }

    show(index)
    {
        this.tabs[index].show();
    }

    hideAll()
    {
        for (const t of this.tabs)
            t.hide();
    }

    addOnChange(f)
    {
        for (const t of this.tabs)
            t.button.addEventListener("click", f);
    }
}
