document.addEventListener("click", function ()
{
	for (let el of document.getElementsByClassName("contexts"))
		el.hide();
});

class Menu 
{
	constructor (parent, name)
	{
		this.menu = document.createElement("div"); 
		this.menu.classList.add("menus"); 
		this.menu.hide()

		this.button = document.createElement("button"); 
		this.button.innerText = name; 
		this.button.classList.add("headerButtons");
		parent.appendChild(this.button);

		document.body.appendChild(this.menu);

		this.button.addEventListener("click", function () 
		{
			this.toggle(this.menu);
		}.bind(this));

		this.buttons = [];
	}

    hide()
    {
        this.menu.hide();
    }

    show()
    {
        this.menu.show();
    }

	toggle(menu)
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
		{
			menu.show();
			let req = this.button.getClientRects()[0];
			menu.style.top = parseInt(req.bottom + 4); 
			menu.style.top += "px"; 

			menu.style.left = req.left + "px";
		}
	}

	remove()
	{
        this.menu.remove();
        delete this.menu;
        this.menu = null;

        this.buttons = [];
        this.button.remove();
        delete this.button;
        this.button = null;
	}

    separator()
    {
        this.menu.newNode("div", "menu-separator");
    }
}
