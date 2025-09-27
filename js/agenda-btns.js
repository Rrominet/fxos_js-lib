class google_agenda
{
    // date is a JS Date instance
    // if dateNull == null, its 1 houre later than date
    static url(title, location, date, dateEnd=null, description="")
    {
        if (!dateEnd) 
        {
            dateEnd = new Date(date);
            dateEnd.setHours(date.getHours() + 1);
        }

        const dateStr = date.toYYYYMMDDTHHmmssZ() + "/" + dateEnd.toYYYYMMDDTHHmmssZ();

        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}&details=${description}&location=${location}`
    }

    static button(btntxt, parent, title, location, date, dateEnd=null, description="")
    {
        const url = google_agenda.url(title, location, date, dateEnd, description);
        const div = D.createElement("div");
        div.newImg(ML + "/images/google-calendar.png");
        div.newTitle("label", btntxt);
        const button = parent.newButton(div, () => window.open(url), "google-agenda");
        return button;
    }
}

class outlook_calendar
{
    // date is a JS Date instance
    // if dateNull == null, its 1 houre later than date
    static url(title, location, date, dateEnd=null, description="")
    {
        if (!dateEnd) 
        {
            dateEnd = new Date(date);
            dateEnd.setHours(date.getHours() + 1);
        }

        const sdateStr = date.toYYYYMMDDTHHmmss();
        const edateStr = dateEnd.toYYYYMMDDTHHmmss();

        return "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=" + title + "&body=" + description + "s&location=" + location + "&startdt=" + sdateStr + "&enddt=" + edateStr;

    }

    static button(btntxt, parent, title, location, date, dateEnd=null, description="")
    {
        const url = outlook_calendar.url(title, location, date, dateEnd, description);
        const div = D.createElement("div");
        div.newImg(ML + "/images/outlook-calendar.png");
        div.newTitle("label", btntxt);
        const button = parent.newButton(div, () => window.open(url), "outlook-calendar");
        return button;
    }
}

class ical // apple
{
    // date is a JS Date instance
    // if dateNull == null, its 1 houre later than date
    static url(title, location, date, dateEnd=null, description="")
    {
        if (!dateEnd) 
        {
            dateEnd = new Date(date);
            dateEnd.setHours(date.getHours() + 1);
        }

        const sdateStr = date.toYYYYMMDDTHHmmss();
        const edateStr = dateEnd.toYYYYMMDDTHHmmss();

        const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:` + title + `
DTSTART;TZID=France/Paris:` + sdateStr + `
DTEND;TZID=France/Paris:` + edateStr + `
LOCATION:` + location + `
DESCRIPTION:` + description + `
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([ics], {type: "text/calendar"});
        return URL.createObjectURL(blob);
    }

    static button(btntxt, parent, title, location, date, dateEnd=null, description="")
    {
        const url = ical.url(title, location, date, dateEnd, description);
        const div = D.createElement("div");
        div.newImg(ML + "/images/ical.png");
        div.newTitle("label", btntxt);
        const button = parent.newButton(div, () => window.open(url), "ical");
        return button;
    }
}
