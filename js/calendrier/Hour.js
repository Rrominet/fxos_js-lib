class Hour
{
	constructor(day, hour) 
	{
		this.day = day;
		this.calandar = day.calandar;
		this.th = D.createElement("th");
		this.th.onclick = this.onClick.bind(this); 
		this.day.tr.appendChild(this.th);
		this.setHour(hour);
	}

	setHour(hour)
	{
        let shour = hour;
        if (hour > 23)
            shour = hour - 24;

        if (this.calandar.time<60 && this.calandar.time != 0)
            this.th.innerHTML = "<b>" + String(shour).padStart(2, "0") + ":00</b> - <b>" + String(shour).padStart(2, "0") + ":" + String(this.calandar.time).padStart(2, "0") + "</b>";
        else 
            this.th.innerHTML = "<b>" + String(shour).padStart(2, "0") + ":00</b> - <b>" + String(shour + 1).padStart(2, "0") + ":" + String(this.calandar.time).padStart(2, "0") + "</b>";

		this.date = new Date(this.day.date.getTime() + hour * 1000 *3600); 
		let today = new Date(); 
		if(this.date.getTime() + 1000*3600<= today.getTime() + 3*1000*3600)
			this.setEnable(false);
		else 
			this.setEnable(true);
	}


    //seconds
    asEpochTime()
    {
        return this.date.getTime() / 1000;
    }

	setEnable(bool)
	{
		this.enable = bool; 
		if (bool)
			this.th.className = "enable";

		else 
			this.th.className = "disable";
	}

	getDayAsStr()
	{
        let days = [];
        if (this.calandar.lang == "fr")
        {
            days = [
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi",
                "Dimanche",
            ]; 
        }
        else if (this.calandar.lang == "en")
        {
            days = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ]; 
        }

		if (this.date.getDay() == 0)
			return days[6]; 
		else 
			return days[this.date.getDay() -1];
	}

	setTaken(bool)
	{
		this.enable = !bool;
		this.taken = bool; 

		if (bool)
			this.th.className = "disable";

		else 
			this.th.className = "enable";
	}

    //only GERANT
    sendTaken(bool)
    {
        this.setTaken(bool);
        if (bool)
            this.calandar.request("set-taken", {"start" : this.asEpochTime(), "end" : this.asEpochTime() + 3600});
        else 
            this.calandar.request("remove-taken", {"id" : this.takenId()});
    }

    takenId()
    {
        const start = parseInt(this.asEpochTime());
        const end = start + 3600;

        return start + "_" + end;
    }

	onClick()
	{

		if (this.calandar.name == "GERANT")
		{
			if (this.enable && !this.taken)
				this.sendTaken(true);

			else if (this.taken)
				this.sendTaken(false);

			return;
		}

		if (!this.enable)
			return;

		this.getPrenomNEmail(); // set internal atr this.prenom and this.email

		this.winContent = document.createElement("div"); ;
		this.winContent.classList.add("winContents");
		this.winContent.txt = this.winContent.newNode("p");
		if (this.prenom && this.email)
		{ 
            this.winContent.txt.innerHTML  = prenom() + ", <br>";
            if (this.calandar.type == "formation")
            {
                if (this.calandar.lang == "fr")
                    this.winContent.txt.innerHTML += "Un immense merci pour la pré-sélection de ton rendez-vous .<br>";
                else if (this.calandar.lang == "en")
                    this.winContent.txt.innerHTML += "A huge thank you for your pre-selection of your appointment.<br>";
            }

            else if (this.calandar.type == "ecole")
            {
                if (this.calandar.lang == "fr")
                    this.winContent.txt.innerHTML += "Tu as pré-selectionné ton créneau pour ton oral d'admission à H3D2.<br>";
                else if (this.calandar.lang == "en")
                    this.winContent.txt.innerHTML += "You have pre-selected your slot for your admission oral to H3D2.<br>";
            }

            this.winContent.txt.innerHTML += "<br>";
            {
                if (this.calandar.lang == "fr")
                    this.winContent.txt.innerHTML += "Ton rendez-vous est prévu le : <b>" + this.getDayAsStr() + "</b> " + this.date.toLocaleDateString() + " à <b>" + this.date.getHours() + ":00</b>";
                else if (this.calandar.lang == "en")
                    this.winContent.txt.innerHTML += "Your appointment is scheduled for : <b>" + this.getDayAsStr() + "</b> " + this.date.toLocaleDateString() + " at <b>" + this.date.getHours() + ":00</b>";
            }
        }
		else
		{
            if (this.calandar.lang == "fr")
            {
                this.winContent.txt.innerHTML = "Pour prendre RDV avec moi, merci de me partager ton prénom et de ton email."; 
                this.winContent.prenom = this.winContent.newInput("text", "prenom"); 
                this.winContent.prenom.value = prenom();
                this.winContent.prenom.placeholder = "Ton prénom";
                this.winContent.prenom.title = "Ton prénom.";
                this.winContent.newLine();
                this.winContent.email = this.winContent.newInput("email", "email"); 
                this.winContent.email.placeholder = "ton-email@gmail.com";
                this.winContent.email.title = "Ton email.";
                this.winContent.email.value = email();
                this.winContent.txt2 = this.winContent.newNode("p");
                this.winContent.txt2.innerHTML += "Ensemble, nous allons faire décoller tes projets, tes connaissances et ton savoir-faire !<br>";
                this.winContent.txt2.innerHTML += "<br>";
                this.winContent.txt2.innerHTML += "Ton rendez-vous est prévu le : <b>" + this.getDayAsStr() + "</b> " + this.date.toLocaleDateString() + " à <b>" + this.date.getHours() + ":00</b>";
            }
            else if (this.calandar.lang == "en")
            {
                this.winContent.txt.innerHTML = "To book an appointment with me, please share your name and email."; 
                this.winContent.prenom = this.winContent.newInput("text", "prenom"); 
                this.winContent.prenom.value = prenom();
                this.winContent.prenom.placeholder = "Your name";
                this.winContent.prenom.title = "Your name.";
                this.winContent.newLine();
                this.winContent.email = this.winContent.newInput("email", "email"); 
                this.winContent.email.placeholder = "your-email@gmail.com";
                this.winContent.email.title = "Your email.";
                this.winContent.email.value = email();
                this.winContent.txt2 = this.winContent.newNode("p");
                this.winContent.txt2.innerHTML += "Together, we will make your projects, your knowledge and your expertise come out of the box !<br>";
                this.winContent.txt2.innerHTML += "<br>";
                this.winContent.txt2.innerHTML += "Your appointment is scheduled for : <b>" + this.getDayAsStr() + "</b> " + this.date.toLocaleDateString() + " at <b>" + this.date.getHours() + ":00</b>";
            }
		}

        if (this.calandar.lang == "fr")
            this.calandar.updateFrame(this.winContent, ()=>this.onValidClick(), "Je valide mon RDV !");
        else if (this.calandar.lang == "en")
            this.calandar.updateFrame(this.winContent, ()=>this.onValidClick(), "I confirm my appointment !");
	}

    onValidClick()
    {
        if (this.enable)
        {
            this.setTaken(true);
            this.updatePrenomNEmail();
            this.calandar.sendRdv(this);
        }
    }

	getPrenomNEmail()
	{
		this.prenom = prenom();
		this.email = email();
	}

	updatePrenomNEmail()
	{
		if (!this.prenom || !this.email)
		{
			this.prenom = this.winContent.prenom.value;
			this.email = this.winContent.email.value;

            localStorage.setItem("prenom", this.prenom);
            localStorage.setItem("email", this.email);
		}
	}
}
