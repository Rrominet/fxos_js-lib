class EmailsSeqEmailNode extends EmailsSeqNode
{
    constructor(parent, date = null)
    {
        super(parent, date);
        this.emailContent = new EmailContent; // Good  :) !
        this.emailContent.showObject();
        this.type = EMAIL;
        this.force = false;
    }

    interface()
    {
        super.interface();
        this.div.fist = this.div.newImg(FM + "/images/mlNodeEditor/fist.png");
        this.div.fist.classList.add("icon");
        if (!this.force)
            this.div.fist.hide();
        this.div.edit = this.div.newButton("Edit", this.showAndHideOther.bind(this), "edit");
        this.div.name.innerText = "Email";
    }

    setForce(val)
    {
        this.force = val;
        if (val)
            this.div.fist.show();
        else 
            this.div.fist.hide();
    }

    show()
    {
        this.emailContent.show();
    }

    showAndHideOther()
    {
        for (let n of this.parent.nodes)
        {
            try{n.hide();}
            catch(e){};
        }

        this.show();
    }

    hide()
    {
        this.emailContent.hide();
    }

    serialize()
    {
        let json = super.serialize();
        json.object = this.emailContent.object();
        json.content = this.emailContent.content.writer.definitveHtml();
        json.force = this.force;
        json.comments = this.emailContent.content.writer.serializeComments();

        return json;
    }

    deserialize(json)
    {
        super.deserialize(json); 
        this.emailContent.setObject(json.object);
        this.emailContent.content.writer.div.writer.innerHTML = json.content;
        if (json.comments)
        {
            this.emailContent.content.writer.deserializeComments(json.comments)
        }
        if (json.force)
            this.setForce(json.force);
    }

    phpStr()
    {
        let str = super.phpStr();
        str += "$node['object'] = \"" + this.emailContent.object().replace(/\"/g, "\\\"") + "\" ;\n";
        str += "$node['content'] = \"" + this.emailContent.content.writer.definitveHtml().replace(/\"/g, "\\\"") + "\" ;\n";
        if (this.force)
            str += "$node['force'] = true;\n";
        else 
            str += "$node['force'] = false;\n";
        str += "$node['type'] = 'email';\n";

        return str;
    }

    emailContentAsHtml()
    {
        return this.emailContent.content.writer.definitveHtml();
    }

    setEmailContent(html)
    {
        this.emailContent.content.writer.setHtml(html);
    }

    object()
    {
        return this.emailContent.object();
    }
    
    setObject(object)
    {
        this.emailContent.setObject(object);
    }

    html()
    {
        let html = "<div class='email'>"; 
        html += "<div class='name'>" + this.name() + "</div>";
        html += "<div class='object'>" + this.object() + "</div>";
        html += "<div class='email'>" + this.emailContentAsHtml() + "</div>";
        html += "</div>";
        return html;
    }
}
