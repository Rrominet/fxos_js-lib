class ComboBox
{
    // options being a list of string
    constructor(options, parent=B, activeIndex=0)
    {
        this.options = options
        this.activeIndex = activeIndex;
        this.parent = parent; 
        this.onChange = [];
        this.fromUser = true;
        this.interface();
        this.setEvents();
        if (typeof(FML) != "undefined")
            newCss(FML + "/css/combo-box.css");
        else 
            newCss(FM + "/css/combo-box.css");
    }

    interface()
    {
        this.div = this.parent.newNode("div", "combo-box");
        this.div.btn = this.div.newButton(this.activeOption());
    }

    setEvents()
    {
        this.div.btn.addEventListener("click", () => 
            {
                if (!this.menu)
                    this.createMenu();
                else if (this.menu.isVisible())
                {
                    this.menu.hide();
                    return;
                }
                else 
                    this.menu.show();
                this.placeMenu();
            });
    }

    createMenu()
    {
        this.menu = this.parent.newNode("div", "cb-menu");
        for (let i=0; i<this.options.length; i++)
        {
            const b = this.menu.newButton(this.options[i], () => 
                {
                    let changed = false;
                    if (b.index != this.activeIndex)
                    {
                        this.activeIndex = b.index;
                        changed = true;
                    }
                    this.showActiveOption();

                    if (changed && this.fromUser)
                    {
                        for (const f of this.onChange)
                            f(this.activeOption());
                    }
                });
            b.index = i;
        }
    }

    placeMenu()
    {
        if (isPhone())
        {
            this.menu.style.marginLeft = "1em";
            this.menu.style.marginTop = "1em";
        }
        else 
        {
            let x =  this.div.btn.x();
            const diff = this.menu.width() - this.div.btn.width();
            x -= (diff/2);
            this.menu.style.marginLeft = x + "px";
            this.menu.style.marginTop = (this.div.btn.y() + this.div.btn.h() + 3) + "px";
        }
    }

    showActiveOption()
    {
        if (this.menu)
            this.menu.hide();
        this.div.btn.innerText = this.activeOption();
    }

    activeOption()
    {
        return this.options[this.activeIndex];
    }

    show()
    {
        if (!this.div)
            this.interface();
        this.div.show();
    }

    hide()
    {
        if (!this.div)
            return;
        this.div.hide();
    }

    remove()
    {
        if (this.div)
            this.div.remove();
    }

    addOnChange(f)
    {
        this.onChange.push(f);
    }

    setValue(text, force=false)
    {
        if (!force)
        {
            if (!this.options.includes(text))
                return;
        }
        this.fromUser = false;

        if (!this.options.includes(text))
            this.options.push(text);
        if (this.menu)
            this.menu.remove()

        this.createMenu();
        this.menu.hide();

        for (const btn of this.menu.children)
        {
            if (btn.innerText == text)
            {
                btn.click();
                break;
            }
        }
        this.fromUser = true;
    }
}

// TEST file and exec //
if (location.href.includes('http://localhost/'))
{
    importScripts([
        mkJs(FM + "/js/test.js"),
        mkJs("http://localhost/motion-live/frameworks/js/ComboBox_test.js"),
    ]);
}
