class mlFile
{
	constructor(name)
	{
		this.interface(name);
		this.setEvents();
	}

	interface(name)
	{
		this.div = D.createElement("div");
		this.div.classList.add("file");
		this.div.name = this.div.newNode("span"); 
		this.div.name.innerText = name;
	}
	
	setEvents()
	{

	}
}	