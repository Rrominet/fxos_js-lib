class EmailPopup extends MessageWindow
{
    constructor(WindowsManager, title, content, onButton, button = null, footer = null)
    {
        super(WindowsManager, title, content, false, false);
        this.textButton = button;
        this.callback = onButton;
        this.setElmt(button, this.button);
        this.setTitle(title);
        this.footer().append(footer);
        this.createForm();
        this.button.disabled = true;
        this.addEventOnButton(this.callback);
        this.setEmailInterval();
    }

    createForm()
    {
		this.content.form = this.content.newNode("div", "form"); 
        if (this.wm.lang == "fr")
        {
            this.content.form.prenom = this.content.form.labelInput("text", "Ton Prénom : ", "", [], "", [], "Ton prénom");
            this.content.form.email = this.content.form.labelInput("email", "Ton Email : ", "", [], "", [], "ton-email@gmail.com");
        }
        else if (this.wm.lang == "en")
        {
            this.content.form.prenom = this.content.form.labelInput("text", "Your firstname : ", "", [], "", [], "Romain");
            this.content.form.email = this.content.form.labelInput("email", "Your email address : ", "", [], "", [], "your-email@gmail.com");
        }
		this.content.form.prenom.setValue(prenom())
		this.content.form.email.setValue(email())
    }

	setError(html)
	{
		if (!this.div.error)
			this.div.error = this.div.newNode("div", "error"); 
		this.setElmt(html, this.div.error);
	}

	setResult(html)
	{
		this.button.remove(); 
		this.footer().remove();
        if (typeof(html) == "string")
        {
            let n = this.div.newNode("div", "answer"); 
            n.innerHTML = html;
        }
        else 
            this.div.appendChild(html);
	}

	setEmailInterval()
	{
		this.handler = setInterval(this.check.bind(this), 250);
	}

    removeHandler()
    {
        if (this.handler)
            clearInterval(this.handler);
    }

	check()
	{
		if (this.loading)
		{
			this.button.disabled = true; 
			this.button.innerHTML = "...";
			return;
		}

		else
			this.button.set(this.textButton);

		if (this.email().includes(".") && 
			this.email().includes(".") && 
			!this.email().includes(" ") && 
			this.prenom())
		{
			this.button.disabled = false;
			return;
		}
		
		this.button.disabled = true;
	}

	email()
	{
		return this.content.form.email.getValue();
	}

	prenom()
	{
		return this.content.form.prenom.getValue();
	}

    onKey(e)
    {
        if (e.key == "Enter")
        {
            e.preventDefault();
            this.button.click();
        }
    }
}
