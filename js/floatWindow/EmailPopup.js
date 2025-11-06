class EmailPopup
{
	//titre = visual title on the popup
	// content = Node object 'll be after the title
	// callback = function executed on the button click 
	constructor (titre, content, callback, textButton="", footerHtml=null)
	{
		this.titre = titre; 
		this.content = content; 
		this.callback = callback;
		this.footerHtml = footerHtml;
		this.textButton = textButton;
		this.loading = false;
		this.interface();
		this.close();
	}

	interface() 
	{
		this.mask = B.newNode("div", "popup mask"); 
		this.div = this.mask.newNode("div", "popup email"); 
		this.div.close = this.div.newButton("Fermer", () => this.close(), "close");
		this.div.titre = this.div.newTitle("h2", this.titre); 
		this.div.content = this.content; 
		this.div.appendChild(this.content);
		this.div.form = this.div.newNode("div", "form"); 
		this.div.form.prenom = this.div.form.labelInput("text", "Ton Prénom : ", "", [], "", [], "Ton prénom");
		this.div.form.email = this.div.form.labelInput("email", "Ton Email : ", "", [], "", [], "ton-email@gmail.com");
		this.div.form.prenom.setValue(prenom())
		this.div.form.email.setValue(email())
		this.div.button = this.div.newButton(this.textButton, this.callback);
		this.div.button.disabled = true;
		this.div.footer = this.div.newNode("div", "footer"); 
		if (this.footerHtml)
			this.div.footer.innerHTML = this.footerHtml; 
		else 
		{
			this.div.footer.innerHTML = `Tu recevras un email <i>(contenant le lien vers la vidéo)</i> par jour. Ensuite, tu recevras ma newsletter hebdomadaire. Ton email, et tout autre information que tu rentrerais sur ce site ne seront <u>jamais</u> cédées à un tiers.<br>
			<br>
			<b>Tu peux te désinscrire à tout moment en 1 clic depuis n'importe lequel de mes emails.</b>`
		}

		this.setEmailInterval();
	}

	email()
	{
		return this.div.form.email.getValue();
	}

	prenom()
	{
		return this.div.form.prenom.getValue();
	}

	check()
	{
		if (this.loading)
		{
			this.div.button.disabled = true; 
			this.div.button.innerHTML = "...";
			return;
		}

		else
		{
			this.div.button.innerHTML = this.textButton;
		}

		if (this.email().includes(".") && 
			this.email().includes(".") && 
			!this.email().includes(" ") && 
			this.prenom())
		{
			this.div.button.disabled = false;
			return;
		}
		
		this.div.button.disabled = true;
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

	close()
	{
		this.mask.style.display = "none";
	}

	show()
	{
		this.mask.style.display = "block";
	}

    //html cound be a block
	setResult(html)
	{
		this.div.button.remove(); 
		this.div.footer.remove();
        if (typeof(html) == "string")
        {
            let n = this.div.newNode("div", "answer"); 
            n.innerHTML = html;
        }
        else 
            this.div.appendChild(html);
	}

	setError(html)
	{
		if (!this.div.error)
			this.div.error = this.div.newNode("div", "error"); 
		this.div.error.innerHTML = html;
	}
}
