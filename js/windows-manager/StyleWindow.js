class StyleWindow extends mlWindow
{
    constructor(WindowsManager)
    {
        super(WindowsManager, "Style", StyleWindow.getContent(), true);
        this.div.classList.add("style");
        this.elmts = [];
    }

    // elmt could be an array
    addElmt(elmt)
    {
        if (!elmt.length)
            this.elmts.push(elmt); 
        else 
        {
            for (const el of elmt)
                this.elmts.push(elmt);
        }
    }

    getCss()
    {
        return this.content.children[0].css;
    }

    removeElmt(elmt)
    {
        this.elmts.remove(elmt);
    }

    clearElmts()
    {
        this.elmts = [];
    }

    static getContent()
    {
        const c = D.createElement("div");
        const css = c.css = c.newNode("div", "css");
        css.padding = css.css4Input("padding", null);
        css.margin = css.css4Input("margin", null);
        css.border = css.css4Input("border radius", null);
        css.useBorder = css.labelInput("checkbox", "Borders : ");
        css.borders = css.newNode("div", "borders");
        css.borders.top = css.borders.cssInput("text", "Top : ");
        css.borders.bottom = css.borders.cssInput("text", "Bottom : ");
        css.borders.left = css.borders.cssInput("text", "Left : ");
        css.borders.right = css.borders.cssInput("text", "Right : ");
        css.borders.hide();
        css.separator();
        css.color = css.labelInput("color", "Color : ");
        css.bgColor = css.labelInput("color", "Background Color : ");
        css.separator();
        css.txt = css.newNode("div", "txt-style");
        css.txt.left = css.txt.newToggleButton(Icons.byName("align-to-left"), null, "icon");
        css.txt.center = css.txt.newToggleButton(Icons.byName("center-text-alignment"), null, "icon");
        css.txt.right = css.txt.newToggleButton(Icons.byName("align-to-right"), null, "icon");
        css.txt.justify = css.txt.newToggleButton(Icons.byName("align-justify"), null, "icon");
        css.fontSize = css.cssInput("text", "Font Size : ");
        css.txt.bold = css.txt.newToggleButton(Icons.byName("bold-text-option"), null, "icon");
        css.txt.underline = css.txt.newToggleButton(Icons.byName("underline-text-option"), null, "icon");
        css.txt.italic = css.txt.newToggleButton(Icons.byName("italicize-text"), null, "icon");
        css.txt.cross = css.txt.newToggleButton(Icons.byName("cross-out.svg"), null, "icon");
        css.fontFamily = css.cssInput("text", "Font Family : ");
        css.separator();
        css.width = css.cssInput("text", "Width : ");
        css.height = css.cssInput("text", "Height : ");
        css.separator();
        css.boxShadow = css.labelInput("checkbox", "Shadow : ");
        css.shadow = css.newNode("div", "shadow");
        css.shadow.side = css.shadow.labelInput("range", "Side : ");
        css.shadow.up = css.shadow.labelInput("range", "Up : ");
        css.shadow.blur = css.shadow.labelInput("range", "Blur : ");
        css.shadow.color = css.shadow.labelInput("color", "Color : ");
        css.shadow.alpha = css.shadow.labelInput("range", "Alpha : ");
        css.shadow.hide();

        css.sc = c.addInput("text");
        css.sc.hide();
        return c;
    }

    setEvents()
    {
        super.setEvents();
        const c = this.getCss(); 
        c.padding.addOnChange((css) => this.onPadding(css));
        c.margin.addOnChange((css) => this.onMargin(css));
        c.border.addOnChange((css) => this.onBorder(css));
        c.useBorder.addEvent("input", ()=>this.onUseBorder());
        c.color.addEvent("input", ()=>this.onColor());
        c.bgColor.addEvent("input", ()=>this.onBgColor());

        c.txt.bold.addEventListener("click", () => this.onBold());
        c.txt.italic.addEventListener("click", () => this.onItalic());
        c.txt.underline.addEventListener("click", () => this.onUnderline());
        c.txt.cross.addEventListener("click", () => this.onCross());

        c.fontSize.addEvent("input", ()=>this.onFontSize());
        c.fontFamily.addEvent("input", ()=>this.onFontFamily());

        c.sc.addEventListener("input", () => this.onVimInput());

        c.width.addEvent("input", () => this.onWidth());
        c.height.addEvent("input", () => this.onHeight());

        c.boxShadow.addEvent("input", () => this.onBoxShadow());

        for (const l of c.borders.children)
            l.addEvent("input", () => this.onBordersChange());
    }

    onPadding(val)
    {
        for (const el of this.elmts)    
            el.style.padding = val;
    }

    onMargin(val)
    {
        console.log (val);
        for (const el of this.elmts)    
            el.style.margin = val;
    }

    onBorder(val)
    {
        for (const el of this.elmts)    
            el.style.borderRadius = val;
    }

    onUseBorder()
    {
        if (this.getCss().useBorder.getValue())
            this.getCss().borders.show();
        else
            this.getCss().borders.hide();
        this.onBordersChange();
    }

    onColor()
    {
        for (const el of this.elmts)    
            el.style.color = this.getCss().color.getValue();
    }

    onBgColor()
    {
        for (const el of this.elmts)    
            el.style.backgroundColor = this.getCss().bgColor.getValue();
    }

    onBold()
    {
        for (const el of this.elmts)
        {
            if (this.getCss().txt.bold.active())
                el.style.fontWeight = "bold";
            else 
                el.style.fontWeight = "initial";
        }
    }

    onUnderline()
    {
        for (const el of this.elmts)
        {
            if (this.getCss().txt.underline.active())
                el.style.textDecoration = "underline";
            else 
                el.style.textDecoration = "none";
        }
    }

    onItalic()
    {
        for (const el of this.elmts)
        {
            if (this.getCss().txt.italic.active())
                el.style.fontStyle = "italic";
            else 
                el.style.fontStyle = "initial";
        }
    }

    onCross()
    {
        for (const el of this.elmts)
        {
            if (this.getCss().txt.cross.active())
                el.style.textDecoration = "line-through";
            else 
                el.style.textDecoration = "none";
        }
    }

    onFontSize()
    {
        for (const el of this.elmts)
            el.style.fontSize = this.getCss().fontSize.getValue();
    }

    onFontFamily()
    {
        for (const el of this.elmts)
            el.style.fontFamily = this.getCss().fontFamily.getValue();
    }

    onWidth()
    {
        for (const el of this.elmts)
        {
            const w = this.getCss().width.getValue()
            if (w == "initial" || w == "inherit")
            {
                el.style.width = w;
                continue;
            }
            else if (!w.includes("px") && !w.includes("em") && !w.includes("%"))
                el.style.width = w + "px";
            else
                el.style.width = w;
        }
    }

    onHeight()
    {
        for (const el of this.elmts)
        {
            const h = this.getCss().height.getValue()
            if (h == "initial" || h == "inherit")
            {
                el.style.height = h;
                continue;
            }
            else if (!h.includes("px") && !h.includes("em") && !h.includes("%"))
                el.style.height = h + "px";
            else
                el.style.height = h;
        }
    }

    vim(bool)
    {
        if (bool)
        {
            this.getCss().sc.show();
            this.getCss().sc.focus();
        }
        else 
        {
            this.getCss().sc.value = "";
            this.getCss().sc.hide();
        }
    }

    isVim()
    {
        return this.getCss().sc.isVisible();
    }

    validVim()
    {
        const txt = this.getCss().sc.value;
        if (txt[0] == "p")
            this.getCss().padding.setValue(parseInt(txt.split("p")[1]));

        else if (txt[0] == "m")
            this.getCss().margin.setValue(parseInt(txt.split("m")[1]));

        else if (txt[0] == "r" && txt[1] == "a")
            this.getCss().border.setValue(parseInt(txt.split("ra")[1]));

        else if (txt[0] == "b")
        {
            this.getCss().borders.show();
            this.getCss().useBorder.setValue(true);
            this.getCss().borders.top.setValue(parseInt(txt.split("b")[1]) + "px solid");
            this.getCss().borders.bottom.setValue(parseInt(txt.split("b")[1]) + "px solid");
            this.getCss().borders.left.setValue(parseInt(txt.split("b")[1]) + "px solid");
            this.getCss().borders.right.setValue(parseInt(txt.split("b")[1]) + "px solid");
        }

        this.updateFromKeyEvent();
    }

    onVimInput()
    {
        const txt = this.getCss().sc.value;
        if (txt[0] == "f" && txt[1] == "s")
        {
            this.getCss().fontSize.focus();
            this.vim(false);
        }

        else if (txt[0] == "f" && txt[1] == "f")
        {
            this.getCss().fontFamily.focus();
            this.vim(false);
        }

        else if (txt[0] == "b" && txt[1] == "t")
        {
            this.getCss().useBorder.setValue(true);
            this.getCss().borders.show();
            this.getCss().borders.top.focus();
            this.vim(false);
        }

        else if (txt[0] == "b" && txt[1] == "b")
        {
            this.getCss().useBorder.setValue(true);
            this.getCss().borders.show();
            this.getCss().borders.bottom.focus();
            this.vim(false);
        }

        else if (txt[0] == "b" && txt[1] == "l")
        {
            this.getCss().useBorder.setValue(true);
            this.getCss().borders.show();
            this.getCss().borders.left.focus();
            this.vim(false);
        }

        else if (txt[0] == "b" && txt[1] == "r")
        {
            this.getCss().useBorder.setValue(true);
            this.getCss().borders.show();
            this.getCss().borders.right.focus();
            this.vim(false);
        }
    }

    onKey(e)
    {
        super.onKey(e);
        if (e.altKey)
            return;
        if (e.key == "Enter" && !this.isVim() && D.activeElement.type =="text" && D.activeElement.type == "text")
        {
            D.activeElement.blur();
            return;
        }
        if (e.key == "Enter" && this.isVim())
        {
            this.validVim();
            this.vim(false);
        }

        else if (e.key == "Escape")
        {
            this.vim(false);
            return;
        }

        if (D.activeElement.tagName == "INPUT" && D.activeElement.type == "text")
            return;
        if (e.ctrlKey && e.key == "b")
        {
            e.preventDefault();
            this.getCss().txt.bold.click();
        }

        else if (e.ctrlKey && e.key == "i")
        {
            e.preventDefault();
            this.getCss().txt.italic.click();
        }

        else if (e.ctrlKey && e.key == "u")
        {
            e.preventDefault();
            this.getCss().txt.underline.click();
        }

        else if (e.key == "w")
        {
            e.preventDefault();
            this.getCss().width.focus();
            return;
        }

        else if (e.key == "h")
        {
            e.preventDefault();
            this.getCss().height.focus();
            return;
        }

        else if (letters.includes(e.key))
        {
            e.preventDefault();
            this.vim(true);
            this.getCss().sc.value = e.key;
        }
    }

    updateFromKeyEvent()
    {
       this.onPadding();  
       this.onMargin();  
       this.onBorder();  
       this.onBordersChange();
    }

    onBoxShadow()
    {
        if (this.getCss().boxShadow.getValue())
            this.getCss().shadow.show();
        else 
            this.getCss().shadow.hide();
    }

    onBordersChange()
    {
        for (const el of this.elmts)
        {
            if (this.getCss().useBorder.getValue())
            {
                el.style.borderLeft = this.getCss().borders.left.getValue();
                el.style.borderRight = this.getCss().borders.right.getValue();
                el.style.borderTop = this.getCss().borders.top.getValue();
                el.style.borderBottom = this.getCss().borders.bottom.getValue();
            }
            else 
            {
                el.style.borderLeft = "none";
                el.style.borderRight = "none";
                el.style.borderTop = "none";
                el.style.borderBottom = "none";

            }
        }
    }

}
