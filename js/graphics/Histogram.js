class Histogram
{
    static get NORMAL(){return 1;}
    static get INVERSE(){return 2;}

	constructor (parent, titre = "", type = HISTO.normal)
	{
        this.data = [];
        this.sortType = Histogram.NORMAL;
		this.parent = parent;
		this.arrays = [];
		this.type = type;
		this.interface(titre);
		this.setEvents();
        this.showOnFly = false;
	}

    setSortType(type)
    {
        this.sortType = type;
    }

	setEvents()
	{
		addEventListener("resize", () => this.updateWidth());
	}

	interface(titre="")
	{
		this.div = this.parent.newNode("div", ["histogram", "container"]);
        if (titre != "")
            this.setTitre(titre);
		this.div.graph = this.div.newNode("div", ["histogram", "graphic"]);
	}

	setTitre(t)
	{
		if (!this.div.titre)
			this.div.titre = this.div.newTitle("h3", t, "histogram"); 
		else 
			this.div.titre.innerHTML = t;
	}

	globalWidth()
	{ // 8 is the padding in the style.css;
        return this.div.graph.w() - 8;
	}

	// t as an array of objects
	// objects has to have at least two attr : "key" and "value"
	// they can have a third one : "date"
	setValue(t)
	{
        this.data = t;
		this.div.graph.innerHTML = "";
		if (this.type == HISTO.normal)
		{
            if (this.sortType == Histogram.NORMAL)
                this.arrays = t.sort(Histogram.compare);
            else if(this.sortType == Histogram.INVERSE) 
                this.arrays = t.sort(Histogram.compareInv);
            if (this.sortType == Histogram.NORMAL)
                this.max = this.arrays[this.arrays.length-1].value;
            else 
                this.max = this.arrays[0].value;
		}
		else
		{
			this.arrays = t;
			this.max = 0;
			for (let a of this.arrays)
			{
				if (a.value>this.max)
					this.max = a.value;
			}
		}
		this.columns = []; 
		for (let i = 0; i<this.arrays.length; i++)
		{
            let c = null;
            if (this.arrays[i].readable)
                c = this.divFromValue(this.arrays[i].key, this.arrays[i].value, this.arrays[i].readable);
            else 
                c = this.divFromValue(this.arrays[i].key, this.arrays[i].value);
			this.columns.push(c);
			if (this.type == HISTO.dates || this.showOnFly)
			{
				c.addEventListener("mouseenter", function () {this.text.hidden = false});
				c.addEventListener("mouseleave", function () {this.text.hidden = true});
                c.text.hidden = true;
			}
		}

        this.updateWidth();
	}

    // the key is the name from the value to modify/create
    setOneValue(key, val)
    {
        for (const el of this.data) 
        {
            if (el.key == key)
            {
                el.value = val;
                this.update();
                return;
            }
        }

        this.data.push({"key" : key, "value" : val});
        this.update();
        this.updateWidth(); // TODO BUG
    }

    update()
    {
        this.setValue(this.data);
    }

	updateWidth()
	{
        if (!this.columns)
            return;
		for (let c of this.columns)
			c.style.width = (Math.abs(c.ratio)*this.globalWidth()) + "px";
	}

	divFromValue(key, val, readable="")
	{	
		let w = 1.0*val;
		w = val/this.max;

        const span = this.div.graph.newNode("span");
		let div = this.div.graph.newNode("div", ["histogram", "column"]);
		div.style.width = (Math.abs(w)*this.globalWidth()) + "px";
		div.ratio = w;
		div.text = span;
        if (readable)
            div.text.innerHTML = key + " : <b>" + readable + "</b>";
        else 
            div.text.innerHTML = key + " : <b>" + val + "</b>";
		if (this.type == HISTO.dates)
		{
			div.style.height = "2px";
			div.style.margin = "0px";
			div.text.hidden = true;
			div.style.backgroundColor = "#940000";
		}
		else
		{
			if (div.ratio>=0)
				div.style.backgroundColor = rgbAsStyle(randomRGB(0.75));
			else
			{
				div.style.backgroundColor = rgbAsStyle(randomRGB(0, 0.25));
				div.text.style.color = "white"; 
			}
		}
		return div;
	}

	static compare(elmt1, elmt2)
	{
		if (elmt1.value<=elmt2.value)
			return -1;
		else
			return 1;
	}

	static compareInv(elmt1, elmt2)
	{
		if (elmt1.value<=elmt2.value)
			return 1;
		else
			return -1;
	}
}
