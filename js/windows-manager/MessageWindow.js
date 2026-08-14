class MessageWindow extends mlWindow
{
    constructor(WindowsManager, 
        title, 
        content=null, 
        draggable=false, 
        hideOnOK=true, btnText="OK")
    {
        super(WindowsManager, title, content, draggable);
        this.div.classList.add("popup");
        this.button = this.footer().newButton(btnText);
        if (hideOnOK)
            this.setEventsC();

        if (innerWidth<840)
            this.setScreenWidth(96);
    }

    setEventsC()
    {
        this.button.addEventListener("click", ()=> this.hide());
    }

    addEventOnButton(cb)
    {
        this.button.addEventListener("click", cb);
    }

    setButtonContent(content)
    {
        this.setElmt(content, this.button);
    }

    setButtonTxt(txt)
    {
        this.setButtonContent(txt);
    }

    enableButton()
    {
        this.button.disabled = false;
    }

    disableButton()
    {
        this.button.disabled = true;
    }

    removeButton()
    {
        this.button.remove();
    }

    onShow()
    {
        super.onShow();
        this.onDocumentResize();
    }

    onKey(e)
    {
        if (e.key == "Enter" && e.ctrlKey)
        {
            e.preventDefault();
            e.stopPropagation();
            this.button.click();
            return;
        }
        if (D.activeElement.isEditable())
            return;

        else if (e.key == "Enter")
        {
            e.preventDefault();
            e.stopPropagation();
            this.button.click();
        }
    }
}
