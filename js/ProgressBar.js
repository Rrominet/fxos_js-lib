class ProgressBar
{
	// value = 0.0 = 0 and 1.0 = 100%
	constructor(parent, frontColor = "#616161", backColor = "#b7b5b5", params =
        {
            width : "100%", 
            height : "8px",
            borderRadius : "8px",
        })
	{
        this.div = parent.newNode("div", ["progressBar-parent"]);
		this.back =  this.div.newNode("div", ["progressBar", "back"]);
		this.front = this.div.newNode("div", ["progressBar", "front"]);
        this.parent = parent;

		let li = [this.back, this.front];

		for (let l of li)
		{
			l.style.height = params.height;
			l.style.minHeight = params.height;
			l.style.borderRadius = params.borderRadius;
		}

		this.back.style.width = params.width;
		this.back.style.backgroundColor = backColor;
		this.front.style.backgroundColor = frontColor;

		this.front.style.position = "relative";
		this.front.style.left = "0";
		this.front.style.zIndex = "100";
		this.front.style.width = "0px";
		this.front.style.marginTop = "-" + (params.height);
		this.front.style.transition = "width 0.3s";
        this.front.style.padding = 0;
        this.back.style.padding = 0;
		this.value = 0.0; 
        this.setEvents();
    }

    transformColorsAsCss()
    {
        this.back.style.removeProperty("background-color");
        this.front.style.removeProperty("background-color");
    }

    setEvents()
    {
        window.addEventListener("resize", () => this.setValue(this.value));
    }

	setValue(val)
	{
        if (val >=1.0)
            val = 1.0;
		this.value = parseFloat(val);
        if (!this.back.getClientRects()[0])
            return;
		let w = this.back.getClientRects()[0].width;

		this.front.style.width = (this.value*w) + "px";
        if (this.label)
            this.label.children[0].innerText = round(this.value * 100, 1);
	}

    //will add a label with current pgr value under the bar
    addLabel()
    {
        if (this.label)
            return;
        this.label = D.createElement("label");
        this.label.classList.add("pgr-label");
        this.label.innerHTML = "<span>" + round(this.value * 100, 1) + "</span> &#37;";
        this.front.insertAfter(this.label);
    }

    set(val)
    {
        this.setValue(val);
    }

    add(val)
    {
        val = this.value + parseFloat(val); 
        this.setValue(val);
    }

	hide()
	{
		this.back.hide();
		this.front.hide();
	}

	show()
	{
		this.back.show();
		this.front.show();
	}

	remove()
	{
		this.back.remove();
		this.front.remove();
	}

    // width as css rule like '25px' or '10%'
    setWidth(width)
    {
        this.back.style.width = width;
    }
}
