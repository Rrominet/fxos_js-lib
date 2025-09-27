class SondageLive
{
    constructor(ls, id="42", parent=B)
    {
        this.ls = ls;
        this.id = id;
        this.parent = parent;
        this.interface();
    }

    interface()
    {
        this.div = this.parent.newNode("div", "sondage-live");
        this.div.newTitle("h3", "Quelle option préfères-tu ?");
        this.div.content = this.div.newNode("div", "content");
        if (localStorage["voted"] != this.id)
        {
            for (const m of this.ls)
                this.div.content.newButton(m, () => this.vote(m));
        }
        else 
        {
            this.div.content.newTitle("p", "Ton vote a bien été pris en compte.");
            this.drawResults();
            setInterval(() => this.drawResults(), 5000);
        }
    }

    vote(val)
    {
        if (localStorage["voted"] == this.id)
            return;
        localStorage["voted"] = this.id;
        const xhr = HttpRequest();
        const params = [
            ["func", "vote"], 
            ["value", val], 
            ["keys", JSON.stringify(this.ls)], 
        ];

        const f = function (xhr)
        {
            if (xhr.responseText == "true")
            {
                this.div.content.innerHTML = "";
                this.div.content.newTitle("p", "Ton vote a bien été pris en compte.");
                this.drawResults();
                setInterval(() => this.drawResults(), 5000);
            }
        }.bind(this);

        xhr.sendListAsPost("ajax.php", params, f);
        this.div.content.innerHTML = "";
        this.div.content.newTitle("p", "Comptage de ton vote en cours...");
    }

    drawResults()
    {
        if (!this.resultsDrawn)
        {
            const res = this.div.content.res = this.div.content.newNode("div", "results");
            this.results = [];
            for (const m of this.ls)
            {
                const r = res.labelValue(m, 0);
                r.key = m;
                this.results.push(r);
            }

            this.resultsDrawn = true;
        }

        DistFile.read("data/votes", (xhr) => {
            let data = JSON.parse(xhr.responseText);
            for (const k in data)
            {
                for (const r of this.results)
                {
                    if (k.slice(0,10) == r.key.slice(0, 10))
                        r.setValue(data[k])
                }
            }
        })
    }
}
