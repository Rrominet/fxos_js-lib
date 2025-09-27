class FAQ
{
	constructor (div)
	{
		this.css();
		this.div = div;
		this.sections = [];
		this.setSections();
	}

	css()
	{
		newCss(FM + "/css/faq.css");
	}

	setSections()
	{
		for (let c of this.div.children)
		{
            if (c.children.length<=1)
                continue;
			let section = new FAQSection(c);
			this.sections.push(section);
		}
	}

    hideAll()
    {
        for (const c of this.sections)
            c.hide();
    }
}

class FAQSection
{
	constructor (section)
	{
		this.section = section;
		this.setElmts();
		this.visibility = false;
		this.setEvents();
	}

	setElmts()
	{
		this.section.question = this.section.children[0]; 
        this.section.response = this.section.newNode("div", "response");
        const htmlres = this.section.children[1];
        htmlres.remove();
        this.section.response.appendChild(htmlres);

		this.section.question.classList.add("question");

        this._height = this.section.response.h();
	}

	setEvents()
	{
		this.section.question.addEventListener("click", ()=>this.toggle());
	}

	height()
	{
        let h = 0;
        for (const c of this.section.response.children)
            h += c.h();
        return h;
	}

	hide()
	{
		this.visibility = false;
		this.section.response.style.maxHeight = "0px";
	}

	show()
	{
		this.visibility = true;
		this.section.response.style.maxHeight = this.height() + "px";
	}

	toggle()
	{
		this.visibility = !this.visibility; 
		if (this.visibility)
			this.show(); 
		else 
			this.hide();
	}
}
