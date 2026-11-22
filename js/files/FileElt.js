class FileElt
{
	constructor (name, parent, delFunc = null, renameFunc = null, openFunc = null)
	{
		this.name = name;

		this.div = document.createElement("div"); 
		this.div.classList.add("listElts"); 

		this.div.name = document.createElement("font"); 
		this.div.name.innerText = name; 
		this.div.appendChild(this.div.name); 

		if (delFunc!=null)
		{
			this.deleteButton = document.createElement("button"); 
			this.deleteButton.classList.add("listElts");
			this.deleteButton.classList.add("deletes");
			this.deleteButton.innerText = "X";
			this.deleteButton.type = "button";
			this.div.appendChild(this.deleteButton);
			this.deleteButton.onclick = delFunc;
		}

		if (renameFunc!=null)
		{
			this.renameButton = document.createElement("button"); 
			this.renameButton.classList.add("listElts");
			this.renameButton.classList.add("renames");
			this.renameButton.innerText = "Renommer";
			this.renameButton.type = "button";
			this.div.appendChild(this.renameButton);
			this.renameButton.onclick = renameFunc;
		}
		
		if (openFunc!=null)
		{
			this.openButton = document.createElement("button"); 
			this.openButton.classList.add("listElts");
			this.openButton.classList.add("opens");
			this.openButton.innerText = "Ouvrir";
			this.openButton.type = "button";
			this.div.appendChild(this.openButton);
			this.openButton.onclick = openFunc;
		}

		parent.appendChild(this.div);

	}
}