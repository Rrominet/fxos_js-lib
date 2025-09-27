class SurveyRead
{
    constructor(id, url, parent=B)
    {
        this.url = url;
        this.id = id;
        this.parent = parent;
        this.load();
    }

    async load()
    {
        await scripts.import(FM + "/js/HttpRequest.js");
        request.send(this.url, {id : this.id}, (res) => {
            this.data = JSON.parse(res);
            this.draw();
        });
    }

    draw()
    {
        this.div = this.parent.newNode("div", "survey-result");
        this.drawLength();
        this.drawChoices();
        for (const k in this.data)
            this.drawOne(this.data[k]);
    }

    drawLength()
    {
        this.div.labelValue("Nombre de reponses ", Object.keys(this.data).length);
    }

    drawChoices()
    {
        const res = this.div.newNode("div", "choices");
        for (const k in this.data)
        {
            for (const q of this.data[k]["questions"])
            {
                if (!("choices" in q)) 
                    continue;
                let choicediv = null;
                if (q.id in res)
                    choicediv = res[q.id];
                else 
                {
                    choicediv = res[q.id] = res.newNode("div", "choice");
                    choicediv.newTitle("label", q.id + " : ");
                }
                for (const c of q["choices"])
                {
                    if (c.active)
                    {
                        if (c.id in choicediv) 
                            choicediv[c.id].setValue(parseInt(choicediv[c.id].getValue()) + 1);
                        else 
                            choicediv[c.id] = choicediv.labelValue(c.html, 1);
                        break;
                    }
                }
            }
        }
    }

    drawOne(data)
    {
        const res = this.div.newNode("div", "response");
        res.prenom = res.newTitle("label", data["prenom"], "prenom");
        res.email = res.newTitle("label", data["email"], "email");

        res.questions = res.newNode("div", "questions");
        for (const q of data["questions"])
        {
            const qd = res.questions.q = res.questions.newNode("div", "question");
            for (const k in q)
            {
                if (k != "choices")
                {
                    qd._id = qd.newTitle("label", k + " : ", "id");
                    let html = q[k].replaceAll("\n", "<br>");
                    qd._value = qd.newTitle("label", html, "value");
                }
                else 
                {
                    for (const c of q[k]) 
                    {
                        if (c.active)
                        {
                            qd._value = qd.newTitle("label", c.html, "value");
                            break;
                        }
                    }
                }
            }
        }
    }
}
