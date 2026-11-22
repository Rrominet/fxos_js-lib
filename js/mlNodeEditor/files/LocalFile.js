class LocalFile extends mlFile
{
    constructor(name, time, parent=B, w=null)
    {
        super(name);
        this.w = w;
        this._name = name;
        this._time = 0;
        this.setTime(time);
        this._select = false;
        parent.appendChild(this.div);

        this.div.addEventListener("click", () => this.open());
    }

    setTime(time)
    {
       this._time = time;
       this.div.newTitle("span", Date.readableFromSeconds(this._time * 0.001));
    }

    open()
    {
        const c = confirm("Are you sure ?\nYou will erase the server file !");
        if (c)
        {
            let data = null;
            const js = JSON.parse(localStorage["mlNodeEditor"]);
            let save = null;
            for (const s of js.saves)
            {
                if (s.name == this._name)
                    save = s;
            }
            if (!save)
                return;
            
            for (const v of save.versions)
            {
                if (v.time == this._time)
                    data = v.data;
            }

            if (data)
            {
                NodeEditor.clear();
                NodeEditor.deserialize(data);
            }

            if (this.w)
                this.w.remove();
        }
    }
}
