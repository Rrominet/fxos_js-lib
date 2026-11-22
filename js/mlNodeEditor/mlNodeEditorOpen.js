class mlNodeEditorOpen extends FloatWindow
{
	constructor(type=OPEN)
	{
		super();
		this.type = type;
		this.addInterface();
	}

	interface()
	{ 
		super.interface(false);
		this.div.hidden = false;
		this.content.list = new UIList(this.content);
	}

	addInterface()
	{
		if (this.type == SAVE_AS)
			this.content.newName = this.content.labelInput("text", "New File : ");

		this.footer.buttons = this.footer.newNode("div", "buttons"); 
		if (this.type == OPEN)
			this.footer.buttons.open = this.footer.buttons.newButton("Open", this.open.bind(this), "open");
		else if (this.type == SAVE_AS)
			this.footer.buttons.save = this.footer.buttons.newButton("Save as", this.saveAs.bind(this), "save");
	}

	setEvents()
	{
		super.setEvents();
	}

	static get(type=OPEN)
	{
		if (type == OPEN)
		{
			if (typeof(NodeEditor.menu.openWindow) == "undefined")
			{
				NodeEditor.menu.openWindow = new mlNodeEditorOpen(type);
				NodeEditor.menu.openWindow.read();
			}
			else
			{
				NodeEditor.menu.openWindow .div.hidden = false;
				NodeEditor.menu.openWindow.read();
			}
		}
		else if (type == SAVE_AS)
		{
			if (typeof(NodeEditor.menu.saveAsWindow) == "undefined")
			{
				NodeEditor.menu.saveAsWindow = new mlNodeEditorOpen(type);
				NodeEditor.menu.saveAsWindow.read();
			}
			else
			{
				NodeEditor.menu.saveAsWindow .div.hidden = false;
				NodeEditor.menu.saveAsWindow.read();
			}
		}
	}

	read()
	{
		let xhr = HttpRequest(); 
		let url = FM + "/php/mlNodeEditor/ajax.php";
		let params = [
			["function", "readFiles"]
		];

		let func = function (xhr)
		{
			let res = xhr.responseText.split("//FILE_NAME//");
			res.pop();
			for (let name of res)
			{
				let file = new mlFile(name);
				this.content.list.add(file);
			}
		}.bind(this);

		xhr.sendListAsPost(url, params, func);
		this.content.list.clear();
	}

	open()
	{
		for (let f of this.content.list.elmts)
		{
			if (f.div.classList.contains("selected"))
			{
				NodeEditor.read(f.div.name.innerText);
				this.hide();
				return;
			}
		}
	}

	saveAs()
	{
		for (let f of this.content.list.elmts)
		{
			if (f.div.classList.contains("selected"))
			{
				NodeEditor.save(f.div.name.innerText);
				this.hide();
				return;
			}
		}

		if (this.content.newName.getValue() != "")
		{
			NodeEditor.save(this.content.newName.getValue());
			this.hide();
			return;
		}
	}
}