class ToggleButton
{
    constructor(html, onClick=null, parent=B, cls=[], id="")
    {
        this.html = html;
        this.cls = cls;
        this.id = id;
        this.parent = parent;
        this.onClick = [];
        this.onClick.push(onClick);

        this.interface();
        this.setEvents();
    }

    interface()
    {
        this.btn = this.parent.newButton(this.html, null, this.cls, this.id);
        this.btn.classList.add("toggle");
    }

    setEvents()
    {
        this.btn.addEventListener("click", (e) => 
            {
                e.stopPropagation();
                this.toggle();
                for (const f of this.onClick)
                {
                    if (f)
                        f();
                }
            });
    }

    active()
    {
        return this.btn.classList.contains("active");
    }

    setActive(val=true)
    {
        if (val && !this.active())
            this.btn.classList.add("active");
        else 
            this.btn.classList.remove("active");
    }

    toggle()
    {
        this.setActive(!this.active());
    }

    addOncLick(f)
    {
        this.onClick.push(f);
    }

    clearOnClick()
    {
        this.onClick = [];
    }
}
