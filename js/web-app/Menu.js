class Menu
{
    constructor()
    {
        this.buttons = [];
        this.div = B.newNode("menu");
        this.div.classList.add("closed");
        this.div.header = this.div.newNode("div", "header");
        this.div.header.close = this.div.header.newButton("Close", () => this.div.classList.add("closed"));
        this.div.buttons = this.div.newNode("div", "buttons");

        this.open = B.newNode("div", "menu-open");
        this.open.newNode("line")
        this.open.newNode("line")
        this.open.newNode("line")

        this.open.addEventListener("click", () => this.div.classList.remove("closed"));
    }

    add(text, cb, classList=[])
    {
        const func = () => 
        {
            cb();
            this.div.classList.add("closed");
        };
        const b = this.div.buttons.newButton(text, func, classList);
        this.buttons.push(b);
        return b;
    }

    remove(button)
    {
        button.remove();
        this.buttons.remove(button);
    }

    removeByText(text)
    {
        for (let i=0; i<this.buttons.length; i++)
        {
            const b = this.buttons[i];
            if (b.innerText == text)
            {
                this.remove(b);
                i--;
            }
        }
    }

    show()
    {
        this.div.classList.remove("closed");
    }

    hide()
    {
        this.div.classList.add("closed");
    }

    toggle()
    {
        if (this.div.classList.contains("closed"))
            this.show();
        else 
            this.hide();
    }
}
