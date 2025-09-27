class Day
{
	constructor(table, date, calandar)
	{
		this.date = new Date(date).getOnlyDay();
		this.table = table;
		this.calandar = calandar;
        this.range = {first: 9, last: 20};
		this.setInterface();
		this.setHours();

		if (this.calandar.name == "GERANT")
		{
			this.ctx = new ContextMenu(this.tr);
			this.ctx.setDayTaken = new MenuButton(this.ctx, "Journée non disponible", function ()
				{
					this.setDayTaken(true);
				}.bind(this));
			this.ctx.setDayFree = new MenuButton(this.ctx, "Journée disponible", function ()
				{
					this.setDayTaken(false);
				}.bind(this));
			this.ctx.setWeekTaken = new MenuButton(this.ctx, "Semaine non disponible", function ()
				{
					this.calandar.setWeekTaken(true);
				}.bind(this));
			this.ctx.setWeekFree = new MenuButton(this.ctx, "Semaine disponible", function ()
				{
					this.calandar.setWeekTaken(false);
				}.bind(this));
			this.ctx.clean = new MenuButton(this.ctx, "Supprimer tout les RDVS", function ()
				{
					this.calandar.deleteAll();
				}.bind(this));
		}
	}

    localRange()
    {
        return {first:this.range.first + Calendrier.currentOffsetFromParis(), last: this.range.last + Calendrier.currentOffsetFromParis()};
    }

	setInterface() 
	{
		this.tr = D.createElement("tr");
		this.tr.style.width = (100/7.0) + "%";

		this.table.tBodies[0].appendChild(this.tr);
	}

	setHours() 
	{
		this.hours = []; 
        const r = this.localRange();
		for (let i=r.first; i<=r.last; i++)
            this.hours.push(new Hour(this, i));
	}

	setDayTaken(bool, save=true)
	{
		for (let h of this.hours)
			h.sendTaken(bool);
	}
}
