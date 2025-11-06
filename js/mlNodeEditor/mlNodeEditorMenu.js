class mlNodeEditorMenu
{
	constructor()
	{
		this.interface(); 
		this.setEvents();
	}

	interface()
	{
		this.file = new Menu(B, "File");
		this.file.new = new MenuButton(this.file, "New", this.new.bind(this));
		this.file.open = new MenuButton(this.file, "Open", this.open.bind(this));
		this.file.save = new MenuButton(this.file, "Save", this.save.bind(this));
		this.file.save = new MenuButton(this.file, "Save as...", this.saveAs.bind(this));
        this.file.separator();
        this.file.openLocal = new MenuButton(this.file, "Open local version...", () => NodeEditor.openLocal())
        this.file.separator();
        this.file.saveLocalFile = new MenuButton(this.file, "Save in Local File...", () => {
            download(this.menuBar.content.fileName.innerText, JSON.stringify(NodeEditor.serialize()));
        });
        this.file.separator();
        this.file.idDebug = new MenuButton(this.file, "Unique ID for all..", () => {
            NodeEditor.createAUniqIdForEveryOne();
        })

		this.menuBar = new MenuBar(B);
		this.menuBar.add(this.file); 

		this.setFileName();
	}

	setFileName()
	{
		this.menuBar.content.fileName = this.menuBar.content.newNode("div", "fileName"); 
	}

	setEvents()
	{
        B.addEventListener("keydown", (e)=> this.keyboard(e));
	}

    keyboard(e)
    {
        let c = e.keyCode;
        if (c == 79 && e.ctrlKey)
        {
            e.preventDefault(); 
            this.open();
        }

        if (c == 83 && e.ctrlKey && e.shiftKey)
        {
            e.preventDefault(); 
            this.saveAs()
        }
    }

	open()
	{
		mlNodeEditorOpen.get(OPEN);
	}

	new()
	{
		NodeEditor.clear();
	}

	save()
	{
		NodeEditor.save(this.menuBar.content.fileName.innerText);
	}

	saveAs()
	{
		mlNodeEditorOpen.get(SAVE_AS);
	}
}
