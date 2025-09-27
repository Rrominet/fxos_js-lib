window.ctxMenus = [];
class ContextMenu 
{
	constructor (contextNode=null, parentConditionObject = null)
	{
		this.node = contextNode;
		this.menu = document.createElement("div"); 
		this.menu.classList.add("menus"); 
		this.menu.classList.add("contexts"); 
		this.menu.hide();
		this.parentConditionObject = parentConditionObject;

		document.body.appendChild(this.menu);

        if (this.node)
        {
            this.node.addEventListener("contextmenu", function (event) 
                {
                    if (event.target.tagName.toLowerCase() == "a")
                        return;
                    if (this.parentConditionObject == null ||
                        this.parentConditionObject.canShowContext)
                    {
                        event.preventDefault();
                        event.stopPropagation();
                        ContextMenu.toggle(this.menu);
                        this.move(event.clientX, event.clientY);
                    }

                }.bind(this));
        }

		this.buttons = [];
        window.ctxMenus.push(this);
	}

    move(x, y)
    {
        this.menu.style.top = y + "px";
        this.menu.style.left = x + "px";

        if (y + this.menu.h()>=innerHeight)
        {
            let _y = y + this.menu.h() - innerHeight;
            _y = y - _y;
            this.menu.style.top = _y + "px";
        }

        if (x + this.menu.w()>=innerWidth)
        {
            let _x = x + this.menu.w() - innerWidth;
            _x = x - _x;
            this.menu.style.left = _x + "px";
        }

    }
    
	static toggle(menu)
	{
		for (let m of document.getElementsByClassName("menus"))
		{
			if (m != menu)
				m.hide();
		}

		if (menu.isVisible())
		{
			menu.hide();
			return;
		}

		else 
			menu.show();
	}

    add(text="", func)
    {
        this.buttons.push(new MenuButton(this, text, func));
    }

    separator()
    {
        this.menu.newNode("div", "menu-separator");
    }

	remove()
	{
        this.menu.remove();
	}

    removeBtnByIdx(index)
    {
        this.buttons[index].remove();
        this.buttons.remove(this.buttons[index]);
    }

    removeBtn(txt)
    {
        for (const btn of this.buttons)
        {
            if (btn.innerText() == txt)
            {
                btn.remove();
                this.buttons.remove(btn);
            }
        }
    }

    hide()
    {
        this.menu.hide();
    }

    shown()
    {
        return this.menu.isVisible();
    }

    enableAll()
    {
        for (const btn of this.menu.children)
            btn.disabled = false;
    }

    disableAll()
    {
        for (const btn of this.menu.children)
            btn.disabled = true;
    }
}

B.addEventListener("click", (e) => 
    {
        for (const m of window.ctxMenus)    
        {
            if (e.target == m.menu || m.menu.contains(e.target))
                continue;
            m.hide();
        }
    });
