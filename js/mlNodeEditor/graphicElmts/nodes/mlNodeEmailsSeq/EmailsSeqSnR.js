class EmailsSeqSnR extends mlWindow
{
    constructor (emailsSeqInterface)
    {
        super(null, "Search & Replace", null);
        this.seq = emailsSeqInterface;
        this.fix();
    }

    setInterface(title, content)
    {
        super.setInterface(title, content);
        this.content.snr = this.content.newNode("div", "snr");
        this.content.snr.search = this.content.snr.addInput("text", "Rechercher");
        this.content.snr.replace = this.content.snr.addInput("text", "Remplacer");

        this.content.result = this.content.newNode("div", "result");
        this.content.valid = this.content.newButton("Exec !", () => this.snr());
    }

    show()
    {
        super.show();
        this.center();
    }

    snr()
    {
        for (const n of this.seq.nodes)
        {
            if (n.emailContentAsHtml)
            {
                n.setEmailContent(n.emailContentAsHtml().replaceAll(this.content.snr.search.value, this.content.snr.replace.value)) 
                n.setObject(n.object().replaceAll(this.content.snr.search.value, this.content.snr.replace.value)) 
            }
        }
    }
}
