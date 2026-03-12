class Chrono
{
	constructor(formationIndex, parent=null, email="", fromData = true) // endTime in seconds since 1970
	{
		this.parent = parent;
		this.index = formationIndex;
		this.startDate = new Date();
		this.endDate = null;
		this.timeLeft = null;
		this.email = email;
        this.sendEvent = true;
		this.createInterface();
        if (fromData)
            this.sendXhrForTime();
    }

    static fromEndDate(date, parent=null)
    {
        let chrono = new Chrono(null, parent, "", false); 
        chrono.endDate = date; 
        chrono.timeLeft = chrono.endDate - chrono.startDate;
        if (chrono.timeLeft<0)
            chrono.timeLeft = 0;

        chrono.start();
        return chrono;
    }

    minify()
    {
        this.container.daysLabel.innerText = "j";
        this.container.houresLabel.innerText = "h";
        this.container.minutsLabel.innerText = "m";
        this.container.secondsLabel.innerText = "s";
    }

	sendXhrForTime() 
	{
		this.xhr = HttpRequest(); 

		let url = FM + "/php/chronoAjax.php"; 
		let params  = "formationIndex=" + this.index;
			params += "&email=" + this.email;
			params += "&function=getTimeEnd";

		let func = function (xhr)
		{
			this.endDate = Date.fromStr(xhr.responseText); 
			this.timeLeft = this.endDate - this.startDate;
			if (this.timeLeft<0)
				this.timeLeft = 0;

			this.start();

            if (window.h3d2_events && this.sendEvent)
                window.h3d2_events.emit("chrono-loaded");

		}.bind(this)

		this.xhr.sendAsPost(url, params, func);
	}

    remove()
    {
        this.stop();
        this.container.remove();
    }

	createInterface() 
	{
        this.container = D.createElement("div");
        this.container.classList.add("chrono");
        if (this.parent)
            this.parent.appendChild(this.container);

		this.container.days = this.container.newNode("span", ["nombre", "jours"]); 
		this.container.days.innerText = "00";
		this.container.daysLabel = this.container.newNode("span", "labels"); 
		this.container.daysLabel.innerText = " jours, ";

		this.container.houres = this.container.newNode("span", ["nombre", "heures"]); 
		this.container.houres.innerText = "00";
		this.container.houresLabel = this.container.newNode("span", "labels"); 
		this.container.houresLabel.innerText = " heures, ";

		this.container.minuts = this.container.newNode("span", ["nombre", "minutes"]); 
		this.container.minuts.innerText = "00";
		this.container.minutsLabel = this.container.newNode("span", "labels"); 
		this.container.minutsLabel.innerText = " minutes, ";

		this.container.seconds = this.container.newNode("span", ["nombre", "secondes"]); 
		this.container.seconds.innerText = "00";
		this.container.secondsLabel = this.container.newNode("span", "labels"); 
		this.container.secondsLabel.innerText = " secondes.";
	}

	updateInterface()
	{
		if (this.timeLeft <= 0)
		{
			this.setTime(["0","0","0","0"]); 
			this.stop(); 
			return;
		}

		let array = Date.asJHMS(this.timeLeft); 
		array.allToString();

		this.setTime(array);
		this.timeLeft -= 1000;  
	}

	setTime(numbers) // Params as String !!!! 
	{
		for (let i=0; i<numbers.length; i++)
		{
			if (numbers[i].length <2)
				numbers[i] = "0" + numbers[i];
		}

		this.container.days.innerText    = numbers[0];
		this.container.houres.innerText  = numbers[1];
		this.container.minuts.innerText  = numbers[2];
		this.container.seconds.innerText = numbers[3];
	}

	start() 
	{
		this.updateInterface();
		this.timer = setInterval(this.updateInterface.bind(this), 1000);
	}

	stop()
	{
		clearInterval(this.timer);
	}
}
