class MenuButton
{
	constructor(menu, text="", pfunction = null) 
	{
		this.menu = menu; 

		this.button = document.createElement("button");
		this.button.classList.add("menuButtons"); 
		this.button.innerHTML = text; 
		this.button.addEventListener("click", () => 
            {
                pfunction(); 
                this.menu.hide();
            });
		this.menu.menu.appendChild(this.button); 
		this.menu.buttons.push(this);
	}

    remove(){this.button.remove();}
    innerText(){return this.button.innerText;}
    innerHTML(){return this.button.innerHTML;}
    show(){this.button.show();}
    hide(){this.button.hide();}

}
