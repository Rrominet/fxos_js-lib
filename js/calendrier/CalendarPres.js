MONTHS = [
    "Janvier", 
    "Février", 
    "Mars", 
    "Avril", 
    "Mai", 
    "Juin",
    "Juillet", 
    "Août", 
    "Septembre", 
    "Octobre", 
    "Novembre", 
    "Décembre"
];

class CalendarPres
{
    //infos is a js object
    //type could be 'conference' or 'porte-ouverte'
    constructor(parent, infos=null, type = "conference")
    {
        this.parent = parent; 
        this.type = type;
        if (!infos)
        {
            getJson("infos.json", (json) => this.load(json));
            this.interface();
        }
        else 
        {
            this.interface();
            this.load(infos);
        }
    }

    interface()
    {
        this.div = this.parent.newNode("div", "calendar-pres");
        if (this.type == "porte-ouverte")
        {
            this.div.calendarC = this.div.newNode("div", "calendar-infos");
            this.div.calendar = this.div.calendarC.newNode("div", "calendar");
            this.div.infos = this.div.calendarC.newNode("div", "infos"); 
        }
        else 
        {
            this.div.calendar = this.div.newNode("div", "calendar");
            this.div.infos = this.div.newNode("div", "infos"); 
        }
        this.div.calendar.month = this.div.calendar.newNode("div", "month");
        this.div.calendar.day = this.div.calendar.newNode("div", "day");
        this.div.infos.date = this.div.infos.newNode("div", "date");
        if (this.type == "conference")
        {
            this.div.infos.ul = this.div.infos.newNode("ul");
            this.div.infos.ul.newTitle("li", "En direct et en ligne<br>(Le lien te sera envoyé directement par email)");
            this.div.infos.ul.newTitle("li", "Une rediffusion sera disponible <u>seulement</u> pour les inscrits");
            this.div.infos.ul.newTitle("li", "Durée : 1 heure");
            this.div.chrono = this.div.newNode("div", "chrono-parent");
            this.div.chrono.label = this.div.chrono.newTitle("label", "La conférence commence dans : ");
        }

        else if (this.type == "porte-ouverte")
        {
            this.div.chrono = this.div.newNode("div", "chrono-parent");
            this.div.chrono.label = this.div.chrono.newTitle("label", "Les portes ouvertes commencent dans : ");
        }
    }

    load(json)
    {
        this.date = json.date;
        if (typeof(this.date) == "string")
        {
            this.day = this.date.split("/")[0];
            this.month = this.date.split("/")[1];
            this.month = parseInt(this.month) - 1; 
            this.month = MONTHS[this.month];
            this.time = json.time;
            this.time = this.time.toLowerCase();

            if (this.div)
            {
                this.div.calendar.month.innerText = this.month; 
                this.div.calendar.day.innerText = this.day;
                this.div.infos.date.innerHTML = this.day + " " + this.month + " à " + this.time;
                let date = Date.fromStr(this.date); 
                date.setHours (this.time.split("h")[0]);
                date.setMinuts (this.time.split("h")[1]);
                this.chrono = Chrono.fromEndDate(date, this.div.chrono);
            }
        }

        else 
        {
            this.day = this.date.getDate();
            this.month = MONTHS[this.date.getMonth()];

            if (this.div)
            {
                this.div.calendar.month.innerText = this.month;
                this.div.calendar.day.innerText = this.day;
                this.div.infos.date.innerHTML = this.day + " " + this.month + " à " + this.date.getHours() + "h" + this.date.getMinutes().toString().padStart(2, "0");
                this.chrono = Chrono.fromEndDate(this.date, this.div.chrono);
            }
        }
    }
}
