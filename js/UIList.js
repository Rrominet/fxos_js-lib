function UIList_constants()
{
	ONLY_ONE_SELECTED                  = 1000;
	SEVERAL_SELECTED                   = 1001;
    NO_SELECTION                       = 1002;
}

UIList_constants();

// 	ONLY_ONE_SELECTED   
// 	SEVERAL_SELECTED    
//  NO_SELECTION        
class UIList
{
	constructor(parent, type=ONLY_ONE_SELECTED, search=false, title="", keyEvents=false)
	{
		this.elmts = [];
		this.type = type;
		this.parent = parent;
		this.interface(title, search);
		if (keyEvents)
			this.setKeyEvents();
	}

	interface(title="", search = false)
	{
        if (title || search)
        {
            this.div = this.parent.newNode("div", "list");
            this.div.setAttribute("tabindex", "0");
            this.div.head = this.div.newNode("div", "head");
            this.div.head.titre = this.div.head.newTitle("div", title, "title");
            if (search)
            {
                this.div.head.search = this.div.head.addInput("text", "Rechercher...", "search");
                this.div.head.search.addEventListener("input", () => this.onSearch());
            }
            this.list = this.div.newNode("div", "elmts");
        }
        else 
            this.list = this.parent.newNode("div", "list");
    }

    // the func take one arg : the elmt itself.
    addEventOnElmts(type, func)
    {
        for (const el of this.elmts) 
        {
            el._uiElmt.addEventListener(type, () => func(el));
        }
    }

	// Elmt must have an attribute nodename (default is div) who inherite of HTMLElement.
	add(Elmt, nodename="div")
	{
        if (typeof(Elmt) != "object")
        {
            const tmp = Elmt;
            Elmt = {};
            Elmt[nodename] = D.createElement("div");
            Elmt[nodename].innerHTML = tmp;
        }

		this.elmts.push(Elmt);
        if (Elmt[nodename])
        {
            Elmt[nodename].classList.add("elmt"); 
            this.list.append(Elmt[nodename]); 
        }
		let type = this.type;
		let elmts = this.elmts;
        if (this.type != NO_SELECTION)
        {
            Elmt[nodename].addEventListener("click", function () {UIList.toggle(Elmt, type, elmts)});
            Elmt.selected = function ()
            {
                return (this.div.classList.contains("selected") && this.div.isVisible());
            }
        }

        if (!Elmt.hide)
        {
            Elmt.hide = () => 
            {
                Elmt[nodename].hide();
                Elmt[nodename].classList.remove("selected");
            }
        }

        if (!Elmt.show)
        {
            Elmt.show = () => 
            {
                if ("preShow" in Elmt)
                    Elmt.preShow();
                Elmt[nodename].show();
                if (!Elmt[nodename].classList.contains("elmt"))
                    Elmt[nodename].classList.add("elmt");
                if (!this.list.children.includes(Elmt[nodename]))
                    this.list.append(Elmt[nodename]);
            }
        }

        Elmt._uiElmt = Elmt[nodename];

        if (this.div)
            this.div.head.search.placeholder = "Rechercher parmis les " + this.elmts.length + " éléments...";

        return Elmt;
    }

    length()
    {
        return this.elmts.length;
    }

    addText(txt)
    {
        const elmt = {};
        elmt._uiElmt = D.createElement("div");
        elmt._uiElmt.innerHTML = txt;
        this.add(elmt);
        return elmt._uiElmt;
    }

    setTitle(val)
    {
        if (!this.div)
            return;
        this.div.head.titre.innerHTML = val;
    }

	remove(Elmt)
	{
		Elmt._uiElmt.remove();
		this.elmts.remove(Elmt);
	}

    selected()
    {
        let s = []
        for (const el of this.elmts)
        {
            if (el._uiElmt.classList.contains("selected") && el._uiElmt.isVisible())
                s.push(el);
        }

        return s;
    }

    removeSelected()
    {
        for (const el of this.selected())
            this.remove(el);
    }

    selectAll()
    {
        this.deselectAll();
        for (const el of this.elmts)
        {
            if (el._uiElmt.isVisible())
                el._uiElmt.classList.add("selected");
        }
    }

    deselectAll()
    {
        for (const el of this.elmts)
            el._uiElmt.classList.remove("selected");
    }

	clear()
	{
		for (let e of this.elmts)
			e._uiElmt.remove();
		this.elmts = [];
	}

    // could be reimplement 
    // depends of the elmts type
    onSearch()
    {
        if (this.div.head.search.value.length<3)
        {
            for (const elmt of this.elmts)
                elmt.show();
        }

        else 
        {
            for (const elmt of this.elmts)
            {
                let txt = "";
                if (elmt._uiElmt)
                    txt = elmt._uiElmt.innerText.clean();
                else 
                    txt = elmt.data().clean();
                if (txt.includes(this.div.head.search.value.clean()))
                    elmt.show();
                else 
                    elmt.hide();
            }
        }
    }

	//this is the div of th Elmt
    //if the Elmt has a method onSelectionChanged, it will be executed after the selection has changed.
	static toggle(elmt, type = ONLY_ONE_SELECTED, elmts=[])
	{
		if (type == ONLY_ONE_SELECTED)
		{
			for (let el of elmts)
			{
				if (el._uiElmt.classList.contains("selected") && el != elmt)
					el._uiElmt.classList.remove("selected");
			}
		}

		if (elmt._uiElmt.classList.contains("selected"))
			elmt._uiElmt.classList.remove("selected");
		else 
			elmt._uiElmt.classList.add("selected");

        if (elmt.onSelectionChanged)
            elmt.onSelectionChanged();
	}

    show()
    {
        if (this.div)
            this.div.show();
        else 
            this.list.show();
    }

    showAll()
    {
        for (const el of this.elmts)
            el.show();
    }

    hideAll()
    {
        for (const el of this.elmts)
            el.hide();
    }

    hide()
    {
        if (this.div)
            this.div.hide();
        else 
            this.list.hide();
    }

    setKeyEvents()
    {
        this.div.addEventListener("keydown", (e) =>
            {
            	if (D.activeElement.isEditable())
                		return; 
                e.preventDefault()
                if (e.key == "a" && e.ctrlKey)
                	this.selectAll(); 
                if (e.key == "a" && e.altKey)
                	this.deselectAll(); 
                if (e.key == "Delete")
                {
                	for (const el of this.selected())
                    {
                        this.elmts.remove(el);
                        if (el.remove)
                            el.remove();
                        else 
                            el._uiElmt.remove();
                    }
                }

                if (e.key == "f" && e.ctrlKey)
                {
                    if (this.div.head.search)
                        this.div.head.search.focus();
                }
            });
    }
}
