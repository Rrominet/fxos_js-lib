class MakeComment
{
    static get AJAX(){return FM + "/php/windows-manager/ajax.php";}

    constructor(txtData="", id="", comment="", user="")
    {
        if (!txtData)
            txtData = selectedHTML();
        this.data = txtData;
        if (this.data.length<3)
            return;
        this.comment = comment;
        this.user = user;
        if (!this.user && localStorage["user"])
            this.user = localStorage["user"];
        if (!id)
            id = uniqueId();
        this.id = id;
        this.createInterface();
        this.setEvents();
    }

    setEvents()
    {
        this.div.addEventListener("keydown", (e) => 
            {
                if (e.ctrlKey && e.key == "Enter")
                {
                    e.preventDefault();
                    this.create();
                }
            })
    }

    createInterface()
    {
        this.div = B.newNode("div", "mk-comment");
        this.div.area = this.div.newNode("textarea");
        this.div.area.focus();
        this.div.area.value = this.comment;
        this.div.user = this.div.addInput("text", "Utilisateur");
        this.div.user.value = this.user;

        this.div.user.addEventListener("change", () => localStorage["user"] = this.div.user.value);
        this.div.newButton("Valider", () => this.create());
    }

    create()
    {
        if (!this.div.user.value || !this.div.area.value)
        {
            alert("L'utilisateur ou le commentaire n'a pas été renseigné");
            return;
        }
        importScripts([
        mkJs(FM + "/js/HttpRequest.js")], () => 
            {
                this.div.remove();
                new mlComment (this.data, this.div.area.value, this.div.user.value, this.id);
                const xhr = new HttpRequest();
                const data = {};
                data.id = this.id;
                data.comment = this.div.area.value;
                data.user = this.div.user.value;
                data.text = this.data;
                const params = [
                    ["func", "saveComment"], 
                    ["id", this.id], 
                    ["data", JSON.stringify(data)],
                ];

                xhr.sendListAsPost(MakeComment.AJAX, params);

            });
    }

    static init()
    {
        addEventListener("keydown", (e) => 
            {
                if (e.ctrlKey && e.altKey && e.key == "m")
                    new MakeComment;
                else if (e.ctrlKey && e.key == "h")
                {
                    e.preventDefault();
                    mlComment.hideAll();
                }
                else if (e.ctrlKey && e.key == "H")
                {
                    e.preventDefault();
                    mlComment.showAll();
                }
            });
    }

    static read()
    {
        importScripts([
            mkJs(FM + "/js/HttpRequest.js"), ], () => 
            {
                const xhr = HttpRequest();
                const params = [["func", "readComments"]];
                const f = (xhr) => 
                {
                    const coms = JSON.parse(xhr.response);
                    for (const c of coms)
                        new mlComment(c.text, c.comment, c.user, c.id);
                }
                xhr.sendListAsPost(MakeComment.AJAX, params, f);
            });
    }
}

class mlComment
{
    constructor(txt, comment, user, id)
    {
        this.txt = txt; 
        this.comment = comment;
        while(this.comment[this.comment.length -1] == "\n")
            this.comment = this.comment.pop();
        this.user = user;
        this.id = id;
        this.find();
        this.interface();
        this.setEvents();
        this.move();
        this.focus();
    }

    interface()
    {
        this.div = B.newNode("div", "comment");
        this.div.newTitle("p", this.comment.replaceAll("\n", "<br>"), "content");
        this.div.newTitle("div", this.user, "user");
        this.div.footer = this.div.newNode("footer");
        this.div.footer.newButton("Modifier", () => this.modify());
        this.div.footer.newButton("Supprimer", () => this.delete());

        this.div.unfocus = () => this.unfocus();
    }

    find()
    {
        let elmts = [];
        for (const ch of D.querySelectorAll("p"))
            elmts.push(ch);
        for (const ch of D.querySelectorAll("h1"))
            elmts.push(ch);
        for (const ch of D.querySelectorAll("h2"))
            elmts.push(ch);
        for (const ch of D.querySelectorAll("h3"))
            elmts.push(ch);
        for (const ch of D.querySelectorAll("h4"))
            elmts.push(ch);
        for (const ch of D.querySelectorAll("h5"))
            elmts.push(ch);
        for (const ch of D.querySelectorAll("h6"))
            elmts.push(ch);
        for (const ch of D.querySelectorAll("button"))
            elmts.push(ch);

        for (const ch of elmts)
        {
            if (ch.classList.contains("mk-comment") || ch.classList.contains("comment"))
                continue;
            let replace = "<comment>" + this.txt + "</comment>";
            ch.replaceTxt(this.txt, replace);
        }

        this.findCommentNode();
    }

    findCommentNode()
    {
        window.tmp = D.createElement("div");
        tmp.innerHTML = this.txt;
        for (const el of D.querySelectorAll("comment"))
        {
            if (!el.parentNode)
                continue;
            if (el.innerText.replaceAll(" ", "") == tmp.innerText.replaceAll(" ", "")) 
            {
                this.elmt = el;
                return;
            }
        }

    }

    setEvents()
    {
        addEventListener("scroll", () => this.move());
        this.div.addEventListener("click", () => this.focus());
    }

    focus()
    {
        for (const com of D.querySelectorAll("div.comment"))
            com.unfocus();
        this.div.classList.add("focus");
        if (this.elmt)
            this.elmt.classList.add("focus");
    }

    unfocus()
    {
        this.div.classList.remove("focus");
        if (!this.elmt.parentNode)
            this.findCommentNode();
        if (this.elmt)
            this.elmt.classList.remove("focus");
    }

    move()
    {
        if (!this.elmt)
            return;
        if (!this.elmt.parentNode)
            this.findCommentNode();
        this.div.style.transform = "translate(0px, " +  (this.elmt.y() - this.div.h()/2) + "px)";
    }

    delete()
    {
        const xhr = HttpRequest();
        const params = [["func", "delete"], ["id", this.id]];
        xhr.sendListAsPost(MakeComment.AJAX, params);
        if (this.elmt && !this.elmt.parentNode)
            this.findCommentNode();
        this.div.remove();
        if (this.elmt)
            this.elmt.outerHTML = this.elmt.outerHTML.replaceAll("<comment>", "");
    }

    modify()
    {
        this.div.remove();
        new MakeComment(this.txt, this.id, this.comment, this.user);
    }

    static hideAll()
    {
        for (const c of D.querySelectorAll("div.comment"))
            c.hide();
        for (const c of D.querySelectorAll("comment"))
            c.classList.add("hidden");
    }

    static showAll()
    {
        for (const c of D.querySelectorAll("div.comment"))
            c.show();
        for (const c of D.querySelectorAll("comment"))
            c.classList.remove("hidden");
    }
}

MakeComment.init();
