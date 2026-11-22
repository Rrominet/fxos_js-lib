class ImageSelector extends mlWindow
{
    //onImgsSelected is function that take the imgs url/files as argument 
    constructor(
        WindowsManager, 
        onImgSelected,
        title = "Sélectionner des images", 
        draggable=true, 
        btnText="Valider")
    {
        super(WindowsManager, title, null, draggable);
        WindowsManager.windows.push(this);
        this.div.classList.add("img-selector");
        this.button = this.footer().newButton(btnText, () => this.onValid());
        this.onImgSelected = onImgSelected;
        this.interface();
    }

    interface()
    {
        const c = this.content; 
        c.local = c.newNode("div", "local");
        c.local.btn = c.local.newButton("Choisir sur le PC...", () => c.local.input.click());
        c.local.input = c.local.newNode("input");
        c.local.input.type = "file";
        c.local.input.multiple = "multiple";
        c.local.input.hide();
        c.local.infos = c.local.newNode("label", "infos");
        c.local.infos.hide();
        c.newTitle("div", "OU");
        c.dist = c.newNode("div", "dist");
        c.dist.input = c.dist.addInput("text", "Le lien HTTP vers l'image");

        c.local.input.addEventListener("change", () => this.onLocalChange());
        this.center();
    }

    onLocalChange()
    {
        scripts.import(FM + "/js/imgs.js").then(() => 
            {
                for (const f of this.content.local.input.files)
                {
                    const r = new FileReader;
                    r.addEventListener("load", () => 
                        {
                            imgs.converted(r.result, "webp", 50, (iurl) => 
                                {
                                    this.content.local.infos.innerHTML = this.content.local.input.files.length + " fichiers sélectionnés.";
                                    this.content.local.infos.show();
                                    if (this.onImgSelected)
                                        this.onImgSelected(iurl);
                                });
                        });
                    r.readAsDataURL(f);
                }
            });
    }

    onValid()
    {
        this.close();
        if (this.content.dist.input.value != "")
            this.onImgSelected(this.content.dist.input.value);
    }
}
