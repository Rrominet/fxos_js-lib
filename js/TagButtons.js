class TagButtons
{
	// type = classic : you can have several button active 
	// type = toggle : you can have only one button active
	 // list of [cleanName, id] 
	constructor (parent, list, type="classic", funcOnClick = null)
	{
		this.parent = parent;
		this.list = list;
		this.buttons = []; 
		this.type = type;
        this._alwaysOneActive = false;

		this.interface(funcOnClick);
	}

    //if you call this function, you will always at leat have one active button
    alwaysKeepAtLeatOneActive(bool=true)
    {
        this._alwaysOneActive = bool;
    }

	interface(func = null)
	{
		this.div = this.parent.newNode("div", "TagButtons"); 
		for (let l of this.list)
			this.newButton(l, func);
	}

	newButton(elmt, func=null)
	{
		let b = new TagButton(this, elmt[0], elmt[1], func);
		this.buttons.push(b);
	}

	getAsString()
	{
		let _r = "";
		for (let b of this.buttons)
		{
			if (b.active)
				_r += b.id + ";;"
		}

		return _r.substring(0, _r.length -2);
	}

	read(s, sep = ";;")
	{
		let tmp = s.split(sep);
		for (let b of this.buttons)
		{
			if (tmp.includes(b.id))
				b.setActive(true);
		}
	}

	activeIds()
	{
		let ids = []; 
		for (const b of this.buttons)
		{
			if (b.active)
				ids.push(b.id)
		}
		return ids;
	}

    activeIdxs()
    {
		let ids = []; 
		for (let i=0; i<this.buttons.length; i++)
		{
			if (this.buttons[i].active)
				ids.push(i)
		}
		return ids;
    }
}

class TagButton
{
	constructor(tagButtons, name, id, func=null)
	{
		this.tagButtons = tagButtons;
		this.button = tagButtons.div.newNode("button");
		this.button.innerText = name; 
		this.id = id;
		this.active = false;
        this._func = func;
		this.setEvents();
	}

	setEvents()
	{
		this.button.addEventListener("click", () => this.toggle());
	}

    _setActive(bool)
    {
		this.active = bool; 

		if (!bool && this.button.classList.contains("active"))
			this.button.classList.remove("active");
		else if (bool && !this.button.classList.contains("active"))
			this.button.classList.add("active");
    }

	setActive(bool)
	{
        this._setActive(bool);
        if (this.tagButtons._alwaysOneActive)
        {
            const actives = this.tagButtons.activeIds();
            if (actives.length == 0)
                this._setActive(true);
        }

        if (this._func != null)
            this._func(this);
	}

	toggle()
	{
		if (this.tagButtons.type == "classic")
		{
			this.setActive(!this.active);
			return;
		}

		else if (this.tagButtons.type == "toggle")
		{
			let wasActive = this.active;
			for (let b of this.tagButtons.buttons)
				b._setActive(false); 
			this.setActive(!wasActive);
		}
	}

    click()
    {
        this.button.click();
    }
}
