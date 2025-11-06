class footer
{
    static get mlt()
    {
        return `
<br>
À bientôt *prenom* ! :)<br>
Du fond du cœur,<br>
<br>
<img src="https://teach.motion-live.com/images/emails/profil-128.jpg" alt="Romain Gilliot" class="edit" style="float: left; margin: 26px; padding: 3px; box-shadow: rgba(0, 0, 0, 0.41) 1px 1px 3px; border-radius: 74px; background-color: rgb(0, 136, 73);"><br>
Romain Gilliot<br>
<b>
+33 6 80 56 42 16</b><br>
<br>
<b><a href="https://teach.motion-live.com">Motion Live Teach</a></b><br>
Créateur de la plateforme et formateur.<br>
<br>
<br>
<i>Si tu souhaites ne plus <u>jamais</u> recevoir d'emails de ma part, tu peux cliquer <a href="https://teach.motion-live.com/desabonnement.php?prenom=*prenom*&amp;email=*email*">ici</a>.</i>
`;
    }

    static get h3d2()
    {
        return `
<br>
À bientôt *prenom* ! :)<br>
Du fond du cœur,<br>
<br>
<img src="https://teach.motion-live.com/images/emails/profil-128.jpg" alt="Romain Gilliot" class="edit" style="float: left; margin: 26px; padding: 3px; box-shadow: rgba(0, 0, 0, 0.41) 1px 1px 3px; border-radius: 74px; background-color: rgb(0, 136, 73);"><br>
Romain Gilliot<br>
<b>
+33 6 80 56 42 16</b><br>
<br>
<b><a href="https://h3d2.school">École H3D2</a></b><br>
Directeur.<br>
<br>
<br>
<i>Si tu souhaites ne plus <u>jamais</u> recevoir d'emails de ma part, tu peux cliquer <a href="https://teach.motion-live.com/desabonnement.php?prenom=*prenom*&amp;email=*email*">ici</a>.</i>`
    }

    static get spacewarp()
    {
        return `<br>
Du fond du cœur,<br>
<img src="https://teach.motion-live.com/images/emails/profil-128.jpg" alt="Romain Gilliot" style="float: left; margin: 20px; color: rgb(18, 125, 157); border: 4px solid;">
<br>
<br>
<span>Romain Gilliot</span>
<br>
<b>06 80 56 42 16</b><br><br>
<b><a href="https://spacewarp.fr/" style="color: rgb(18, 125, 157);">SpaceWarp</a></b>
<br>
Créateur et porteur du projet.<br>
<br>
<br>
<i>Si tu ne veux plus entendre parler de SpaceWarp, clique <a href="https://spacewarp.fr/not-interested.php?email=*email*">ici</a>.</i>`
    }

    static get sw(){return footer.spacewarp;}
}
class EmailContent
{
	constructor (parentNode) 
	{
		this.node = parentNode;

		this.createInterface();
		this.setEvents();
	}

	createInterface()
	{
		this.content = B.newNode("div", ["EmailContent", "content"]);
		this.content.header = this.content.newNode("div", "head");
		this.content.header.close = this.content.header.newButton("Close", this.hide.bind(this), "close");
		this.content.objectContainer = this.content.newNode("div", "object");
		this.content.objectContainer.object = this.content.objectContainer.labelInput("text", "Object : ");
		this.content.objectContainer.hide();
        this.content.footerType = this.content.labelSelect([
            ["None", "none"],
            ["Motion Live Teach", "mlt"],
            ["H3D2", "h3d2"],
            ["Spacewarp", "sw"],
        ], "Footer : ");
        this.content.footerType.addEvent("change", () => this.updateFooter());
        this.content.hidden = true;
		this.createTypeZone();
	}

	object()
	{
		return this.content.objectContainer.object.getValue();
	}

	setObject(str)
	{
		this.content.objectContainer.object.setValue(str);
	}

	showObject()
	{
		this.content.objectContainer.style.display = "block";
	}

	createTypeZone()
	{
		this.content.writer = new TxtWriter(this.content);
        this.content.writer.side = TxtWriter.LEFT;
        this.content.writer.canComment = true;
	}

	setEvents()
	{
		
	}

	body()
	{
		if (this.window != null)
			return this.window.document.body;

		return null;
	}

	head()
	{
		if (this.window != null)
			return this.window.document.head;

		return null;
	}

	show() 
	{
		this.content.hidden = false; 
	}

	hide()
	{
		this.content.hidden = true; 
        this.content.writer.hideComments();
	}

	toggle()
	{
		if (this.content.hidden)
			this.show(); 
		else 
			this.hide();
	}

    footerValue()
    {
        return this.content.footerType.getValue();
    }

    updateFooter()
    {
        const elmt = this.content.writer.div.writer;
        let f = elmt.querySelector("div.footer");
        if (!f && this.footerValue() != "none")
            f = elmt.newNode("div", "footer");

        if (this.footerValue() == "none")
        {
            if (f)
                f.remove();
        }

        else 
            f.innerHTML = footer[this.footerValue()];
        
        this.content.writer.updateToCode();
    }

}
