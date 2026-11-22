class EmailsSeqNode
{
    constructor(parent, date=null)
    {
        this.parent = parent;
        this.date = date;
        this.selected = false;
        this.interface();
        this.setEvents();
        this.type = BLANK;
    }

    interface()
    {
        this.div = D.createElement("div"); 
        this.div.classList.add("email"); 

        this.div.arrow = this.div.newNode("div", ["arrow", "right"]);

        this.div.name = this.div.newNode("h3"); 
        this.div.name.innerText = "Blank";
        this.div.name.contentEditable = true;
        if (this.date)
            this.div.date = this.div.newTitle("div", "no date...", "date");
        this.updateDate(this.date);
    }

    updateDate(date)
    {
        if (!this.div.date)
            return;
        this.date = date;
        if (this.date)
            this.div.date.innerText = this.date.asFrench();
        else 
            this.div.date.innerText = "no date...";
    }

    showDate()
    {
        if (!this.div.date)
            this.div.date = this.div.newTitle("div", "no date...", "date");
        this.div.date.show();

    }

    hideDate()
    {
        if(this.div.date)
            this.div.date.hide();
    }

    name()
    {
        return this.div.name.innerText;
    }

    setEvents()
    {  
        this.div.addEventListener("click", this.toggleSelected.bind(this));
        this.div.name.addEventListener("click", (e) => e.stopPropagation());
        if (typeof(this.div.edit) != "undefined")
            this.div.edit.addEventListener("click", (e) => e.stopPropagation());
    }

    setSelected(bool)
    {
        this.selected = bool; 
        if (this.selected)
            this.div.classList.add("selected");
        else 
            this.div.classList.remove("selected");
    }

    toggleSelected(e)
    {
        this.setSelected(!this.selected);
    }

    serialize()
    {
        let json = {}; 
        json.name = this.div.name.innerText;
        json.type = this.type;

        return json
    }

    deserialize(json)
    {
        this.div.name.innerText = json.name; 
        if (this.name() == "Last Seq Email")
            this.div.classList.add("automatic");
    }

    phpStr()
    {
        let str = "$node = [] ;\n" ;
        str += "$node['name'] = \"" + this.div.name.innerText + "\" ;\n";
        str += "$node['type'] = 'blank';\n";
        return str;
    }
}
