class mlComment
{
    static get AJAX(){return FM + "/php/txtWriterAjax.php";}

    constructor(writer, open=false)
    {
        this.writer = writer;
        this.html = "";
        this.id = uniqueId();
        this.user = "";
        // text character position for start and end (from textContent, not html)
        if (!open)
            this.initFromSelection();
        this.interface();
        this.setEvents();
        this.updatePosition();
    }

    initFromSelection()
    {
        const range = getSelection().getRangeAt(0);
        const span = D.createElement("span");
        span.classList.add("comment");
        span.setAttribute("data-comment", this.id);
        range.surroundContents(span);
    }

    interface()
    {
        this.div = B.newNode("div", "comment")
        if (this.writer.side == TxtWriter.LEFT)
            this.div.classList.add("left");
        this.div.close = this.div.newButton("<img class='icon' src='" + FM + "/js/txtWriter/images/delete.png'/>", () => this.remove(), "close");
        this.div.comment = this.div.newNode("div", "data");
        this.div.comment.contentEditable = true;
        this.div.user = this.div.newNode("div", "user");
        this.div.user.contentEditable = true;

        if (localStorage["comment-user"])
            this.div.user.innerText = localStorage["comment-user"];

        this.focusOnlyMe();
        this.div.comment.focus();
    }

    remove()
    {
        this.div.remove();
        try
        {
            this.writer.comments.remove(this);
        }
        catch(e){}
        this.node = this.findSpan();
        if (this.node)
            this.node.classList.add("inactive");
    }

    setEvents()
    {
        addEventListener("scroll", () => this.updatePosition());
        this.writer.div.writer.addEventListener("scroll", () => this.updatePosition());
        this.div.user.addEventListener("keydown", (e) => {
            if (e.key == "Enter")
            {
                e.preventDefault();
                this.div.user.blur();
            }
            this.user = this.div.user.textContent;
        })
        this.div.user.addEventListener("input", () => localStorage["comment-user"] = this.div.user.innerText);

        this.div.comment.addEventListener("keydown", (e) => 
            {
                if (e.key == "Enter" && e.ctrlKey)
                {
                    e.preventDefault();
                    this.div.comment.blur();
                }
                this.html = this.div.comment.innerHTML;
            })

        this.div.addEventListener("mouseup", () => this.focusOnlyMe());
        this.div.comment.addEventListener("mousesup", (e) => e.stopPropagation());
        this.div.user.addEventListener("mousesup", (e) => e.stopPropagation());
    }

    focus()
    {
        this.div.classList.add("focus");
        this.node = this.findSpan();
        if (this.node)
            this.node.classList.add("focus");
        this.updatePosition();
    }

    unfocus()
    {
        this.div.classList.remove("focus");
        this.node = this.findSpan();
        if (this.node)
            this.node.classList.remove("focus");
        this.updatePosition();
    }

    focusOnlyMe()
    {
        for (const c of this.writer.comments)
            c.unfocus();
        this.focus();
    }

    findSpan()
    {
        for (const c of this.writer.div.writer.deepChildren())
        {
            if (c.getAttribute("data-comment") == this.id)
                return c;
        }
        return null;
    }

    updatePosition()
    {
        this.node = this.findSpan();
        if (this.node)
            this.div.style.transform = "translate(0px, " + (this.node.y() - this.div.h()/2) + "px)";
    }

    serialize()
    {
        const json = {};
        json.html = this.html;
        json.id = this.id;
        json.user = this.user;

        return json;
    }

    deserialize(json)
    {
        this.html = json.html;
        this.id = json.id;
        this.user = json.user;

        this.update();
    }

    update()
    {
        this.div.user.innerText = this.user;
        localStorage["comment-user"] = this.user;

        this.div.comment.innerHTML = this.html;
    }

    hide()
    {
        this.div.hide();
        this.node = this.findSpan();
        if (this.node)
            this.node.classList.add("inactive");
    }

    show()
    {
        this.div.show();
        this.node = this.findSpan();
        if (this.node)
            this.node.classList.remove("inactive");
    }
}
