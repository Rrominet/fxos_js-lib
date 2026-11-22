class FaqsOnePage
{
    constructor(elmts, elmtFinish=null)
    {
        this.elmts = elmts;
        this.elmtFinish = elmtFinish;
        this.faqs = [];
        this.index = 0;
        this.buildFromHtml(elmts);
        this.init();
    }

    buildFromHtml(elmts)
    {
        let i =0;
        for (const e of elmts)
        {
            if (i == elmts.length - 1)
            {
                this.faqs.push(new FaqOnePage(e, this, false));
                break;
            }
            this.faqs.push(new FaqOnePage(e, this));
            i++;
        }
    }

    init()
    {
        this.read();
        this.faqs[this.index].show();
    }

    next()
    {
        this.index ++;
        if (this.index == this.faqs.length)
            return;

        this.faqs[this.index -1].hide();
        this.save();
        setTimeout(() => this.faqs[this.index].show(this.index), this.faqs[this.index].speed * 1000);
    }

    save()
    {
        sessionStorage["faqOnePage"] = this.index;
    }

    read()
    {
        this.index = sessionStorage.getItem("faqOnePage");
        if (!this.index)
            this.index = 0;
        else 
            this.index = parseInt(this.index);
    }
}

class FaqOnePage
{
    constructor(elmt, Faqs, valid=true)
    {
        this.faqs = Faqs;
        this.elmt = elmt;
        this.valid = valid;
        this.speed = 0.3;
        this.buildFromHtml(elmt);
    }

    buildFromHtml(elmt)
    {
        elmt.style.transition = "opacity " + this.speed + "s";
        elmt.hide();
        if (this.valid)
            elmt.newButton("J'ai compris", () => this.faqs.next());
    }

    show(index = 0)
    {
        this.elmt.show();
        if (index != 0)
            scrollBy(0, this.elmt.getBoundingClientRect().top - 100);
        setTimeout(() => this.elmt.style.opacity = 1, 100);
    }

    hide()
    {
        this.elmt.style.opacity = 0;
        setTimeout(() => this.elmt.hide(), this.speed * 1000);
    }
}
