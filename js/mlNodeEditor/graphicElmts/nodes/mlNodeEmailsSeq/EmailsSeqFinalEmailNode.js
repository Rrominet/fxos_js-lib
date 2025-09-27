class EmailsSeqFinalEmailNode extends EmailsSeqEmailNode
{
    constructor(parent, date=null)
    {
        super(parent, date);
        this.emailContent = new EmailContent;
        this.emailContent.showObject();
        this.type = FINAL_EMAIL;
    }

    interface()
    {
        super.interface();
        this.div.end = this.div.newNode("i"); 
        this.div.end.innerText = "Final";
        this.div.classList.add("final");
    }

    phpStr()
    {
        let str = super.phpStr();
        str += "$node['type'] = 'final_email';\n";

        return str;
    }
}
