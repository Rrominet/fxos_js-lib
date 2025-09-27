class Question
{
    constructor(id, question, parent)
    {
        this.id = id;
        this.htmlQuestion = question;
        this.parent = parent;
        this._onValid = [];
        this.dom = null;
        this.mendatory = true;
    }

    draw()
    {
        this.dom = this.parent.newNode("section", "question");
        this.dom.question = this.dom.newTitle("p", this.htmlQuestion);
        this.dom.res = this.dom.newNode("div", "res");
        this.dom.foot = this.dom.newNode("div", "foot");
        this.dom.foot.valid = this.dom.foot.newButton("Suivant", () => this._onValid.forEach(f => f()));
        this.dom.foot.valid.disabled = true;
    }

    check()
    {
        if (!this.ok())
            this.dom.foot.valid.disabled = true;
        else 
            this.dom.foot.valid.disabled = false;
    }

    addOnValid(f)
    {
        this._onValid.push(f)
    }

    setMendatory(val = true)
    {
        this.mendatory = val;
        this.check();
    }

    serialize()
    {
        if (this.dom.res.input)
            return {[this.id] : this.dom.res.input.value};
        else
            return {[this.id] : ""};
    }

    //if this return false, it means the survey should not be sended.
    ok()
    {
        return true;
    }
}

class OneLineQuestion extends Question
{
    constructor(id, question, parent, type="text")
    {
        super(id, question, parent);
        this.type = type;
    }

    draw()
    {
        super.draw();
        this.dom.res.input = this.dom.res.addInput(this.type, "Ta réponse...");
        this.dom.res.input.addEventListener("input", () => this.check());
    }

    ok()
    {
        if (!this.mendatory)
            return true;
        return this.dom.res.input.value != "";
    }
}

class MultipleChoicesModel
{
    constructor(multipleChoicesQuestion)
    {
        this.choices = [];
        this.view = multipleChoicesQuestion;
        this.mode = this.view.mode;
    }

    addChoice(id, html, updateView=true)
    {
        const ch = {id : id, html : html, active : false}; 
        this.choices.push(ch);
        if (updateView)
            this.view.update();
    }

    addChoices(choices)
    {
        for (const ch of choices)
            this.addChoice(ch.id, ch.html, false);

        this.view.update();
    }

    removeChoice(id)
    {
        for (const c of this.choices )
        {
            if (c.id == id)
            {
                this.choices.remove(c);
                break;
            }
        }
        this.view.update();
    }

    replaceChoice(id, html)
    {
        for (const c of this.choices )
        {
            if (c.id == id)
            {
                c.html = html;
                this.view.updateOne(c);
                break;
            }
        }

    }

    clear()
    {
        this.choices = [];
        this.view.update();
    }

    active(id)
    {
        if (this.mode == MultipleChoicesQuestion.UNIQUE)
        {
            for (const c of this.choices )
            {
                if (c.id == id)
                    c.active = true;
                else 
                    c.active = false;
            }
            this.view.update();
        }

        else if (this.mode == MultipleChoicesQuestion.MULTIPLE)
        {
            for (const c of this.choices )
            {
                if (c.id == id)
                {
                    c.active = true;
                    this.view.updateOne(c);
                    break;
                }
            }
        }
    }

    desactive(id)
    {
        for (const c of this.choices )
        {
            if (c.id == id)
            {
                c.active = false;
                this.view.updateOne(c);
                break;
            }
        }
    }

    toggle(id)
    {
        for (const c of this.choices)
        {
            if (c.id == id)
            {
                c.active = !c.active;
                this.view.updateOne(c);
                break;
            }
        }
    }

    serialize()
    {
        const data = {};
        data.id = this.view.id;
        data.choices = this.choices;
        return data;
    }
}

class MultipleChoicesQuestion extends Question
{
    static get UNIQUE(){return 1;}
    static get MULTIPLE(){return 2;}

    constructor(id, question, parent, mode=MultipleChoicesQuestion.UNIQUE)
    {
        super(id, question, parent);
        this.mode = mode;
        this.choices = new MultipleChoicesModel(this);
    }

    addChoice(id, html){this.choices.addChoice(id, html);}
    addChoices(choices){this.choices.addChoices(choices);}
    removeChoice(id){this.choices.removeChoice(id);}
    replaceChoice(id, html){this.choices.replaceChoice(id, html);}
    clear(){this.choices.clear();}
    active(id){this.choices.active(id);}
    toggle(id){this.choices.toggle(id);}
    desactive(id) {this.choices.desactive(id);}
    serialize(){return this.choices.serialize();}

    update()
    {
        for (const ch of this.choices.choices)
            this.updateOne(ch);
    }

    updateOne(ch)
    {
        let d = this.choiceDom(ch.id);
        if (!d)
        {
            d = this.drawChoice(ch);
            return;
        }

        d.innerHTML = ch.html;
        if (ch.active)
            d.classList.add("active");
        else 
            d.classList.remove("active");
    }

    drawChoice(ch)
    {
        if (!this.chdom)
            return;
        const c = this.chdom.newNode("div", "choice", ch.id);
        c.innerHTML = ch.html;
        this.setChoiceEvent(c)
        return c;
    }

    setChoiceEvent(dom)
    {
        if (this.mode == MultipleChoicesQuestion.UNIQUE)
            dom.addEventListener("click", () => this.active(dom.id));
        else 
            dom.addEventListener("click", () => this.toggle(dom.id));
        dom.addEventListener("click", () => this.check());
    }

    isDrawn(id)
    {
        if (!this.chdom)
            return false;

        if (this.chdom.querySelector(`#${id}`))
            return true;
        return false;
    }

    choiceDom(id)
    {
        if (!this.chdom)
            return null;
        return this.chdom.querySelector(`#${id}`);
    }

    draw()
    {
        super.draw();
        this.chdom = this.dom.res.newNode("div", "choices");
        this.update();
    }

    ok()
    {
        if (!this.mendatory)
            return true;
        for (const ch of this.choices.choices)
        {
            if (ch.active)
                return true;
        }
        return false;
    }

}

class OpenQuestion extends Question
{
    constructor(id, question, parent, placeholder="Écris ta réponse ici...")
    {
        super(id, question, parent);
        this.placeholder = placeholder;
    }

    draw()
    {
        super.draw();
        this.dom.res.input = this.dom.res.newTextarea(this.placeholder);
        this.dom.res.input.addEventListener("input", () => this.check());
    }

    ok()
    {
        if (!this.mendatory)
            return true;
        return this.dom.res.input.value != "";
    }
}

class Survey
{
    constructor(id, name, parent, introHtml="")
    {
        this.id = id;
        this.name = name;
        this.shown = 0;
        this.questions = [];
        this.introHtml = introHtml;
        this.url = null;
        this.bonus = null;
        this.draw(parent);
        this.setSize();
        this.setEvents();
        this.setTimedCheck();
    }

    setAjaxUrl(url)
    {
        this.url = url;
    }

    draw(parent)
    {
        this.dom = parent.newNode("div", "survey");
        this.dom.tabIndex = 0;
        if (this.introHtml)
            this.dom.intro = this.dom.newTitle("div", this.introHtml, "intro");
        this.dom.questions = this.dom.newNode("div", "questions");
        this.dom.questions.head = this.dom.questions.newNode("div", "head");
        this.dom.questions.head.newButton("< Question précédente", () =>this.prev());
        this.dom.questions.head.infos = this.dom.questions.head.newTitle("div", "0/0", "infos");
        this.dom.questions.head.infos.update = () => this.dom.questions.head.infos.innerHTML = `${this.shown + 1}/${this.questions.length}`
        this.dom.questions.ls = this.dom.questions.newNode("div", "ls");
        this.dom.foot = this.dom.newNode("div", "foot");
        this.dom.foot.send = this.dom.foot.newButton("J'envoie mes réponses...", () => this.send());
        this.dom.foot.send.disabled = true;
        this.dom.foot.hide();
    }

    questionById(id)
    {
        for (const q of this.questions)
            if (q.id == id)
                return q;
        return null;
    }

    async send()
    {
        newCss(FM + "/css/loader.css");
        await scripts.import(FM + "/js/loader.js");
        this.dom.foot.send.mkLoading();
        if (!this.url)
        {
            console.error("You need to set the url with setAjaxUrl(url) before calling Survey.send()");
            return;
        }

        const data = {};
        if (!email() || !prenom())
        {
            try
            {
                localStorage["email"] = this.questionById("email").dom.res.input.value.toLowerCase();
                localStorage["prenom"] = this.questionById("prenom").dom.res.input.value;
            }catch(e){}
        }
        data["email"] = email();
        data["prenom"] = prenom();
        const s_data = this.serialize();
        for (const k in s_data)
            data[k] = s_data[k];

        await scripts.import(FM + "/js/HttpRequest.js");
        request.send(this.url, data, (res) => 
            {
                console.log(res);
                this.dom.foot.send.stopLoading();
                if (res == "true")
                {
                    this.dom.foot.send.hide();
                    this.dom.foot.newTitle("p", "Tes réponses nous ont bien été transmises, nous les étudierons avec la plus grande attention.<br>Un immense merci " + prenom() + " :)");
                    if ("intro" in this.dom && this.dom.intro)
                        this.dom.intro.hide();
                    this.dom.questions.hide();
                    if (this.bonus)
                        this.dom.foot.newButton("Clique ici pour recevoir un petit cadeau pour te remercier...", () => window.location.href = this.bonus);
                }
                else 
                    this.dom.foot.send.innerText("Erreur... Clique ici pour réessayer");
            });
    }

    serialize()
    {
        const data = {};
        data.id = this.id
        data.name = this.name;
        data.questions = [];
        for (const q of this.questions)
            data.questions.push(q.serialize());
        return data;
    }

    createQuestion(cls, ...args)
    {
        const q = new cls(...args);
        this.questions.push(q);
        q.draw();
        q.dom.hide();
        q.addOnValid(() => this.next());
        this.dom.questions.head.infos.update();
        return q;
    }

    createOneLineQuestion(id, question, type="text")
    {
        return this.createQuestion(OneLineQuestion, id, question, this.dom.questions.ls, type);
    }

    createMultipleChoicesQuestion(id, question, mode=MultipleChoicesQuestion.UNIQUE)
    {
        return this.createQuestion(MultipleChoicesQuestion, id, question, this.dom.questions.ls, mode);
    }

    createOpenQuestion(id, question)
    {
        return this.createQuestion(OpenQuestion, id, question, this.dom.questions.ls);
    }

    next()
    {
        this.shown++;
        if (this.shown == this.questions.length)
        {
            this.shown --;
            return;
        }
        this.show(this.shown);
        this.dom.questions.head.infos.update();
    }

    prev()
    {
        this.shown--;
        if (this.shown < 0)
        {
            this.shown = 0;
            return;
        }
        this.show(this.shown);
        this.dom.questions.head.infos.update();
    }

    show(idx)
    {
        for (const q of this.questions)
            q.dom.hide();
        this.questions[idx].dom.show();
        if ("input" in this.questions[idx].dom.res)
            this.questions[idx].dom.res.input.focus();

        if (idx == this.questions.length - 1)
        {
            this.questions[idx].dom.foot.hide();
            this.dom.foot.show();
        }
        else 
        {
            this.dom.foot.hide();
            this.questions[idx].dom.foot.show();
        }

        this.check();
    }

    setEvents()
    {
        addEventListener("load", () => this.setSize());
        addEventListener("resize", () => this.setSize());
        this.dom.addEventListener("keydown", (e) => 
            {
                if (D.activeElement.tagName == "TEXTAREA")
                    return;

                if (e.key == "Enter")
                {
                    this.next();
                    e.preventDefault();
                }
                else if (e.key == "Escape")
                {
                    this.prev();
                    e.preventDefault();
                }
            });
    }

    setSize()
    {
        if (!this.dom)
            return;
//         this.dom.style.width = D.documentElement.clientWidth + "px";
//         this.dom.style.height = D.documentElement.clientHeight + "px";
    }

    check()
    {
        for (const q of this.questions)
        {
            if (!q.ok())
            {
                this.dom.foot.send.disabled = true;
                return;
            }
        }
        this.dom.foot.send.disabled = false;
    }

    setTimedCheck()
    {
        setTimeout(() => 
            {
                if (this.shown == this.questions.length - 1)
                    this.check();
                this.setTimedCheck();
            }, 500);
    }
}

