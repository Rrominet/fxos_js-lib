class ConvMulti extends Conv
{
    // the id is used to separate differents multiConv saves
    constructor(container, Tchat, id)
    {
        super("0", container, false, Tchat, 10000); 
        this.id = id;
        this.email = email(); 
        this.canSend = true;
        this.timeSend = 0;
        if (!this.email)
        {
            this.abort(); 
            return;
        }
        this.ajaxRead();
    }

    abort()
    {
        this.createMessage("Tu dois être connecté pour accéder à cette section.") ;
        clearInterval(this.handler);
    }

    ajaxSave()
    {
        let params = [
            ["function", "saveMultiConv"], 
            ["data", this.save()], 
            ["email", this.email], 
            ["id", this.id],
        ]; 

        this.xhr.sendListAsGet(TCHAT_AJAX_URL, params);
    }

    ajaxRead()
    {
        if (!this.tchat.isVisible() || !this.id)
            return;

        let xhr = HttpRequest(); 
        let params = 
            [
                ["function", "readMultiConv"], 
                ["id", this.id] 
            ];

        let func = () => this.read(xhr.responseText.replace(/\/\/amp;\/\//g, "&"), true);
        xhr.sendListAsGet(TCHAT_AJAX_URL, params, func);
    }

    newMessage(txt)
    {
        if (!this.canSend)
            return;
        this.ip = prenom();
        this.forbideToSend();
        let m = super.newMessage(txt, false);
        m.setShort(true);
    }

    forbideToSend()
    {
        this.canSend = false; 
        this.tchat.div.msg.classList.add("disabled")
        this.tchat.div.msg.content.div.hide();
        this.timeSend = Date.now();
        this.canSendhandler = setInterval(() => this.checkIfCanSendMessage(), 2500);
    }

    allowToSend()
    {
        this.canSend = true; 
        this.tchat.div.msg.classList.remove("disabled")
        this.tchat.div.msg.content.div.show();
        clearInterval(this.canSendHandler);
    }

    checkIfCanSendMessage()
    {
        if (Date.now() - this.timeSend >= 5000)
        {
            this.allowToSend();
        }
    }

    save()
    {
        let s = ""; 
        let msg = this.messages.last();
        s = msg.save(prenom());

        return s;
    } 

    read(str, isConv2=false)
    {
        let t = str.split("//MESSAGE//");
        t.pop();
        this.removeLast25();
        for(let i=0; i<t.length; i++)
        {
            if (i >= this.messages.length)
                this.createMessage(t[i]);
        }

        this.drawMessages();
        for (let m of this.messages)
            m.setShort(true);
    }
}
