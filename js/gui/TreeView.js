class TreeView
{
    //data [{
    //   label: string,
    //   id : string,
    //   children : [{label : string, children : [...]}], 
    //   onclick : [(MouseEvent, this) => {}, ...]
    //   onctx : [(MouseEvent, this) => {}, ...]
    //   ondblclick : [(MouseEvent, this) => {}, ...]
    //   onmouseenter : [(MouseEvent, this) => {}, ...]
    //   onmouseleave : [(MouseEvent, this) => {}, ...]
    //
    //}]

    //parent is a dom elmt
    constructor(data, parent = B)
    {
        this.data = data; 
        this.parent = parent;
        this.interface();
    }

    interface()
    {
        this.div = this.parent.newNode("div", "tree-view");
        this.div.btns = this.div.newNode("div", "buttons");
        for (const c of this.data)
            this.drawChild(c, this.div.btns);
    }

    drawChild(childData, parent)
    {
        const btn = parent.newButton(childData.label);
        if (childData.id)
            btn.id = childData.id;
        if (childData.onclick && childData.onclick.length>0)
        {
            for (const f of childData.onclick)
                btn.addEventListener("click", (e) => f(e, btn, this));
        }
        if (childData.ondblclick && childData.ondblclick.length>0)
        {
            for (const f of childData.ondblclick)
                btn.addEventListener("dblclick", (e) => f(e, btn, this));
        }
        if (childData.onctx && childData.onctx.length>0)
        {
            for (const f of childData.onctx)
                btn.addEventListener("contextmenu", (e) => f(e, btn, this));
        }
        if (childData.onmouseenter && childData.onmouseenter.length>0)
        {
            for (const f of childData.onmouseenter)
                btn.addEventListener("mouseenter", (e) => f(e, btn, this));
        }
        if (childData.onmouseleave && childData.onmouseleave.length>0)
        {
            for (const f of childData.onmouseleave)
                btn.addEventListener("mouseleave", (e) => f(e, btn, this));
        }

        if (childData.children && childData.children.length>0)
        {
            const d = parent.newNode("div", "children");
            for (const c of childData.children)
                this.drawChild(c, d);
        }
    }
}
