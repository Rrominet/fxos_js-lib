class MenuBar
{
	constructor (parent) 
	{
		this.content = document.createElement("div"); 
        this.content.addEventListener("click", () => this.allClick());
		this.content.classList.add("menusContent"); 
		this.menus = []; 

		parent.prepend(this.content); 
	}

	allClick() 
	{
		for (let m of this.menus)
			m.hide();
	}

	add(menu)
	{
		this.content.appendChild(menu.button);
		this.menus.push(menu); 

        menu.button.addEventListener("click", (e) => e.stopPropagation());
	}
}
