class Calendrier
{
	constructor (name, parent = B, time=20, type="formation") 
	{
        this.lang = "fr";
        if (location.href.includes("dev-") || location.href.includes("localhost"))
            this.url = "http://dev-calendar.motion-live.com";
        else 
            this.url = "https://calendar.motion-live.com";

        if (location.href.includes("-en") || location.href.includes("_en"))
            this.lang = "en";

		this.name = name;
        this.time = time;
        this.type = type;
        if (this.time>=60)
            this.time = 0;
		this.parent = parent;
		this.todayDate = new Date().getOnlyDay();
		this.setInterface();
		this.setDaysDate(this.todayDate);

		this.takens = [];
        this.weekOffset = 0; //0 = current week

		addEventListener("DOMContentLoaded", this.placeRightButton.bind(this));
		addEventListener("load", this.placeRightButton.bind(this));
		addEventListener("resize", this.placeRightButton.bind(this));

		this.rdv = null;
		if (!window.WM)
        	this.wm = window.WM = new WindowsManager;
        else 
        	this.wm = window.WM;

        this.getTakens(() => 
            {
                this.getTakenRdvs((ls) => this.addToTaken(ls));
            });
	}

	setDaysDate(dayInWeek)
	{
		this.days = [];
		let mon = dayInWeek.getMonday(); 

		this.days.push(new Day(this.table, mon, this)); 
		
		for (let i = 1; i<7; i++)
		{
			let d = new Date (mon.getTime() + (24*3600*1000)*i); 
			this.days.push(new Day(this.table, d, this));
		}

		let dh = this.tableHeader.tBodies[0].rows[0].cells;

		for (let i=0; i<7; i++)
		{
			dh[i].innerText += " " + this.days[i].date.getDate().toString().padStart(2, '0');
			dh[i].innerText += "/" + (this.days[i].date.getMonth() + 1).toString().padStart(2, '0');
		}
	}

	setInterface() 
	{
		this.div = D.createElement("div"); 
		this.div.classList.add("calendars");
		this.parent.appendChild(this.div);
		this.setButtons();
        this.div.tableContainer = this.div.newNode("div", "table-container");
		this.setHeader();
		this.setDaysTable();
		this.placeRightButton();
        if (this.name != "GERANT")
        {
            if (this.lang == "fr")
                this.footer = this.div.newTitle("p", "Tu n'arrives pas à trouver de créneau qui te convienne ? <br>Envoie-nous directement un email à <a href='mailto:romain.gilliot@motion-live.com'>romain.gilliot@motion-live.com</a> pour que l'on trouve une solution.");
            else if (this.lang == "en")
                this.footer = this.div.newTitle("p", "Can't find a time slot that works for you? <br>Send us an email directly at <a href='mailto:romain.gilliot@motion-live.com'>romain.gilliot@motion-live.com</a> so we can find a solution.");
        }
    }

	setButtons() 
	{
		this.leftButton = D.createElement("button"); 
		this.leftButton.classList.add("calandars");
		this.leftButton.classList.add("buttons");
		this.leftButton.classList.add("lefts");
		this.leftButton.onclick = this.toLeft.bind(this);
		this.leftButton.innerHTML = "<img src='" + MLT + "/mini-formations/images/arrow-left.png' class='mFormations' />";
		this.div.appendChild(this.leftButton);

		this.rightButton = D.createElement("button"); 
		this.rightButton.classList.add("calandars");
		this.rightButton.classList.add("buttons");
		this.rightButton.classList.add("rights");
		this.rightButton.onclick = this.toRight.bind(this);
		this.rightButton.innerHTML = "<img src='" + MLT + "/mini-formations/images/arrow-left.png' class='mFormations' />";
		this.div.appendChild(this.rightButton);
	}
	placeRightButton() 
	{
        this.rightButton.style.left = "initial";
    }

	setHeader() 
	{
        this.tableHeader = this.div.tableContainer.newNode("table", "headers");
        this.setTxtFromWidth();
		for (let c of this.tableHeader.tBodies[0].rows[0].cells) 
			c.style.width = (100.0/7.0) + "%";
	}

	setDaysTable()
	{
        this.table = this.div.tableContainer.newTitle("table", "<tbody></tbody>");
	}

	toLeft()
	{
		this.addWeeks(-1);
	}

	toRight()
	{
		this.addWeeks(1);
	}

	clean() 
	{
		this.days = [];
        this.tableHeader.remove();
        this.table.remove();
	}

	addWeeks(wnb)
	{
        this.weekOffset += wnb;
		let newMonday = new Date(this.days[0].date.getTime()); 
		newMonday.setDate(newMonday.getDate() + 7*wnb);

		this.clean();

		this.setHeader();
		this.setDaysTable();
		this.setDaysDate(newMonday);
        if (this.footer)
            this.footer.moveToEnd();

        this.replaceTaken(this.takens);
		this.getTakenRdvs((ls) => this.addToTaken(ls));
	}

    //e could be an error message or a parsed json
    error(e)
    {
        //TODO : make it visible for the user
        console.error(e);
    }

    //cb take a parsed json
    request(cmd, data, cb)
    {
        const xhr = HttpRequest();
        const url = this.url + "/" + cmd;
        data["name"] = this.name;
        data["duration"] = this.time * 60;

        xhr.sendJsonAsPost(url, data, (xhr) => 
            {
                try
                {
                    const res = JSON.parse(xhr.responseText);
                    if (!res.success)
                        this.error(res);
                    else 
                    {
                        if (cb)
                            cb(res);
                    }
                }
                catch(e)
                {
                    this.error(e);
                }
            });
    }

    static  utcOffset()
    {
        return new Date().getTimezoneOffset();
    }

    static parseTime(time)
    {
        let sign = time[0]
        let num = time.slice(1);
        num = parseInt(num);
        if (sign == "−")
            num *= -1;
        return num;
    }

    static currentOffsetFromParis()
    {
        const now = new Date();
        let frs = now.toLocaleTimeString("fr-FR", {timeZone : "Europe/Paris", timeStyle : "long"});
        let fr_utc_offset = Calendrier.parseTime(frs.split("UTC").last());

        const localtz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let locals = now.toLocaleTimeString("fr-FR", {timeZone : localtz, timeStyle : "long"});
        let local_utc_offset = Calendrier.parseTime(locals.split("UTC").last());

        return local_utc_offset - fr_utc_offset;
    }

	sendRdv(hour)
	{
        this.request("create-rdv", {"email" : hour.email, "prenom" : hour.prenom, "localtime" : parseInt(hour.asEpochTime()), "utc-offset" : Calendrier.utcOffset(), "lang" : this.lang}, (res) => 
            {
                const d = D.createElement("div"); 
                if (this.lang == "fr")
                {
                    d.newTitle("p", prenom() + ", <b>ton rendez-vous a bien été validé</b>.<br>Tu dois avoir reçu un email de confirmation (envoyé à <i>" + email() + "</i>).<br><br>Celui-ci se fera via partage d'écran (Google Meet).<br><br>Si d'ici là tu as des questions, tu peux envoyer un email à l'adresse : <i>romain.gilliot@motion-live.com</i>.");
                }
                else if (this.lang == "en")
                {
                    d.newTitle("p", prenom() + ", <b>your appointment has been confirmed</b>.<br>You should have received a confirmation email (sent to <i>" + email() + "</i>).<br><br>This will be done via screen sharing (Google Meet).<br><br>If you have any questions in the meantime, you can send an email to: <i>romain.gilliot@motion-live.com</i>.");
                }
                if (this.name !="GERANT")
                    this.updateFrame(d);

                this.rdv.enableButton();

                this.takens.push({date : {time : hour.asEpochTime()}});
            });

        if (this.name !="GERANT")
        {
            const wd = D.createElement("div");
            if (this.lang == "fr")
                wd.newTitle("p", "Envoi de ton RDV en cours...<br>Encore un peu de patience :)");
            else if (this.lang == "en")
                wd.newTitle("p", "Booking your appointment in progress...<br>Just a little more patience :)"); 
            this.updateFrame(wd);
        }
        if (this.rdv)
        {
            this.rdv.showWithAnimation();
            this.rdv.disableButton();
        }
	}

    addToTaken(ls)
    {
        this.takens = this.takens.concat(ls);

        // should be refacto
		for (const t of this.takens)
		{
			for (const d of this.days)
			{
				for (let i=0; i<d.hours.length; i++)
				{
                    const h = d.hours[i];
                    const time = t.date.time;
					if (h.asEpochTime() - 1800 <= time && time <= h.asEpochTime() + 1800)
                    {
                        h.setTaken(true);
                        try
                        {
                            if (t.duration>3600)
                                d.hours[i+1].setTaken(true);
                            if (t.duration>7200)
                                d.hours[i+2].setTaken(true);
                            if (t.duration>10800)
                                d.hours[i+3].setTaken(true);
                            if (t.duration>14400)
                                d.hours[i+4].setTaken(true);
                            if (t.duration>18000)
                                d.hours[i+5].setTaken(true);
                            if (t.duration>21600)
                                d.hours[i+6].setTaken(true);
                            if (t.duration>25200)
                                d.hours[i+7].setTaken(true);
                            if (t.duration>28800)
                                d.hours[i+8].setTaken(true);
                            if (t.duration>32400)
                                d.hours[i+9].setTaken(true);
                            if (t.duration>36000)
                                d.hours[i+10].setTaken(true);
                            if (t.duration>39600)
                                d.hours[i+11].setTaken(true);
                            if (t.duration>43200)
                                d.hours[i+12].setTaken(true);
                            if (t.duration>46800)
                                d.hours[i+13].setTaken(true);
                            if (t.duration>50400)
                                d.hours[i+14].setTaken(true);
                            if (t.duration>54000)
                                d.hours[i+15].setTaken(true);
                            if (t.duration>57600)
                                d.hours[i+16].setTaken(true);
                            if (t.duration>61200)
                                d.hours[i+17].setTaken(true);
                            if (t.duration>64800)
                                d.hours[i+18].setTaken(true);
                            if (t.duration>68400)
                                d.hours[i+19].setTaken(true);
                            if (t.duration>72000)
                                d.hours[i+20].setTaken(true);
                        }catch(e){continue;}
                    }
				}
			}
		}
    }

	replaceTaken(ls)
	{
		this.takens = ls; 

		for (const t of this.takens)
		{
			for (const d of this.days)
			{
				for (let i=0; i<d.hours.length; i++)
				{
                    const h = d.hours[i];
                    const time = t.date.time;
					if (h.asEpochTime() - 1800 <= time && time <= h.asEpochTime() + 1800)
                    {
                        h.setTaken(true);
                        try
                        {
                            if (t.duration>3600)
                                d.hours[i+1].setTaken(true);
                            if (t.duration>7200)
                                d.hours[i+2].setTaken(true);
                            if (t.duration>10800)
                                d.hours[i+3].setTaken(true);
                            if (t.duration>14400)
                                d.hours[i+4].setTaken(true);
                            if (t.duration>18000)
                                d.hours[i+5].setTaken(true);
                            if (t.duration>21600)
                                d.hours[i+6].setTaken(true);
                            if (t.duration>25200)
                                d.hours[i+7].setTaken(true);
                            if (t.duration>28800)
                                d.hours[i+8].setTaken(true);
                            if (t.duration>32400)
                                d.hours[i+9].setTaken(true);
                            if (t.duration>36000)
                                d.hours[i+10].setTaken(true);
                            if (t.duration>39600)
                                d.hours[i+11].setTaken(true);
                            if (t.duration>43200)
                                d.hours[i+12].setTaken(true);
                            if (t.duration>46800)
                                d.hours[i+13].setTaken(true);
                            if (t.duration>50400)
                                d.hours[i+14].setTaken(true);
                            if (t.duration>54000)
                                d.hours[i+15].setTaken(true);
                            if (t.duration>57600)
                                d.hours[i+16].setTaken(true);
                            if (t.duration>61200)
                                d.hours[i+17].setTaken(true);
                            if (t.duration>64800)
                                d.hours[i+18].setTaken(true);
                            if (t.duration>68400)
                                d.hours[i+19].setTaken(true);
                            if (t.duration>72000)
                                d.hours[i+20].setTaken(true);
                        }catch(e){continue;}
                    }
				}
			}
		}
	}

    weekStart()
    {
        //thank you chatGPT
        const tmp = new Date();
        const today = new Date(tmp.getTime() + this.weekOffset * 7 * 24 * 3600 * 1000); // If no date is provided, use the current date
        const _day = today.getDay(); // Get the current day of the week (0 for Sunday, 1 for Monday, etc.)
        const diff = (_day === 0 ? -6 : 1) - _day; // Calculate the difference to Monday
        const monday = new Date(today.setDate(today.getDate() + diff)); // Adjust to Monday
        monday.setHours(0, 0, 0, 0); // Set time to the start of the day
        return monday;
    }

    weekEnd()
    {
        const _d = new Date(this.weekStart().getTime());
        _d.setDate(_d.getDate() + 7);
        return _d;
    }

    //cb is on the list returned by the request
    getTakenRdvs(cb)
    {
        this.request("list-rdvs", {"start" : this.weekStart().getTimePhp(), "end" : this.weekEnd().getTimePhp()}, (res) =>
        {
            if ("data" in res && res.data)
                cb(res.data);
            else 
                cb([]);
        });
    }

    //takens are the period occupied by the GERANT
    getTakens(cb)
    {
        this.request("taken", {}, (res) => {
            const taken = [];
            for (const t of res.data)
                taken.push({"date" : {"time": t.start} , "duration" : (t.end - t.start)});
            this.replaceTaken(taken);

            if (cb)
                cb();
        });
    }

	updateFrame(div, onClick=null, buttonTxt = "OK")
	{
        this.wm.loadDependencies(() =>
            {
                if (!this.rdv) 
                {
                    if (this.type == "formation")
                    {
                        if (this.lang == "fr")
                            this.rdv = this.wm.message(div, onClick, "Prise de rendez-vous (durée : 20 min)");
                        else if (this.lang == "en")
                            this.rdv = this.wm.message(div, onClick, "Book a meeting (duration : 20 min)");
                    }
                    else if (this.type == "ecole") 
                    {
                        if (this.lang == "fr")
                            this.rdv = this.wm.message(div, onClick, "Prise de rendez-vous (durée : 30 min à 1 heure)");
                        else if (this.lang == "en")
                            this.rdv = this.wm.message(div, onClick, "Book a meeting (duration : 30 min to 1H)");
                    }
                    this.rdv.mask(true);
                }
                else 
                {
                    this.rdv.setContent(div);
                    this.rdv.show();
                }
                this.rdv.setButtonTxt(buttonTxt);
            }, false);
	}

	setWeekTaken(bool)
	{
		for (let d of this.days)
			d.setDayTaken(bool, false);
	}

	deleteAll() 
	{
		if (confirm("Êtes-vous sûr de vouloir supprimer tous les rdvs pris ?"))
		{
			for (let d of this.days)
				d.setDayTaken(false, false);

			this.takens = []; 
			this.save();
		}
	}

    setTxtFromWidth()
    {
        if (innerWidth <=840)
        {
            this.tableHeader.innerHTML = "<tbody></tbody>"; 
            let html = "<tr>";
            if (this.lang == "fr")
            {
                html += "<th>Lun</th>";
                html += "<th>Mar</th>";
                html += "<th>Mer</th>";
                html += "<th>Jeu</th>";
                html += "<th>Ven</th>";
                html += "<th>Sam</th>";
                html += "<th>Dim</th>";
            }
            else if (this.lang == "en")
            {
                html += "<th>Mon</th>";
                html += "<th>Tue</th>";
                html += "<th>Wed</th>";
                html += "<th>Thu</th>";
                html += "<th>Fri</th>";
                html += "<th>Sat</th>";
                html += "<th>Sun</th>";
            }
            html += "</tr>";
            this.tableHeader.tBodies[0].innerHTML = html;
        }
        else
        {
            this.tableHeader.innerHTML = "<tbody></tbody>"; 
            let html = "<tr>";
            if (this.lang == "fr")
            {
                html += "<th>Lundi</th>";
                html += "<th>Mardi</th>";
                html += "<th>Mercredi</th>";
                html += "<th>Jeudi</th>";
                html += "<th>Vendredi</th>";
                html += "<th>Samedi</th>";
                html += "<th>Dimanche</th>";
            }
            else if (this.lang == "en")
            {
                html += "<th>Monday</th>";
                html += "<th>Tuesday</th>";
                html += "<th>Wednesday</th>";
                html += "<th>Thursday</th>";
                html += "<th>Friday</th>";
                html += "<th>Saturday</th>";
                html += "<th>Sunday</th>";
            }
            html += "</tr>";
            this.tableHeader.tBodies[0].innerHTML = html;
        }
    }
}
